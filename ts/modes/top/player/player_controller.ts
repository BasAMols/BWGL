import { Collider } from '../../../classes/collider';
import { GlController } from '../../../classes/controller';
import { v2 } from '../../../classes/math/vector2';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { TickerReturnData } from '../../../classes/ticker';
import { Util } from '../../../classes/util/utils';
import { TopLevel } from '../level';
import { Player } from './player_actor';


export class PlayerController extends GlController {
    private intr: Record<string, number> = {};
    private stat: Record<string, boolean> = { running: false, holding: false };
    private cnst = { runTime: 50, runSlowDownFactor: 0.6, runSpeed: 0.15 } as const;
    private velocity: Vector3 = Vector3.f(0);
    private newPosition: Vector3;
    private cameraRotatedVelocity: Vector3 | null = null;
    private lastAppliedVelocity: Vector3 | null = null;
    public parent: Player;

    public setter(key: string, cond: boolean, interval: number) {
        this.intr[key] = Util.clamp((this.intr[key] || 0) + (cond ? interval : -(interval * this.cnst.runSlowDownFactor)), 0, this.cnst.runTime);
    }

    public setMovementVelocity(interval: number) {
        const input = this.axis('movement');
        this.setter('right', input.x === 1, interval);
        this.setter('left', input.x === -1, interval);
        this.setter('up', input.y === 1, interval);
        this.setter('down', input.y === -1, interval);

        const plane = v2(
            (this.intr.right - this.intr.left) / this.cnst.runTime,
            (this.intr.up - this.intr.down) / this.cnst.runTime,
        ).clampMagnitude(1).scale(this.cnst.runSpeed);

        
        this.velocity = v3(
            plane.x,
            0,
            plane.y
        );
    }

    public setVelocity(obj: TickerReturnData) {
        this.setMovementVelocity(obj.intervalS10);

        const sc = this.velocity.scale(obj.intervalS10 / 6);
        this.lastAppliedVelocity = sc.clone(); // Track the actual applied velocity
        
        // Always create camera-rotated velocity, even if standing still
        if (sc.xz.magnitude() > 0) {
            // Store the camera-rotated velocity for collision detection
            // Apply camera rotation to movement
            const [x, z] = sc.xz.rotate(-this.camera.rotation.y).array;
            this.cameraRotatedVelocity = v3(x, sc.y, z);
            
            this.newPosition = this.parent.position.add(v3(x, sc.y, z));
            if (!this.axis('movement').isZero()) {
                this.parent.rotation = this.camera.rotation.multiply(0, 1, 0).add(v3(0, Math.PI / 2, 0)).add(v3(0, -sc.xz.angle(), 0));
            }
            this.parent.stat.running = true;
        } else {
            // Even when standing still, keep a reference to camera-rotated space
            this.cameraRotatedVelocity = v3(0, sc.y, 0);
            this.newPosition = this.parent.position.add(v3(0, sc.y, 0));
            this.parent.stat.running = false;
        }
    }

    public collide(obj: TickerReturnData) {
        this.parent.stat.ground = false;
        
        // Get anchor point adjusted position
        const anchorAdjustedPos = this.parent.position.add(this.parent.anchorPoint.multiply(-1, -1, -1));
        
        // Important: Use the camera-rotated velocity, not the raw input velocity
        // This ensures collision detection happens in world space after camera rotation is applied
        // Even if camera-rotated velocity is zero, we still need to check for collision
        // in case we're standing against a wall and only rotating the camera
        let collisions: Vector3[] = [];
        
        if (this.parent.zones[0] instanceof Collider) {
            const collider = this.parent.zones[0] as Collider;
            // Pass zero velocity if we're only rotating the camera without moving
            const effectiveVelocity = this.lastAppliedVelocity && this.lastAppliedVelocity.magnitude() > 0.001 
                ? this.cameraRotatedVelocity
                : v3(0, 0, 0);
                
            collisions = collider.calculateCollision(effectiveVelocity) || [];
        }
        
        if (collisions.length === 0) {
            return;
        }
        
        // Process each collision
        collisions.forEach((v: Vector3) => {
            // Always stop movement in the direction we're being pushed
            if (Math.abs(v.x) > 0.01) {
                // Zero out the rotated velocity component
                if (this.cameraRotatedVelocity) {
                    this.cameraRotatedVelocity.x = 0;
                }
                
                // We need to adjust the input velocity too, accounting for camera rotation
                if (Math.abs(this.camera.rotation.y) > 0.01) {
                    // Calculate how much to reduce in each direction based on camera angle
                    const cosY = Math.cos(this.camera.rotation.y);
                    const sinY = Math.sin(this.camera.rotation.y);
                    
                    // Adjust both X and Z components of velocity since they're coupled by rotation
                    this.velocity.x -= this.velocity.x * Math.abs(cosY);
                    this.velocity.z -= this.velocity.z * Math.abs(sinY);
                } else {
                    this.velocity.x = 0;
                }
            }
            
            if (Math.abs(v.y) > 0.01) {
                if (this.cameraRotatedVelocity) {
                    this.cameraRotatedVelocity.y = 0;
                }
                this.velocity.y = 0;
            }
            
            if (Math.abs(v.z) > 0.01) {
                if (this.cameraRotatedVelocity) {
                    this.cameraRotatedVelocity.z = 0;
                }
                
                // Similar to X, adjust for camera rotation
                if (Math.abs(this.camera.rotation.y) > 0.01) {
                    const cosY = Math.cos(this.camera.rotation.y);
                    const sinY = Math.sin(this.camera.rotation.y);
                    
                    this.velocity.x -= this.velocity.x * Math.abs(sinY);
                    this.velocity.z -= this.velocity.z * Math.abs(cosY);
                } else {
                    this.velocity.z = 0;
                }
            }
            
            // Apply position correction, considering anchor point
            this.newPosition = this.newPosition.add(v);
        });
        
        // Update the position
        this.parent.position = this.newPosition.clone();
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.setVelocity(obj);
        this.collide(obj);
        this.parent.position = this.newPosition.clone();
        if (this.button('interact')) {
            (this.parent.level as TopLevel).box.carrier = this.parent;
            this.parent.stat.holding = true;
        } else {
            (this.parent.level as TopLevel).box.carrier = undefined;
            this.parent.stat.holding = false;
        }
        

    }
}