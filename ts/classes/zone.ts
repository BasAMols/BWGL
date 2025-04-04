import { GlElementAttributes } from './elementBase';
import { GlElementType } from './rendering/glRenderer';
import { GlController } from './controller';
import { Vector3, v3 } from './math/vector3';
import { Matrix4 } from './math/matrix4';


export type ZoneAttributes = GlElementAttributes & {
    fixed?: boolean;
    absoluteOffset?: Vector3
    mesh?: boolean
};

export type ZoneType = 'collider' | 'trigger' | 'interact';
export abstract class Zone extends GlController {
    public type: GlElementType = 'collider';
    public fixed: boolean;
    public abstract zoneType: ZoneType;
    public overlaps: Zone[] = [];
    public absoluteOffset: Vector3;

    public constructor(attr: ZoneAttributes) {
        super(attr);
        this.fixed = Boolean(attr.fixed);
        this.absoluteOffset = attr.absoluteOffset || v3();
    }

    get globalPosition(){
        return super.globalPosition.add(this.absoluteOffset);
    }

    public calculateOverlaps() {
        this.overlaps = this.level.levelZones.filter(this.overlap.bind(this)) || [];
    }

    public overlap(othr: Zone): boolean {
        
        //myself
        if (this === othr) return false;

        //inactive objects dont react
        if (!othr.active) return false;

        //fixed objects dont react
        if (this.fixed) return false;

        // If both objects have no effective rotation (including parent rotations), use faster AABB collision
        if (this.worldRotation.equals(v3()) && othr.worldRotation.equals(v3())) {
            //do these NOT overlap?
            if (this.globalPosition.x + this.size.x < othr.globalPosition.x) return false; // to the x- of other
            if (this.globalPosition.x > othr.globalPosition.x + othr.size.x) return false; // to the x+ of other
            if (this.globalPosition.y + this.size.y < othr.globalPosition.y) return false; // to the y- of other
            if (this.globalPosition.y > othr.globalPosition.y + othr.size.y) return false; // to the y+ of other
            if (this.globalPosition.z + this.size.z < othr.globalPosition.z) return false; // to the z- of other
            if (this.globalPosition.z > othr.globalPosition.z + othr.size.z) return false; // to the z+ of other

            return true;
        }
        
        // For rotated cuboids, use Separating Axis Theorem (SAT)
        return this.satOverlap(othr);
    }

    private satOverlap(othr: Zone): boolean {
        // Get vertices of both cuboids
        const myVertices = this.getVertices();
        const othrVertices = othr.getVertices();

        // Get axes to test from both cuboids
        const axes = this.getSatAxes(othr);

        // We'll track minimum penetration for debugging
        let minPenetration = Number.MAX_VALUE;
        let minAxis: Vector3 | null = null;

        // Test each axis for separation
        for (const axis of axes) {
            // Project vertices onto axis
            const myProjection = this.projectOntoAxis(myVertices, axis);
            const othrProjection = this.projectOntoAxis(othrVertices, axis);

            // Calculate penetration depth
            const penetration = Math.min(
                myProjection.max - othrProjection.min,
                othrProjection.max - myProjection.min
            );

            // If there's a gap, objects don't collide
            if (myProjection.max < othrProjection.min || othrProjection.max < myProjection.min) {
                return false;
            }

            // Track the minimum penetration for MTV calculation
            if (penetration < minPenetration) {
                minPenetration = penetration;
                minAxis = axis;
            }
        }

        // Special handling for face-to-face cases - check if approaching direction
        // aligns with a face normal, which can be missed in SAT due to precision
        if (minPenetration > 0 && minPenetration < 0.001) {
            // This is a near-miss case, likely a face-to-face collision
            // Let's be more lenient and consider it a collision
            return true;
        }

        // If we got here, no separating axis was found, so objects are colliding
        return true;
    }

    /**
     * Get vertices of the cuboid in world space, considering rotation
     */
    protected getVertices(): Vector3[] {
        const halfSize = this.size.scale(0.5);
        
        // Calculate parent position without the absoluteOffset (which is applied separately)
        const parentPosition = super.globalPosition;
        const offsetPosition = parentPosition.add(this.absoluteOffset); // Apply offset
        
        // Base vertices at local origin
        const vertices = [
            v3(-halfSize.x, -halfSize.y, -halfSize.z),
            v3(halfSize.x, -halfSize.y, -halfSize.z),
            v3(halfSize.x, halfSize.y, -halfSize.z),
            v3(-halfSize.x, halfSize.y, -halfSize.z),
            v3(-halfSize.x, -halfSize.y, halfSize.z),
            v3(halfSize.x, -halfSize.y, halfSize.z),
            v3(halfSize.x, halfSize.y, halfSize.z),
            v3(-halfSize.x, halfSize.y, halfSize.z)
        ];

        // For rotated objects, use full matrix transformation
        if (!this.worldRotation.equals(v3())) {
            // Adjust for anchor point
            return vertices.map(vertex => {
                const adjustedVertex = vertex.add(this.anchorPoint.scale(-1));
                
                // Create a matrix for the vertex
                const vertexMatrix = new Matrix4().translate(adjustedVertex);
                
                // Apply rotation from the parent
                const rotationMatrix = new Matrix4().rotate(this.worldRotation);
                
                // Combine rotation with vertex
                const rotatedVertex = rotationMatrix.multiply(vertexMatrix).position;
                
                // Add position with offset
                return rotatedVertex.add(offsetPosition.add(halfSize));
            });
        } else {
            // For non-rotated objects, use simpler calculation
            // This ensures backward compatibility with the original AABB implementation
            const position = offsetPosition;
            return vertices.map(vertex => vertex.add(position.add(halfSize)));
        }
    }

    /**
     * Get all axes to test for SAT
     */
    protected getSatAxes(othr: Zone): Vector3[] {
        const axes: Vector3[] = [];

        // Axes from this cuboid's faces - these are critical for face collisions
        const thisNormals = [
            this.getRotatedAxis(v3(1, 0, 0)),
            this.getRotatedAxis(v3(0, 1, 0)),
            this.getRotatedAxis(v3(0, 0, 1))
        ];
        
        axes.push(...thisNormals);

        // Axes from other cuboid's faces
        const othrNormals = [
            othr.getRotatedAxis(v3(1, 0, 0)),
            othr.getRotatedAxis(v3(0, 1, 0)),
            othr.getRotatedAxis(v3(0, 0, 1))
        ];
        
        axes.push(...othrNormals);

        // Cross products of edges (9 combinations for cuboids)
        for (const a of thisNormals) {
            for (const b of othrNormals) {
                const cross = this.crossProduct(a, b);
                // Skip near-zero axes (parallel edges) - but we need to be careful
                // because face-to-face collisions can happen with parallel faces
                if (cross.magnitude() > 0.0001) {
                    axes.push(cross.normalize());
                } else {
                    // If faces are parallel, we should be extra careful about face collision
                    // Here we've detected parallel face normals
                    // Check if this axis needs special handling later
                }
            }
        }

        // Ensure all axes are normalized
        return axes.map(axis => axis.magnitude() > 0 ? axis.normalize() : axis);
    }

    /**
     * Get rotated axis
     */
    protected getRotatedAxis(axis: Vector3): Vector3 {
        // Create a matrix for the axis direction
        const axisMatrix = new Matrix4().translate(axis);
        
        // Create a rotation-only matrix from worldRotation
        const rotationMatrix = new Matrix4().rotate(this.worldRotation);
        
        // Apply rotation to the axis
        const transformedMatrix = rotationMatrix.multiply(axisMatrix);
        
        // Extract the transformed direction and normalize
        return transformedMatrix.position.normalize();
    }

    /**
     * Calculate cross product of two vectors
     */
    protected crossProduct(a: Vector3, b: Vector3): Vector3 {
        return v3(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }

    /**
     * Project vertices onto an axis and return min/max values
     * This is critical for face-to-face collisions to work correctly
     */
    protected projectOntoAxis(vertices: Vector3[], axis: Vector3): { min: number, max: number } {
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;

        // Ensure axis is normalized
        const normalizedAxis = axis.magnitude() > 0 ? axis.normalize() : axis;

        for (const vertex of vertices) {
            // Project vertex onto axis using dot product
            const projection = this.dotProduct(vertex, normalizedAxis);
            
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }

        return { min, max };
    }

    /**
     * Calculate dot product of two vectors
     */
    protected dotProduct(a: Vector3, b: Vector3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    // Public interface methods to access protected functionality
    public getCollisionVertices(): Vector3[] {
        return this.getVertices();
    }
    
    public getCollisionAxes(othr: Zone): Vector3[] {
        return this.getSatAxes(othr);
    }
    
    public projectVerticesOntoAxis(vertices: Vector3[], axis: Vector3): { min: number, max: number } {
        return this.projectOntoAxis(vertices, axis);
    }
    
    public calculateDotProduct(a: Vector3, b: Vector3): number {
        return this.dotProduct(a, b);
    }
    
    public getRotatedNormal(direction: Vector3): Vector3 {
        return this.getRotatedAxis(direction);
    }
}