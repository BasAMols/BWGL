import { Vector3 } from '../../classes/math/vector3';
import { CollisionBody } from './CollisionBody';

/**
 * Contains information about a collision contact between two bodies
 * This is the result of narrow phase collision detection
 */
export class CollisionManifold {
    constructor(
        public bodyA: CollisionBody,
        public bodyB: CollisionBody,
        public normal: Vector3,
        public penetration: number,
        public contactPoint: Vector3
    ) {}
    
    /**
     * Get the relative velocity at the contact point
     */
    public getRelativeVelocity(): Vector3 {
        return this.bodyB.velocity.subtract(this.bodyA.velocity);
    }
    
    /**
     * Check if the bodies are moving apart (no collision resolution needed)
     */
    public isMovingApart(): boolean {
        const relativeVelocity = this.getRelativeVelocity();
        return this.normal.dot(relativeVelocity) > 0;
    }
    
    /**
     * Get the collision basis (normal and tangent vectors)
     * Used for decomposing forces into normal and tangential components
     */
    public getCollisionBasis(): { normal: Vector3; tangent: Vector3 } {
        const relativeVelocity = this.getRelativeVelocity();
        const normal = this.normal;
        
        // Calculate tangent as the component of relative velocity perpendicular to normal
        const normalVelocity = normal.scale(normal.dot(relativeVelocity));
        const tangentVelocity = relativeVelocity.subtract(normalVelocity);
        
        // If tangential velocity is zero, use any perpendicular vector
        const tangent = tangentVelocity.magnitude() > 0.0001 
            ? tangentVelocity.normalize()
            : this.getArbitraryTangent();
            
        return { normal, tangent };
    }
    
    /**
     * Get an arbitrary vector perpendicular to the normal
     */
    private getArbitraryTangent(): Vector3 {
        // Find least dominant axis of normal
        const absX = Math.abs(this.normal.x);
        const absY = Math.abs(this.normal.y);
        const absZ = Math.abs(this.normal.z);
        
        let tangent: Vector3;
        if (absX <= absY && absX <= absZ) {
            tangent = new Vector3(1, 0, 0);
        } else if (absY <= absX && absY <= absZ) {
            tangent = new Vector3(0, 1, 0);
        } else {
            tangent = new Vector3(0, 0, 1);
        }
        
        // Project out normal component to ensure perpendicularity
        return tangent.subtract(
            this.normal.scale(this.normal.dot(tangent))
        ).normalize();
    }
} 