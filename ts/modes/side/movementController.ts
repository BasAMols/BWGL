import { GlController } from '../../gl/controller';
import { Character } from '../../gl/character';
import { TickerReturnData } from '../../utils/ticker';
import { Util } from '../../utils/utils';
import { Vector3, v3 } from '../../utils/vector3';
import { Collisions } from '../../utils/collisions';
import { v2 } from '../../utils/vector2';

export class MovementController extends GlController {
    private intr: Record<string, number> = { fall: 0, jump: 0, landDelay: 0 };
    private stat: Record<string, boolean> = { jumping: false, falling: false, running: false };
    private cnst = { runTime: 200, runSlowDownFactor:0.7, minJumpTime: 200, jumpTime: 250, jumpSpeed: 0.8} as const;
    private velocity: Vector3 = Vector3.f(0);
    private newPosition: Vector3;
    public parent: Character;

    public setMovementVelocity(interval: number) {
        const setter = (key: string, cond: boolean, interval: number) => {
            this.intr[key] = Util.clamp((this.intr[key] || 0) + (cond ? interval : -(interval * this.cnst.runSlowDownFactor)), 0, this.cnst.runTime);
        };

        setter('right', this.mode.input.right && !this.mode.input.left, interval);
        setter('left', this.mode.input.left && !this.mode.input.right, interval);
        setter('up', this.mode.input.up && !this.mode.input.down, interval);
        setter('down', this.mode.input.down && !this.mode.input.up, interval);

        const plane = v2(
            (this.intr.right - this.intr.left) / this.cnst.runTime,
            (this.intr.up - this.intr.down) / this.cnst.runTime,
        ).clampMagnitude(1);

        this.velocity = v3(
            plane.x,
            0,
            plane.y
        );
    }

    private determineStates(interval: number) {

        if (this.stat.falling) {
            this.stat.jumping = false;
        } else {
            if (this.stat.jumping) {
                
                if (this.intr.jump < this.cnst.minJumpTime) {
                    this.stat.jumping = true;
                    this.stat.falling = false;
                } else if (this.intr.jump < this.cnst.jumpTime) {
                    this.stat.jumping = this.mode.input.space;
                } else {
                    this.stat.jumping = false;
                    this.stat.falling = true;
                    this.intr.jump = this.cnst.jumpTime;
                }
            } else {
                this.stat.jumping = this.mode.input.space;
            }
        }
    }

    public setJumpVelocity(interval: number) {
        this.determineStates(interval);


        if (this.stat.jumping) {
            this.intr.jump = Math.min(this.intr.jump + interval, this.cnst.jumpTime);
            this.intr.fall = -this.intr.jump;
        } else if (this.stat.falling) {
            this.intr.jump = this.cnst.jumpTime;
            this.intr.fall += interval;
        } else {
            this.velocity.y = 0;
            return;
        }

        const y = (this.cnst.jumpTime - this.intr.jump - this.intr.fall) / (this.cnst.jumpTime) * this.cnst.jumpSpeed;

        this.velocity.y = y;
    }

    public setVelocity(obj: TickerReturnData) {
        this.setMovementVelocity(obj.interval);
        this.setJumpVelocity(obj.interval);

        const sc = this.velocity.scale(obj.interval / 6);
        if (sc.xz.magnitude() > 0) {
            const [x, z] = sc.xz.rotate(-this.camera.rotation.y).array;
            this.newPosition = this.parent.absolutePosition.add(v3(x,sc.y,z));
            this.parent.rotation = this.camera.rotation.multiply(0, 1, 0);
        } else {
            this.newPosition = this.parent.absolutePosition.add(v3(0, sc.y, 0));
        }
    }

    public colliders(obj: TickerReturnData) {
        let platform = false;
        this.level.colliders.forEach((col) => {
            if (Collisions.boxesOverlap(col.absolutePosition, col.size, this.newPosition, this.parent.size)) {
                // if(Collisions.boxesOverlap(col.absolutePosition, newAbs, this.parent.size)){
                if (col.direction.equals(Vector3.up) && this.velocity.y < 0) { // floor
                    this.velocity.y = Math.max(this.velocity.y, 0);
                    this.stat.falling = false;
                    this.intr.fall = 0;
                    this.intr.jump = 0;
                    this.newPosition.y = col.absolutePosition.y + col.size.y;
                    platform = true;
                }
                // if (col.direction.equals(Vector3.down) && this.velocity.y > 0) { // ceiling
                //     this.velocity.y = Math.min(this.velocity.y, 0);
                //     this.newPosition.y = col.absolutePosition.y - this.parent.size.y;
                // }
                // if (col.direction.equals(Vector3.right) && this.velocity.x < 0){ // left wall
                //     this.velocity.x = Math.max(this.velocity.x, 0);
                //     this.newPosition.x = col.absolutePosition.x+col.size.x;
                // }
                // if (col.direction.equals(Vector3.left) && this.velocity.x > 0){ // right wall
                //     this.velocity.x = Math.min(this.velocity.x, 0);
                //     this.newPosition.x = col.absolutePosition.x-this.parent.size.x;
                // }
                // if (col.direction.equals(Vector3.backwards) && this.velocity.z < 0){ // front wall
                //     this.velocity.z = Math.max(this.velocity.z, 0);
                //     this.newPosition.z = col.absolutePosition.z+col.size.z;
                // }
                // if (col.direction.equals(Vector3.forwards) && this.velocity.z > 0){ // back wall
                //     this.velocity.z = Math.min(this.velocity.z, 0);
                //     this.newPosition.z = col.absolutePosition.z-this.parent.size.z;
                // }
            }
        });

        if (!this.stat.jumping){
            this.stat.falling = !platform;
        }

        
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.setVelocity(obj);
        this.colliders(obj);

        this.parent.absolutePosition = this.newPosition.clone();

    }
}