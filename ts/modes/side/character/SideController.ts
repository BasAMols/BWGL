import { Character } from '../../../utils/character';
import { Collisions } from '../../../utils/collisions';
import { CanvasController } from '../../../utils/controller';
import { TickerReturnData } from '../../../utils/ticker';
import { Util } from '../../../utils/utils';
import { Vector2 } from '../../../utils/vector2';

export class SideContoller extends CanvasController {
    private speed = 5;
    private jumpHeight = 16;
    private velocity: Vector2 = Vector2.zero;
    public parent: Character;
    public jumping: boolean = false;
    public jumpDuration: number = 0;
    jumpVelocity: number;

    keyDown(e: KeyboardEvent): void {
        if (!this.jumping && this.mode.input.up) {
            this.jumpVelocity = 1;
        }
    }

    jump(m: number) {
        if (this.jumpDuration !== 0 || !this.jumping) {
            
            this.jumping = true;
            this.velocity.y += this.jumpHeight;
            // this.jumpDuration = 0;
        }
    }

    land() {
        this.jumpDuration = 0;
        this.jumping = false;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        const m = 1 / obj.frameRate * 144;

        if (this.mode.input.up) {
            this.jump(m);
        } else {
            this.jumpDuration = 0;
        }
        // this.velocity.x = Util.to0(this.velocity.x * 0.9*m + ((this.mode.input.right ? 1 : (this.mode.input.left ? -1 : 0))*0.6 ), 0.1);
        this.velocity.x = (this.mode.input.right ? 1 : (this.mode.input.left ? -1 : 0))*this.speed;
        this.velocity.y = Util.to0(this.velocity.y - (9.8 * 0.03)*m, 0.0001);

        const frameScaledVelocity = this.velocity.scale(m);
        //console.log(frameScaledVelocity.x);


        const r = Collisions.check(this.level.colliders, this.parent, frameScaledVelocity);

        if (r.length !== 0) {
            r.sort(function (a, b) {
                return Math.abs(a[1]) - Math.abs(b[1]);
            });
            if (r.find((a) => a[0] === "x")) {
                frameScaledVelocity.x = 0;
                this.velocity.x = 0;
                frameScaledVelocity.x = r.find((a) => a[0] === "x")[1];
            }
            if (r.find((a) => a[0] === "y")) {
                this.jumping = false;
                frameScaledVelocity.y = 0;
                this.velocity.y = 0;
                frameScaledVelocity.y = r.find((a) => a[0] === "y")[1];
            }
        }

        this.parent.position = this.parent.position.add(frameScaledVelocity)
    }
}