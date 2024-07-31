import { GlController } from '../../../gl/controller';
import { TickerReturnData } from '../../../gl/ticker';
import { Util } from '../../../gl/util/utils';
import { Vector3, v3 } from '../../../gl/math/vector3';
import { v2 } from '../../../gl/math/vector2';
import { Player } from './player_actor';
import { Collider } from '../../../gl/collider';

export class PlayerController extends GlController {
    private intr: Record<string, number> = { fall: 0, jump: 0, landDelay: 0 };
    private stat: Record<string, boolean> = { jumping: false, falling: false, running: false };
    private cnst = { runTime: 250, runSlowDownFactor: 0.7, runSpeed: 0.5, minJumpTime: 200, jumpTime: 300, jumpSpeed: 0.6 } as const;
    private velocity: Vector3 = Vector3.f(0);
    private newPosition: Vector3;
    public parent: Player;
    public aiming: boolean = false;

    keyDown(e: KeyboardEvent): void {
        if (e.key === 'e' || e.key === 'E'){
            this.aiming = true;
        }
    }

    keyUp(e: KeyboardEvent): void {
        if (e.key === 'e' || e.key === 'E'){
            this.aiming = false;
        }
    }


    public setMovementVelocity(interval: number) {
        const setter = (key: string, cond: boolean, interval: number) => {
            this.intr[key] = Util.clamp((this.intr[key] || 0) + (cond ? interval : -(interval * this.cnst.runSlowDownFactor)), 0, this.cnst.runTime);
        };

        setter('right', this.mode.input.right && !this.mode.input.left, interval);
        setter('left', this.mode.input.left && !this.mode.input.right, interval);
        setter('up', this.mode.input.up && !this.mode.input.down, interval);
        setter('down', this.mode.input.down && !this.mode.input.up, interval);

        if (!this.aiming) {

            const plane = v2(
                (this.intr.right - this.intr.left) / this.cnst.runTime,
                (this.intr.up - this.intr.down) / this.cnst.runTime,
            ).clampMagnitude(1).scale(this.cnst.runSpeed);

            this.velocity = v3(
                plane.x,
                0,
                plane.y
            );
        } else {
            this.velocity = v3(0);
        }

    }

    private determineStates(interval: number) {

        if (this.parent.stat.falling) {
            this.parent.stat.jumping = false;
        } else {
            if (this.parent.stat.jumping) {

                if (this.intr.jump < this.cnst.minJumpTime) {
                    this.parent.stat.jumping = true;
                    this.parent.stat.falling = false;
                } else if (this.intr.jump < this.cnst.jumpTime) {
                    this.parent.stat.jumping = this.mode.input.space;
                } else {
                    this.parent.stat.jumping = false;
                    this.parent.stat.falling = true;
                    this.intr.jump = this.cnst.jumpTime;
                }
            } else {
                this.parent.stat.jumping = this.mode.input.space;
            }
        }
    }

    public setJumpVelocity(interval: number) {
        this.determineStates(interval);

        if (this.parent.stat.jumping) {
            this.intr.jump = Math.min(this.intr.jump + interval, this.cnst.jumpTime);
            this.intr.fall = -this.intr.jump;
        } else if (this.parent.stat.falling) {
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
        this.setMovementVelocity(obj.intervalS10);
        this.setJumpVelocity(obj.intervalS10);

        const sc = this.velocity.scale(obj.intervalS10 / 6);
        if (sc.xz.magnitude() > 0) {
            const [x, z] = sc.xz.rotate(-this.camera.rotation.y).array;
            this.newPosition = this.parent.position.add(v3(x, sc.y, z));
            if (this.mode.input.right || this.mode.input.left || this.mode.input.up || this.mode.input.down) {
                this.parent.rotation = this.camera.rotation.multiply(0, 1, 0).add(v3(0, Math.PI / 2, 0)).add(v3(0, -sc.xz.angle(), 0));
            }
            this.parent.stat.running = true;
        } else {
            this.newPosition = this.parent.position.add(v3(0, sc.y, 0));
            this.parent.stat.running = false;
        }

        if (this.aiming) {
            this.parent.rotation = this.camera.rotation.multiply(0, 1, 0);
        }
    }


    public collide(obj: TickerReturnData) {
        this.parent.stat.ground = false;
        const collisions = (this.parent.zones[0] as Collider).calculateCollision();
        collisions.forEach((v: Vector3)=>{
            if (v.y >= 0){
                this.intr.fall = 0;
                this.intr.jump = 0;
                this.parent.stat.falling = false;
                this.parent.stat.ground = true;
            } else {
                this.parent.stat.falling = true;
                this.parent.stat.ground = false;
            } 
            this.velocity.subtract(v);
            this.parent.position = this.newPosition.clone();
            this.newPosition = this.newPosition.add(v);
        })

        if (!this.parent.stat.jumping) {
            this.parent.stat.falling = !this.parent.stat.ground;
        }
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.setVelocity(obj);
        this.collide(obj);

        this.parent.position = this.newPosition.clone();
        // this.parent.rotation = this.parent.rotation.rotateXZ(0.004)
    }
}