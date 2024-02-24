import { TickerReturnData } from '../../../utils/ticker';
import { Vector2 } from '../../../utils/vector2';
import { Snake, SnakeColors } from './snake';

export class RandomSnake extends Snake {
    private speed = new Vector2(10, 10);
    private direction = Vector2.up;
    private steering: number = Math.random();
    private maxSteering: number = 5;
    constructor(
        {
            position = Vector2.zero,
            direction = Vector2.up,
            colors = 'rainbow'
        }: {
            position?: Vector2;
            direction?: Vector2;
            colors?: SnakeColors
        } = {}
    ) {
        super({ position, totals: 40, distance: 6, colors });
        this.moving = true;
        this.direction = direction;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        this.steering = Math.max(Math.min(this.steering + ((Math.random() * 2) - 1) / 5, this.maxSteering), -this.maxSteering);
        this.direction = this.direction.rotate(this.steering / 200);
        this.position = this.position.add(this.speed.multiply(this.direction).scale(obj.interval / 10));

        if (this.position.x > this.level.width + this.radius) {
            this.position.x = -this.radius;
        }
        if (this.position.y > this.level.height + this.radius) {
            this.position.y = -this.radius;
        }
        if (this.position.x < -this.radius) {
            this.position.x = this.level.width + this.radius;
        }
        if (this.position.y < -this.radius) {
            this.position.y = this.level.height + this.radius;
        }
    }
}
