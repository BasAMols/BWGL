import { GlController } from '../../gl/controller';
import { Character } from '../../gl/character';
import { TickerReturnData } from '../../gl/ticker';
import { Util } from '../../gl/util/utils';
import { Vector3, v3 } from '../../gl/math/vector3';
import { Vector2 } from '../../gl/math/vector2';
import { GlElementAttributes } from '../../gl/elementBase';

export class CarController extends GlController {
    private intr: Record<string, number> = { fall: 0, jump: 0, landDelay: 0 };
    private cnst = { runTime: 5000, runSlowDownFactor: 0.1, runSpeed: 2 } as const;
    private velocity: Vector3 = Vector3.f(0);
    private newPosition: Vector3;
    public parent: Character;
    public direction: number = 0;

    constructor(attr:GlElementAttributes) {
        super(attr);
        
    }

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
        this.setMovementVelocity(obj.intervalS10);
        this.setJumpVelocity(obj.intervalS10);

        const sc = this.velocity.scale(obj.intervalS10 / 6);
        if (sc.xz.magnitude() > 0) {
            const [x, z] = sc.xz.array;
            this.newPosition = this.parent.position.add(v3(x, sc.y, z));
        } else {
            this.newPosition = this.parent.position.add(v3(0, sc.y, 0));

        }
    }


    public build(): void {
        super.build();
        this.direction = this.parent.rotation.y;

    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.setVelocity(obj);
        // console.log(this.parent.colliders[0]);
        // this.parent.colliders[0].position = v3(100,0,0)
        // console.log(this.parent.size.rotateXZ(this.parent.rotation.z).x);
        
        // this.parent.size.rotateXZ(this.parent.rotation.z).x
        // this.parent.colliders[0].position.xz = v2(
        //     Math.min(this, this.parent.size.x),
        //     Math.min(0, this.parent.size.z),
        // )
        this.parent.position = this.newPosition.clone();
    }
}