import { GlController } from '../../gl/controller';
import { Character } from '../../gl/character';
import { TickerReturnData } from '../../utils/ticker';
import { Util } from '../../utils/utils';
import { Vector3, v3 } from '../../utils/vector3';
import { Vector2 } from '../../utils/vector2';

export class CarController extends GlController {
    private intr: Record<string, number> = { fall: 0, jump: 0, landDelay: 0 };
    private cnst = { runTime: 5000, runSlowDownFactor: 0.1, runSpeed: 2 } as const;
    private velocity: Vector3 = Vector3.f(0);
    private newPosition: Vector3;
    public parent: Character;
    public direction: number = 0;

    public setMovementVelocity(interval: number) {
        if (this.mode.input.space) {
            this.intr.acc = 0;
        } else if (this.mode.input.up) {
            this.intr.acc = Util.clamp((this.intr.acc | 0) + interval, -(this.cnst.runTime / 3), this.cnst.runTime);
        } {
            if (this.mode.input.down) {
                this.intr.acc = Util.clamp((this.intr.acc | 0) - interval * 0.8, -(this.cnst.runTime / 3), this.cnst.runTime);
            } else {
                if (this.intr.acc >= 0) {
                    this.intr.acc = Util.clamp((this.intr.acc | 0) - interval * this.cnst.runSlowDownFactor, 0, this.cnst.runTime);
                } else {
                    this.intr.acc = Util.clamp((this.intr.acc | 0) + interval * this.cnst.runSlowDownFactor, -(this.cnst.runTime / 3), 0);
                }
            }
        }

        this.direction = this.direction - ((0.001) * interval * (+this.mode.input.left - +this.mode.input.right) * (1.5 - this.intr.acc / this.cnst.runTime) * (this.intr.acc / this.cnst.runTime));
        this.parent.rotation = v3(0, this.direction, 0);

        // setter('acc', this.mode.input.up && !this.mode.input.down, interval);
        // setter('right', this.mode.input.right && !this.mode.input.left, interval);
        // setter('left', this.mode.input.left && !this.mode.input.right, interval);
        // setter('up', this.mode.input.up && !this.mode.input.down, interval);
        // setter('down', this.mode.input.down && !this.mode.input.up, interval);

        const plane = Vector2.up.clampMagnitude(1).scale(this.intr.acc / this.cnst.runTime).scale(this.cnst.runSpeed).rotate(-this.direction);

        this.velocity = v3(
            plane.x,
            0,
            plane.y
        );
    }


    public setJumpVelocity(interval: number) {

        if (this.parent.stat.falling) {
            this.intr.fall += interval;
        } else {
            this.velocity.y = 0;
            return;
        }

        this.velocity.y = 0;
    }

    public setVelocity(obj: TickerReturnData) {
        this.setMovementVelocity(obj.interval);
        this.setJumpVelocity(obj.interval);

        const sc = this.velocity.scale(obj.interval / 6);
        if (sc.xz.magnitude() > 0) {
            const [x, z] = sc.xz.array;
            this.newPosition = this.parent.absolutePosition.add(v3(x, sc.y, z));
        } else {
            this.newPosition = this.parent.absolutePosition.add(v3(0, sc.y, 0));

        }
    }

    public colliders(obj: TickerReturnData) {
        this.parent.stat.ground = false;
        // this.level.colliders.forEach((col) => {
        //     if (Collisions.boxesOverlap(col.absolutePosition, col.size, this.newPosition, this.parent.size)) {
        //         // if(Collisions.boxesOverlap(col.absolutePosition, newAbs, this.parent.size)){
        //         if (col.direction.equals(Vector3.up) && this.velocity.y <= 0) { // floor

        //             this.velocity.y = Math.max(this.velocity.y, 0);
        //             this.parent.stat.falling = false;
        //             this.intr.fall = 0;
        //             this.intr.jump = 0;
        //             this.newPosition.y = col.absolutePosition.y + col.size.y - 1;
        //             this.parent.stat.ground = true;
        //         }
        //         // if (col.direction.equals(Vector3.down) && this.velocity.y > 0) { // ceiling
        //         //     this.velocity.y = Math.min(this.velocity.y, 0);
        //         //     this.newPosition.y = col.absolutePosition.y - this.parent.size.y;
        //         // }
        //         // if (col.direction.equals(Vector3.right) && this.velocity.x < 0){ // left wall
        //         //     this.velocity.x = Math.max(this.velocity.x, 0);
        //         //     this.newPosition.x = col.absolutePosition.x+col.size.x;
        //         // }
        //         // if (col.direction.equals(Vector3.left) && this.velocity.x > 0){ // right wall
        //         //     this.velocity.x = Math.min(this.velocity.x, 0);
        //         //     this.newPosition.x = col.absolutePosition.x-this.parent.size.x;
        //         // }
        //         // if (col.direction.equals(Vector3.backwards) && this.velocity.z < 0){ // front wall
        //         //     this.velocity.z = Math.max(this.velocity.z, 0);
        //         //     this.newPosition.z = col.absolutePosition.z+col.size.z;
        //         // }
        //         // if (col.direction.equals(Vector3.forwards) && this.velocity.z > 0){ // back wall
        //         //     this.velocity.z = Math.min(this.velocity.z, 0);
        //         //     this.newPosition.z = col.absolutePosition.z-this.parent.size.z;
        //         // }
        //     }
        // });

        if (!this.parent.stat.jumping) {
            this.parent.stat.falling = !this.parent.stat.ground;
        }
    }

    public build(): void {
        super.build();
        this.direction = this.parent.rotation.y;

    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.setVelocity(obj);
        this.colliders(obj);

        this.parent.absolutePosition = this.newPosition.clone();
    }
}