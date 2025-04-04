import { Vector3 } from '../../classes/math/vector3';
import { BroadPhase } from './BroadPhase';
import { CollisionBody } from './CollisionBody';
import { CollisionManifold } from './CollisionManifold';
import { CollisionPair } from './CollisionPair';

/**
 * Core collision system that handles all collision detection and resolution
 * Completely independent of camera, input, or game logic
 */
export class CollisionSystem {
    private bodies: CollisionBody[] = [];
    private broadPhase: BroadPhase;
    
    constructor() {
        this.broadPhase = new BroadPhase();
    }
    
    /**
     * Add a collision body to the system
     */
    public addBody(body: CollisionBody): void {
        this.bodies.push(body);
        this.broadPhase.addBody(body);
    }
    
    /**
     * Remove a collision body from the system
     */
    public removeBody(body: CollisionBody): void {
        const index = this.bodies.indexOf(body);
        if (index !== -1) {
            this.bodies.splice(index, 1);
            this.broadPhase.removeBody(body);
        }
    }
    
    /**
     * Update the collision system for the current frame
     * @param deltaTime Time since last update in seconds
     */
    public update(deltaTime: number): void {
        // Step 1: Update broad phase
        this.broadPhase.update();
        
        // Step 2: Get potential collision pairs
        const pairs = this.broadPhase.getPotentialPairs();
        
        // Step 3: Narrow phase collision detection
        const manifolds: CollisionManifold[] = [];
        
        for (const pair of pairs) {
            const manifold = this.detectCollision(pair);
            if (manifold) {
                manifolds.push(manifold);
            }
        }
        
        // Step 4: Resolve collisions
        this.resolveCollisions(manifolds, deltaTime);
    }
    
    /**
     * Detect collision between two bodies
     * Returns null if no collision, or a CollisionManifold if collision detected
     */
    private detectCollision(pair: CollisionPair): CollisionManifold | null {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        
        // Get closest points between bodies
        const closestPoints = this.findClosestPoints(bodyA, bodyB);
        
        // If points are overlapping, we have a collision
        if (closestPoints.distance < 0) {
            return new CollisionManifold(
                bodyA,
                bodyB,
                closestPoints.normal,
                -closestPoints.distance, // Penetration depth
                closestPoints.contactPoint
            );
        }
        
        return null;
    }
    
    /**
     * Find the closest points between two collision bodies using SAT
     */
    private findClosestPoints(bodyA: CollisionBody, bodyB: CollisionBody) {
        const obbA = bodyA.getOBB();
        const obbB = bodyB.getOBB();
        
        // Get axes to test (face normals of both boxes)
        const axes = [
            ...obbA.axes,
            ...obbB.axes,
            // Cross products of edges
            ...this.getEdgeAxes(obbA.axes, obbB.axes)
        ];
        
        // Find axis of least penetration
        let minPenetration = Infinity;
        let minAxis: Vector3 | null = null;
        let flip = false;
        
        for (const axis of axes) {
            // Project both boxes onto the axis
            const projA = this.projectOBB(obbA, axis);
            const projB = this.projectOBB(obbB, axis);
            
            // Calculate penetration
            const overlap = Math.min(
                projA.max - projB.min,
                projB.max - projA.min
            );
            
            // If there's no overlap on any axis, boxes don't intersect
            if (overlap <= 0) {
                return {
                    distance: -overlap,
                    normal: axis,
                    contactPoint: Vector3.f(0)
                };
            }
            
            // Track minimum penetration
            const penetration = Math.abs(overlap);
            if (penetration < minPenetration) {
                minPenetration = penetration;
                minAxis = axis;
                // Determine if we need to flip the normal
                flip = (projA.max + projA.min) < (projB.max + projB.min);
            }
        }
        
        if (!minAxis) {
            // This shouldn't happen if axes list is non-empty
            return {
                distance: 0,
                normal: new Vector3(1, 0, 0),
                contactPoint: bodyA.position
            };
        }
        
        // Calculate contact point
        const contactPoint = this.findContactPoint(bodyA, bodyB, minAxis, flip);
        
        return {
            distance: -minPenetration,
            normal: flip ? minAxis.scale(-1) : minAxis,
            contactPoint
        };
    }
    
    /**
     * Get edge-edge cross product axes for SAT
     */
    private getEdgeAxes(axesA: Vector3[], axesB: Vector3[]): Vector3[] {
        const axes: Vector3[] = [];
        
        for (const a of axesA) {
            for (const b of axesB) {
                const cross = a.cross(b);
                if (cross.magnitude() > 0.001) {
                    axes.push(cross.normalize());
                }
            }
        }
        
        return axes;
    }
    
    /**
     * Project an OBB onto an axis
     */
    private projectOBB(obb: ReturnType<CollisionBody['getOBB']>, axis: Vector3) {
        const vertices = obb.rotation.rotate(new Vector3(obb.halfSize.x, 0, 0))
            .add(obb.rotation.rotate(new Vector3(0, obb.halfSize.y, 0)))
            .add(obb.rotation.rotate(new Vector3(0, 0, obb.halfSize.z)));
            
        let min = axis.dot(obb.center.subtract(vertices));
        let max = axis.dot(obb.center.add(vertices));
        
        if (min > max) {
            [min, max] = [max, min];
        }
        
        return { min, max };
    }
    
    /**
     * Find the contact point between two intersecting OBBs
     */
    private findContactPoint(
        bodyA: CollisionBody,
        bodyB: CollisionBody,
        normal: Vector3,
        flip: boolean
    ): Vector3 {
        // Get vertices of both boxes
        const verticesA = bodyA.getVertices();
        const verticesB = bodyB.getVertices();
        
        // If normal points from A to B, find deepest point of A into B
        const referenceBody = flip ? bodyB : bodyA;
        const incidentBody = flip ? bodyA : bodyB;
        const referenceVertices = flip ? verticesB : verticesA;
        const incidentVertices = flip ? verticesA : verticesB;
        
        // Find the deepest point of the incident body
        let deepestPoint: Vector3 | null = null;
        let maxPenetration = -Infinity;
        
        for (const vertex of incidentVertices) {
            const penetration = normal.dot(referenceBody.position.subtract(vertex));
            if (penetration > maxPenetration) {
                maxPenetration = penetration;
                deepestPoint = vertex;
            }
        }
        
        return deepestPoint ?? incidentBody.position;
    }
    
    /**
     * Resolve a set of collisions
     */
    private resolveCollisions(manifolds: CollisionManifold[], deltaTime: number): void {
        for (const manifold of manifolds) {
            // Apply position correction to prevent sinking
            this.resolvePosition(manifold);
            
            // Apply velocity resolution if bodies are dynamic
            this.resolveVelocity(manifold, deltaTime);
        }
    }
    
    /**
     * Resolve position penetration
     */
    private resolvePosition(manifold: CollisionManifold): void {
        const bodyA = manifold.bodyA;
        const bodyB = manifold.bodyB;
        
        // Calculate position correction
        const percent = 0.8; // Penetration percentage to correct
        const slop = 0.01; // Penetration allowance
        const correction = Math.max(manifold.penetration - slop, 0) * percent;
        
        // Apply correction based on mass ratio
        if (bodyA.isStatic) {
            // Only move body B
            bodyB.position = bodyB.position.add(manifold.normal.scale(correction));
        } else if (bodyB.isStatic) {
            // Only move body A
            bodyA.position = bodyA.position.add(manifold.normal.scale(-correction));
        } else {
            // Move both bodies
            const totalMass = bodyA.inverseMass + bodyB.inverseMass;
            const ratioA = bodyA.inverseMass / totalMass;
            const ratioB = bodyB.inverseMass / totalMass;
            
            bodyA.position = bodyA.position.add(manifold.normal.scale(-correction * ratioA));
            bodyB.position = bodyB.position.add(manifold.normal.scale(correction * ratioB));
        }
    }
    
    /**
     * Resolve velocity collision
     */
    private resolveVelocity(manifold: CollisionManifold, deltaTime: number): void {
        const bodyA = manifold.bodyA;
        const bodyB = manifold.bodyB;
        
        if (bodyA.isStatic && bodyB.isStatic) return;
        
        // Calculate relative velocity
        const relativeVelocity = bodyB.velocity.subtract(bodyA.velocity);
        
        // Calculate relative velocity along normal
        const normalVelocity = manifold.normal.dot(relativeVelocity);
        
        // If objects are moving apart, no resolution needed
        if (normalVelocity > 0) return;
        
        // Calculate restitution (bounciness)
        const restitution = Math.min(bodyA.restitution, bodyB.restitution);
        
        // Calculate impulse scalar
        let j = -(1 + restitution) * normalVelocity;
        j /= bodyA.inverseMass + bodyB.inverseMass;
        
        // Apply impulse
        const impulse = manifold.normal.scale(j);
        
        if (!bodyA.isStatic) {
            bodyA.velocity = bodyA.velocity.subtract(impulse.scale(bodyA.inverseMass));
        }
        
        if (!bodyB.isStatic) {
            bodyB.velocity = bodyB.velocity.add(impulse.scale(bodyB.inverseMass));
        }
        
        // Apply friction
        this.resolveFriction(manifold, j);
    }
    
    /**
     * Resolve friction forces
     */
    private resolveFriction(manifold: CollisionManifold, normalImpulse: number): void {
        const bodyA = manifold.bodyA;
        const bodyB = manifold.bodyB;
        
        // Calculate relative velocity
        const relativeVelocity = bodyB.velocity.subtract(bodyA.velocity);
        
        // Calculate tangent vector (perpendicular to normal)
        const tangent = relativeVelocity.subtract(
            manifold.normal.scale(relativeVelocity.dot(manifold.normal))
        ).normalize();
        
        // Calculate friction impulse scalar
        const friction = Math.sqrt(bodyA.friction * bodyB.friction);
        let jt = -relativeVelocity.dot(tangent);
        jt /= bodyA.inverseMass + bodyB.inverseMass;
        
        // Clamp friction
        const maxFriction = friction * normalImpulse;
        jt = Math.max(-maxFriction, Math.min(maxFriction, jt));
        
        // Apply friction impulse
        const frictionImpulse = tangent.scale(jt);
        
        if (!bodyA.isStatic) {
            bodyA.velocity = bodyA.velocity.subtract(frictionImpulse.scale(bodyA.inverseMass));
        }
        
        if (!bodyB.isStatic) {
            bodyB.velocity = bodyB.velocity.add(frictionImpulse.scale(bodyB.inverseMass));
        }
    }
} 