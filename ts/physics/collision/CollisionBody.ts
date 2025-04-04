import { Quaternion } from '../../classes/math/quaternion';
import { Vector3 } from '../../classes/math/vector3';

/**
 * Represents a physical body in the collision system
 * This is a pure physics representation, completely separate from game objects
 */
export class CollisionBody {
    public position: Vector3;
    public rotation: Quaternion;
    public velocity: Vector3;
    public angularVelocity: Vector3;
    public size: Vector3;
    public isStatic: boolean;
    public restitution: number;
    public friction: number;
    public inverseMass: number;
    public inverseInertia: Vector3;
    
    constructor(
        position: Vector3,
        size: Vector3,
        options: {
            isStatic?: boolean;
            mass?: number;
            restitution?: number;
            friction?: number;
            rotation?: Quaternion;
        } = {}
    ) {
        this.position = position;
        this.rotation = options.rotation ?? Quaternion.identity();
        this.velocity = Vector3.f(0);
        this.angularVelocity = Vector3.f(0);
        this.size = size;
        this.isStatic = options.isStatic ?? false;
        this.restitution = options.restitution ?? 0.2;
        this.friction = options.friction ?? 0.2;
        
        // Calculate inverse mass (0 for static objects)
        this.inverseMass = this.isStatic ? 0 : 1 / (options.mass ?? 1);
        
        // Calculate inverse inertia tensor (box)
        const mass = options.mass ?? 1;
        const w = size.x;
        const h = size.y;
        const d = size.z;
        this.inverseInertia = this.isStatic ? Vector3.f(0) : new Vector3(
            12 / (mass * (h * h + d * d)),
            12 / (mass * (w * w + d * d)),
            12 / (mass * (w * w + h * h))
        );
    }
    
    /**
     * Get the oriented bounding box for collision detection
     */
    public getOBB() {
        return {
            center: this.position,
            halfSize: this.size.scale(0.5),
            rotation: this.rotation,
            axes: [
                this.rotation.rotate(new Vector3(1, 0, 0)),
                this.rotation.rotate(new Vector3(0, 1, 0)),
                this.rotation.rotate(new Vector3(0, 0, 1))
            ]
        };
    }
    
    /**
     * Get world space vertices of the box
     */
    public getVertices(): Vector3[] {
        const halfSize = this.size.scale(0.5);
        const vertices: Vector3[] = [];
        
        // Generate local space vertices
        for (let i = 0; i < 8; i++) {
            const x = ((i & 1) ? 1 : -1) * halfSize.x;
            const y = ((i & 2) ? 1 : -1) * halfSize.y;
            const z = ((i & 4) ? 1 : -1) * halfSize.z;
            
            // Transform to world space
            const local = new Vector3(x, y, z);
            const world = this.position.add(this.rotation.rotate(local));
            vertices.push(world);
        }
        
        return vertices;
    }
    
    /**
     * Update the body's position and rotation based on velocities
     */
    public integrate(deltaTime: number): void {
        if (this.isStatic) return;
        
        // Update linear motion
        this.position = this.position.add(this.velocity.scale(deltaTime));
        
        // Update angular motion
        if (this.angularVelocity.magnitude() > 0) {
            const angle = this.angularVelocity.magnitude() * deltaTime;
            const axis = this.angularVelocity.normalize();
            const rotation = Quaternion.fromAxisAngle(axis, angle);
            this.rotation = rotation.multiply(this.rotation).normalize();
        }
    }

    /**
     * Get axis-aligned bounding box that contains the rotated OBB
     */
    public getAABB() {
        const vertices = this.getVertices();
        const min = new Vector3(Infinity, Infinity, Infinity);
        const max = new Vector3(-Infinity, -Infinity, -Infinity);
        
        // Find min/max of all vertices
        for (const v of vertices) {
            min.x = Math.min(min.x, v.x);
            min.y = Math.min(min.y, v.y);
            min.z = Math.min(min.z, v.z);
            max.x = Math.max(max.x, v.x);
            max.y = Math.max(max.y, v.y);
            max.z = Math.max(max.z, v.z);
        }
        
        return { min, max };
    }
} 