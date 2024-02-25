import { CanvasController } from '../utils/controller';
import { TickerReturnData } from '../utils/ticker';
import { Vector2 } from '../utils/vector2';

export class Random extends CanvasController {
    private speed = new Vector2(7, 7);
    private direction = Vector2.up;
    private steering: number = Math.random();
    private maxSteering: number = 5;
    private radius: number;;

    constructor(radius: number, direction: Vector2 = Vector2.up) {
        super();
        this.radius = radius
        this.direction = direction;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        this.steering = Math.max(Math.min(this.steering + ((Math.random() * 2) - 1) / 5, this.maxSteering), -this.maxSteering);
        this.direction = this.direction.rotate(this.steering / 200);
        this.parent.position = this.parent.position.add(this.speed.multiply(this.direction).scale(obj.interval / 10));

        if (this.parent.position.x > this.level.width + this.radius) {
            this.parent.position.x = -this.radius;
        }
        if (this.parent.position.y > this.level.height + this.radius) {
            this.parent.position.y = -this.radius;
        }
        if (this.parent.position.x < -this.radius) {
            this.parent.position.x = this.level.width + this.radius;
        }
        if (this.parent.position.y < -this.radius) {
            this.parent.position.y = this.level.height + this.radius;
        }
    }
}