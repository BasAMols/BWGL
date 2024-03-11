import { Character } from '../../../utils/character';
import { Collisions } from '../../../utils/collisions';
import { CanvasController } from '../../../utils/controller';
import { TickerReturnData } from '../../../utils/ticker';
import { Util } from '../../../utils/utils';
import { Vector2 } from '../../../utils/vector2';

export class SideContoller extends CanvasController {
    private speed = 2;
    private jumpHeight = 13;
    private velocity: Vector2 = Vector2.zero;
    public parent: Character;
    public jumping: boolean = false;

    keyDown(e: KeyboardEvent): void {
        if (!this.jumping && this.mode.input.up) {
            this.velocity.y = this.jumpHeight;
            this.jumping = true;
        }
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        this.velocity.x = Util.to0(this.velocity.x * 0.9, 0.1);
        this.velocity.y = Util.to0(this.velocity.y - (9.8 * 0.02), 0.001);
        this.velocity.x += this.mode.input.right ? 1 : this.mode.input.left ? -1 : 0 * this.speed;

        const r = Collisions.check(this.level.colliders, this.parent, this.velocity.scale(obj.interval / 10));

        if (r.length !== 0) {
            r.sort(function (a, b) {
                return Math.abs(a[1]) - Math.abs(b[1]);
            });
            if (r.find((a) => a[0] === "x")) {
                this.velocity.x = r.find((a) => a[0] === "x")[1] / (obj.interval / 10);
            }
            if (r.find((a) => a[0] === "y")) {
                if (this.velocity.y <= 0) {
                    this.jumping = false;
                }
                this.velocity.y = r.find((a) => a[0] === "y")[1] / (obj.interval / 10);
            }
        }


        this.parent.position = Vector2.clamp(
            this.parent.position.add(this.velocity.scale(obj.interval / 10)),
            this.level.size.subtract(this.parent.size),
            Vector2.zero,
        );
    }
}