import { Util } from './util/utils';
import { Vector3, v3 } from './math/vector3';
import { Zone, ZoneType } from './zone';


export class Collider extends Zone {
    public zoneType: ZoneType = 'collider';
    
    calculateCollision(velocity?: Vector3): Vector3[] {
        this.calculateOverlaps();
        
        // Get only collider-type overlaps
        const colliders = this.overlaps.filter((o) => o.zoneType === 'collider');
        
        if (colliders.length === 0) {
            return [];
        }
        
        // Calculate exit velocities, filter out zero vectors, but make sure small values are kept for thin walls
        const exitVelocities = colliders
            .map((collider: Zone) => {
                const exitV = this.calculateExitVelocity(collider, velocity);
                
                // Special handling for thin walls - ensure we return something
                if (collider.size.x <= 5 || collider.size.y <= 5 || collider.size.z <= 5) {
                    // For thin walls, ensure minimum magnitude to prevent pass-through
                    if (exitV.magnitude() < 0.01) {
                        // If exit vector too small, create one based on position
                        const myCenter = this.globalPosition.add(this.size.scale(0.5));
                        const othrCenter = collider.globalPosition.add(collider.size.scale(0.5));
                        const direction = myCenter.subtract(othrCenter).normalize();
                        
                        // Return minimal push in direction away from wall
                        return direction.scale(0.05);
                    }
                }
                
                return exitV;
            })
            .filter((v: Vector3) => v.magnitude() > 0);
            
        // If we have no valid exit velocities, return empty array
        if (exitVelocities.length === 0) {
            return [];
        }
        
        // For thin walls, prioritize consistent exit directions to prevent oscillation
        if (exitVelocities.length > 1) {
            // First check if any exit vectors are from thin walls
            const thinWallExists = this.overlaps.some(o => 
                o.zoneType === 'collider' && (o.size.x <= 5 || o.size.y <= 5 || o.size.z <= 5));
                
            if (thinWallExists) {
                // If we have thin walls, prefer consistent axis-aligned exit vectors
                const xExits = exitVelocities.filter(v => Math.abs(v.x) > 0.01 && Math.abs(v.y) < 0.01 && Math.abs(v.z) < 0.01);
                if (xExits.length > 0) {
                    // Prefer exiting along X axis for walls parallel to X plane
                    return [xExits[0].scale(1.2)]; // Slightly increase force
                }
                
                const zExits = exitVelocities.filter(v => Math.abs(v.z) > 0.01 && Math.abs(v.x) < 0.01 && Math.abs(v.y) < 0.01);
                if (zExits.length > 0) {
                    // Prefer exiting along Z axis for walls parallel to Z plane
                    return [zExits[0].scale(1.2)];
                }
            }
        }
        
        // Sort exit velocities by magnitude (shortest first for better stability)
        exitVelocities.sort((a: Vector3, b: Vector3) => a.magnitude() - b.magnitude());
        
        return exitVelocities;
    }

    public calculateExitVelocity(othr: Zone, velocity?: Vector3): Vector3 {
        // If both objects are not rotated (including parent rotations), use the simpler AABB calculation
        if (this.worldRotation.equals(v3()) && othr.worldRotation.equals(v3())) {
            // Get object centers, with proper offset handling - ensure anchor point is considered
            const myPos = super.globalPosition.add(this.absoluteOffset);
            const othrPos = othr.globalPosition;
            
            // Calculate centers considering anchor points
            const myCenter = myPos.add(this.size.scale(0.5));
            const othrCenter = othrPos.add(othr.size.scale(0.5));
            
            // Add a larger safety margin for thin walls
            const safetyMargin = 0.1; // Increased for better acute angle detection
            
            // Calculate overlaps on each axis
            const xOverlapNeg = myPos.x + this.size.x - othrPos.x + safetyMargin;
            const xOverlapPos = (othrPos.x + othr.size.x) - myPos.x + safetyMargin;
            
            const yOverlapNeg = myPos.y + this.size.y - othrPos.y + safetyMargin;
            const yOverlapPos = (othrPos.y + othr.size.y) - myPos.y + safetyMargin;
            
            const zOverlapNeg = myPos.z + this.size.z - othrPos.z + safetyMargin;
            const zOverlapPos = (othrPos.z + othr.size.z) - myPos.z + safetyMargin;

            // Force exit direction based on wall orientation for thin walls
            if (othr.size.x <= 5) {
                // This is a thin wall in X direction (like your test wall)
                
                // Determine which side of the wall we're on
                const onRightSide = myCenter.x > othrCenter.x;
                
                // Apply a stronger push for thin walls, even stronger for acute angles
                const pushMultiplier = 1.5;
                
                // Special handling for acute angles - check if velocity is almost parallel to wall
                if (velocity && velocity.magnitude() > 0.01) {
                    const vNorm = velocity.clone().normalize();
                    const wallNormal = v3(1, 0, 0); // X-axis for X-thin walls
                    const dotProduct = Math.abs(vNorm.x); // Dot product with X-axis
                    
                    // If approaching at very acute angle (nearly parallel to wall)
                    if (dotProduct < 0.3) { // Less than ~17 degrees from parallel
                        // Use stronger push and ensure it's perpendicular to wall
                        if (onRightSide) {
                            return v3(Math.max(xOverlapPos * 3, 0.2), 0, 0);
                        } else {
                            return v3(-Math.max(xOverlapNeg * 3, 0.2), 0, 0);
                        }
                    }
                }
                
                if (onRightSide) {
                    // We're on the right side of the wall, push right (+X) with velocity check
                    const exitV = v3(xOverlapPos * pushMultiplier, 0, 0);
                    
                    // If we have velocity info, enhance exit vector based on approach angle
                    if (velocity && velocity.magnitude() > 0) {
                        // If moving against the wall significantly, apply extra force
                        if (velocity.x < -0.01) {
                            return exitV.scale(2.5); // Stronger push to counteract momentum
                        }
                    }
                    
                    return exitV;
                } else {
                    // We're on the left side of the wall, push left (-X) with velocity check
                    const exitV = v3(-xOverlapNeg * pushMultiplier, 0, 0);
                    
                    if (velocity && velocity.magnitude() > 0) {
                        if (velocity.x > 0.01) {
                            return exitV.scale(2.5);
                        }
                    }
                    
                    return exitV;
                }
            }
            
            // Similar enhanced handling for Y and Z walls
            if (othr.size.y <= 5) {
                // Logic for Y-thin walls...
                const onTopSide = myCenter.y > othrCenter.y;
                const pushMultiplier = 1.5;
                
                // Special handling for acute angles
                if (velocity && velocity.magnitude() > 0.01) {
                    const vNorm = velocity.clone().normalize();
                    const dotProduct = Math.abs(vNorm.y);
                    
                    if (dotProduct < 0.3) {
                        if (onTopSide) {
                            return v3(0, Math.max(yOverlapPos * 3, 0.2), 0);
                        } else {
                            return v3(0, -Math.max(yOverlapNeg * 3, 0.2), 0);
                        }
                    }
                }
                
                if (onTopSide) {
                    const exitV = v3(0, yOverlapPos * pushMultiplier, 0);
                    if (velocity && velocity.magnitude() > 0 && velocity.y < -0.01) {
                        return exitV.scale(2.5);
                    }
                    return exitV;
                } else {
                    const exitV = v3(0, -yOverlapNeg * pushMultiplier, 0);
                    if (velocity && velocity.magnitude() > 0 && velocity.y > 0.01) {
                        return exitV.scale(2.5);
                    }
                    return exitV;
                }
            }
            
            if (othr.size.z <= 5) {
                // Logic for Z-thin walls with acute angle handling
                const onFrontSide = myCenter.z > othrCenter.z;
                const pushMultiplier = 1.5;
                
                // Special handling for acute angles
                if (velocity && velocity.magnitude() > 0.01) {
                    const vNorm = velocity.clone().normalize();
                    const dotProduct = Math.abs(vNorm.z);
                    
                    if (dotProduct < 0.3) {
                        if (onFrontSide) {
                            return v3(0, 0, Math.max(zOverlapPos * 3, 0.2));
                        } else {
                            return v3(0, 0, -Math.max(zOverlapNeg * 3, 0.2));
                        }
                    }
                }
                
                if (onFrontSide) {
                    const exitV = v3(0, 0, zOverlapPos * pushMultiplier);
                    if (velocity && velocity.magnitude() > 0 && velocity.z < -0.01) {
                        return exitV.scale(2.5);
                    }
                    return exitV;
                } else {
                    const exitV = v3(0, 0, -zOverlapNeg * pushMultiplier);
                    if (velocity && velocity.magnitude() > 0 && velocity.z > 0.01) {
                        return exitV.scale(2.5);
                    }
                    return exitV;
                }
            }
            
            // For regular-sized objects, use the standard approach
            // Calculate the exit vector that requires the least movement
            const exitVectors = [
                v3(-xOverlapNeg, 0, 0), // move left
                v3(xOverlapPos, 0, 0),  // move right
                v3(0, -yOverlapNeg, 0), // move down
                v3(0, yOverlapPos, 0),  // move up
                v3(0, 0, -zOverlapNeg), // move back
                v3(0, 0, zOverlapPos),  // move forward
            ];
            
            // Determine which axis has the minimum penetration
            let minVector = Util.closestVectorMagniture(exitVectors, 0);
            
            // If we have velocity information, make sure we're not pushing in the 
            // same direction as movement (which can lead to pass-through)
            if (velocity && velocity.magnitude() > 0) {
                if ((minVector.x < 0 && velocity.x < 0) || 
                    (minVector.x > 0 && velocity.x > 0)) {
                    // Moving in same direction as exit vector on X axis - potential problem
                    // Find the next best axis
                    const nonXVectors = exitVectors.filter(v => Math.abs(v.x) < 0.001);
                    if (nonXVectors.length > 0) {
                        minVector = Util.closestVectorMagniture(nonXVectors, 0);
                    }
                }
                
                if ((minVector.z < 0 && velocity.z < 0) || 
                    (minVector.z > 0 && velocity.z > 0)) {
                    // Moving in same direction as exit vector on Z axis - potential problem
                    // Find the next best axis
                    const nonZVectors = exitVectors.filter(v => Math.abs(v.z) < 0.001);
                    if (nonZVectors.length > 0) {
                        minVector = Util.closestVectorMagniture(nonZVectors, 0);
                    }
                }
            }
            
            return minVector;
        }
        
        // For rotated objects, we need to calculate the MTV (Minimum Translation Vector)
        return this.calculateMTV(othr, velocity);
    }
    
    /**
     * Check if an object has potentially passed through a thin wall
     */
    private isPossiblePassThrough(
        myPos: Vector3, 
        myCenter: Vector3, 
        othrPos: Vector3, 
        othrCenter: Vector3, 
        othrSize: Vector3, 
        velocity: Vector3
    ): boolean {
        // Check if we're dealing with a thin wall
        const isThinX = othrSize.x < 5;
        const isThinY = othrSize.y < 5;
        const isThinZ = othrSize.z < 5;
        
        // Check for significant velocity in the direction of the thin dimension
        if (isThinX && Math.abs(velocity.x) > 0.2) {
            // Check if we're on the opposite side of where our velocity would put us
            const expectedSide = velocity.x > 0 ? 
                myCenter.x <= othrCenter.x : // Moving right, should be on left
                myCenter.x >= othrCenter.x;  // Moving left, should be on right
            const actualSide = myCenter.x < othrCenter.x;
            
            if (expectedSide !== actualSide) {
                return true;
            }
        }
        
        if (isThinY && Math.abs(velocity.y) > 0.2) {
            const expectedSide = velocity.y > 0 ? 
                myCenter.y <= othrCenter.y : 
                myCenter.y >= othrCenter.y;
            const actualSide = myCenter.y < othrCenter.y;
            
            if (expectedSide !== actualSide) {
                return true;
            }
        }
        
        if (isThinZ && Math.abs(velocity.z) > 0.2) {
            const expectedSide = velocity.z > 0 ? 
                myCenter.z <= othrCenter.z : 
                myCenter.z >= othrCenter.z;
            const actualSide = myCenter.z < othrCenter.z;
            
            if (expectedSide !== actualSide) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Calculate the Minimum Translation Vector (MTV) for rotated colliders
     * This is the shortest distance to move to resolve the collision
     */
    private calculateMTV(othr: Zone, velocity?: Vector3): Vector3 {
        // Get vertices of both cuboids
        const myVertices = this.getCollisionVertices();
        const othrVertices = othr.getCollisionVertices();
        
        // Get axes to test
        const axes = this.getCollisionAxes(othr);
        
        // Find the minimum penetration axis
        let minPenetration = Number.MAX_VALUE;
        let minAxis: Vector3 = v3(0);
        
        for (const axis of axes) {
            // Ensure axis is normalized
            const normalizedAxis = axis.magnitude() > 0 ? axis.normalize() : axis;
            
            // Project vertices onto axis
            const myProjection = this.projectVerticesOntoAxis(myVertices, normalizedAxis);
            const othrProjection = othr.projectVerticesOntoAxis(othrVertices, normalizedAxis);
            
            // Calculate penetration depth
            const overlap = Math.min(
                myProjection.max - othrProjection.min, 
                othrProjection.max - myProjection.min
            );
            
            // If projections don't overlap, objects don't collide (shouldn't happen since we already tested this)
            if (myProjection.max < othrProjection.min || othrProjection.max < myProjection.min) {
                return v3(0); // No collision, should not happen but added as a safety check
            }
            
            // Check if this is the minimum penetration
            if (overlap < minPenetration) {
                minPenetration = overlap;
                minAxis = normalizedAxis;
            }
        }
        
        // If minimum penetration is very small, but we're dealing with a face-to-face collision
        // Ensure we still return a reasonable MTV
        if (minPenetration < 0.001 && minPenetration > 0) {
            // Calculate centers correctly with absoluteOffset
            const myPos = super.globalPosition.add(this.absoluteOffset); 
            const othrPos = othr.globalPosition;
            
            const thisCenter = myPos.add(this.size.scale(0.5));
            const othrCenter = othrPos.add(othr.size.scale(0.5));
            
            // If we have velocity information, use it for direction determination
            let direction = thisCenter.subtract(othrCenter).normalize(); // Default: away from other
            
            if (velocity && othr.size.x < 5) {
                // For thin walls, use velocity-based direction
                if (Math.abs(velocity.x) > 0.01) {
                    // If moving significantly in X direction, exit in opposite direction
                    direction = v3(-Math.sign(velocity.x), 0, 0);
                }
            }
            
            // Find the face normal most aligned with the direction between centers
            const faceNormals = [
                this.getRotatedNormal(v3(1, 0, 0)),
                this.getRotatedNormal(v3(-1, 0, 0)),
                this.getRotatedNormal(v3(0, 1, 0)),
                this.getRotatedNormal(v3(0, -1, 0)),
                this.getRotatedNormal(v3(0, 0, 1)),
                this.getRotatedNormal(v3(0, 0, -1)),
                othr.getRotatedNormal(v3(1, 0, 0)),
                othr.getRotatedNormal(v3(-1, 0, 0)),
                othr.getRotatedNormal(v3(0, 1, 0)),
                othr.getRotatedNormal(v3(0, -1, 0)),
                othr.getRotatedNormal(v3(0, 0, 1)),
                othr.getRotatedNormal(v3(0, 0, -1))
            ];
            
            let bestAlignment = -1;
            let bestNormal = minAxis;
            
            for (const normal of faceNormals) {
                const alignment = Math.abs(this.calculateDotProduct(normal, direction));
                if (alignment > bestAlignment) {
                    bestAlignment = alignment;
                    bestNormal = normal;
                }
            }
            
            // Use the best face normal if it's better aligned with the direction
            if (bestAlignment > 0.7) { // 0.7 is roughly cos(45°)
                minAxis = bestNormal;
                // Ensure reasonable penetration depth
                minPenetration = Math.max(minPenetration, 0.01);
            }
        }
        
        // Cap the maximum penetration to avoid phasing through walls
        minPenetration = Math.min(minPenetration, Math.min(this.size.x, Math.min(this.size.y, this.size.z)) * 0.5);
        
        // Ensure the MTV points in the correct direction (away from the other object)
        // Calculate centers correctly with absoluteOffset
        const myPos = super.globalPosition.add(this.absoluteOffset); 
        const othrPos = othr.globalPosition;
        
        const thisCenter = myPos.add(this.size.scale(0.5));
        const othrCenter = othrPos.add(othr.size.scale(0.5));
        
        // If we have velocity information and dealing with a thin wall
        if (velocity && (othr.size.x < 5 || othr.size.y < 5 || othr.size.z < 5)) {
            // Determine exit direction based on velocity for thin walls
            if (Math.abs(velocity.x) > 0.1 && othr.size.x < 5) {
                // If moving significantly in X, ensure we exit opposite to our movement
                minAxis = v3(-Math.sign(velocity.x), 0, 0);
                minPenetration = Math.max(minPenetration, 0.1); // Ensure significant push
            } else if (Math.abs(velocity.y) > 0.1 && othr.size.y < 5) {
                minAxis = v3(0, -Math.sign(velocity.y), 0);
                minPenetration = Math.max(minPenetration, 0.1);
            } else if (Math.abs(velocity.z) > 0.1 && othr.size.z < 5) {
                minAxis = v3(0, 0, -Math.sign(velocity.z));
                minPenetration = Math.max(minPenetration, 0.1);
            } else {
                // Default direction away from the other object
                const directionAwayFromOther = thisCenter.subtract(othrCenter);
                
                // Make sure the MTV points away from the other object
                if (this.calculateDotProduct(directionAwayFromOther, minAxis) < 0) {
                    minAxis = minAxis.scale(-1);
                }
            }
        } else {
            // Default direction away from the other object
            const directionAwayFromOther = thisCenter.subtract(othrCenter);
            
            // Make sure the MTV points away from the other object
            if (this.calculateDotProduct(directionAwayFromOther, minAxis) < 0) {
                minAxis = minAxis.scale(-1);
            }
        }
        
        // Return the MTV scaled by penetration depth
        return minAxis.scale(minPenetration);
    }
}