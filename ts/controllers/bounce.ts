import { CanvasController } from '../utils/controller';
import { TickerReturnData } from '../utils/ticker';
import { Vector2 } from '../utils/vector2';

export class Bounce extends CanvasController {
    private velocity: Vector2 = new Vector2(10, 0);
    private bouncing: boolean = true;
    private radius: number;

    constructor(radius: number) {
        super();
        this.radius = radius;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        this.bounceGround();
        this.bounceWall();
    }

    bounceWall() {
        if (this.parent.position.add(this.velocity).x > this.level.width - this.radius) {
            this.velocity.x = (-this.velocity.x * 0.8);
        } else if (this.parent.position.add(this.velocity).x < (this.radius)) {
            this.velocity.x = (-this.velocity.x * 0.8);
        }

        if (this.bouncing){
            this.parent.position.x += this.velocity.x;
        } else {
            this.velocity.x*=0.98
            this.parent.position.x += this.velocity.x;
        }
    }

    bounceGround() {
        if (this.bouncing) {
            if (this.parent.position.add(this.velocity).y > this.level.height - this.radius) {
                if (this.velocity.y > 5) {
                    this.velocity.y = (-this.velocity.y) + 3;
                } else {
                    this.land();
                    return;
                }
            }
            this.velocity.y += 1;
            this.parent.position.y += this.velocity.y;
        }
    }

    land() {
        this.parent.position.y = this.level.height - this.radius;
        this.bouncing = false;
    }
}