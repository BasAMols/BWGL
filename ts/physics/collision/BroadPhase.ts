import { Vector3 } from '../../classes/math/vector3';
import { CollisionBody } from './CollisionBody';
import { CollisionPair } from './CollisionPair';

/**
 * Handles broad phase collision detection using a spatial hash grid
 * This efficiently reduces the number of potential collision pairs
 */
export class BroadPhase {
    private bodies: CollisionBody[] = [];
    private cellSize: number = 10; // Size of each grid cell
    private grid: Map<string, CollisionBody[]> = new Map();
    
    /**
     * Add a body to the broad phase
     */
    public addBody(body: CollisionBody): void {
        this.bodies.push(body);
    }
    
    /**
     * Remove a body from the broad phase
     */
    public removeBody(body: CollisionBody): void {
        const index = this.bodies.indexOf(body);
        if (index !== -1) {
            this.bodies.splice(index, 1);
        }
    }
    
    /**
     * Update the spatial hash grid
     */
    public update(): void {
        // Clear the grid
        this.grid.clear();
        
        // Insert all bodies into the grid
        for (const body of this.bodies) {
            const aabb = body.getAABB();
            const cells = this.getCellsForAABB(aabb.min, aabb.max);
            
            // Add body to each cell it overlaps
            for (const cell of cells) {
                if (!this.grid.has(cell)) {
                    this.grid.set(cell, []);
                }
                this.grid.get(cell)!.push(body);
            }
        }
    }
    
    /**
     * Get all potential collision pairs
     */
    public getPotentialPairs(): CollisionPair[] {
        const pairs = new Map<string, CollisionPair>();
        
        // Check each cell for potential collisions
        for (const [_, bodies] of this.grid) {
            // Check each pair of bodies in the cell
            for (let i = 0; i < bodies.length; i++) {
                for (let j = i + 1; j < bodies.length; j++) {
                    const bodyA = bodies[i];
                    const bodyB = bodies[j];
                    
                    // Skip if both bodies are static
                    if (bodyA.isStatic && bodyB.isStatic) continue;
                    
                    // Create a unique key for this pair
                    const pair = new CollisionPair(bodyA, bodyB);
                    const key = pair.getKey();
                    
                    // Only add if we haven't seen this pair before
                    if (!pairs.has(key)) {
                        pairs.set(key, pair);
                    }
                }
            }
        }
        
        return Array.from(pairs.values());
    }
    
    /**
     * Get all grid cells that an AABB overlaps
     */
    private getCellsForAABB(min: Vector3, max: Vector3): string[] {
        const cells: string[] = [];
        
        // Calculate cell coordinates
        const minCell = this.worldToCell(min);
        const maxCell = this.worldToCell(max);
        
        // Iterate over all cells that the AABB overlaps
        for (let x = minCell.x; x <= maxCell.x; x++) {
            for (let y = minCell.y; y <= maxCell.y; y++) {
                for (let z = minCell.z; z <= maxCell.z; z++) {
                    cells.push(this.getCellKey(x, y, z));
                }
            }
        }
        
        return cells;
    }
    
    /**
     * Convert a world position to cell coordinates
     */
    private worldToCell(position: Vector3): { x: number; y: number; z: number } {
        return {
            x: Math.floor(position.x / this.cellSize),
            y: Math.floor(position.y / this.cellSize),
            z: Math.floor(position.z / this.cellSize)
        };
    }
    
    /**
     * Get a unique key for a cell
     */
    private getCellKey(x: number, y: number, z: number): string {
        return `${x},${y},${z}`;
    }
} 