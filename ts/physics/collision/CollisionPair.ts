import { CollisionBody } from './CollisionBody';

/**
 * Represents a pair of bodies that might be colliding
 * Used by the broad phase to track potential collisions
 */
export class CollisionPair {
    constructor(
        public bodyA: CollisionBody,
        public bodyB: CollisionBody
    ) {}
    
    /**
     * Check if this pair contains the given bodies (in any order)
     */
    public matches(bodyA: CollisionBody, bodyB: CollisionBody): boolean {
        return (
            (this.bodyA === bodyA && this.bodyB === bodyB) ||
            (this.bodyA === bodyB && this.bodyB === bodyA)
        );
    }
    
    /**
     * Get a unique key for this pair
     * Used for quick lookup and deduplication
     */
    public getKey(): string {
        // Use object IDs to create a unique key
        const idA = (this.bodyA as any).__id ?? '';
        const idB = (this.bodyB as any).__id ?? '';
        return idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`;
    }
} 