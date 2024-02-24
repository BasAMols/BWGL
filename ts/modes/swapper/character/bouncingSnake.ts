import { TickerReturnData } from '../../../utils/ticker';
import { Vector2 } from '../../../utils/vector2';
import { Snake } from './snake';

export class BounceSnake extends Snake {
    private velocity: Vector2 = new Vector2(10, 0);
    private bouncing: boolean = true;
    constructor(position: Vector2 = Vector2.zero, direction: Vector2 = Vector2.up) {
        super({ position, totals: 10, distance: 3, colors: 'green' });
        this.moving = true;
    }

    build() {
        super.build();
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        this.bounceGround();
        this.bounceWall();
    }

    bounceWall() {
        if (this.bouncing){
            if (this.position.add(this.velocity).x > this.level.width - this.radius - (this.strokeWidth)) {
                this.velocity.x = (-this.velocity.x * 0.8);
            } else if (this.position.add(this.velocity).x < (this.radius - (this.strokeWidth))) {
                this.velocity.x = (-this.velocity.x * 0.8);
            }
            this.position.x += this.velocity.x;
        } else {
            this.velocity.x*=0.98
            this.position.x += this.velocity.x;
        }
    }

    bounceGround() {
        if (this.bouncing) {
            if (this.position.add(this.velocity).y > this.level.height - this.radius - (this.strokeWidth)) {
                if (this.velocity.y > 5) {
                    this.velocity.y = (-this.velocity.y) + 3;
                } else {
                    this.land();
                    return;
                }
            }
            this.velocity.y += 1;
            this.position.y += this.velocity.y;
        }
    }

    land() {
        this.position.y = this.level.height - this.radius - (this.strokeWidth);
        this.bouncing = false;
    }
}
