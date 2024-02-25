import { TickerReturnData } from '../../../utils/ticker';
import { Vector2 } from '../../../utils/vector2';
import { Snake } from './snake';

export class MouseSnake extends Snake {
    private speed = new Vector2(6, 6);
    private direction = Vector2.right;
    private steering: number = 0;
    private maxSteering: number = 5;
    public target: Vector2;
    constructor(position: Vector2 = Vector2.zero, direction: Vector2 = Vector2.up) {
        super({ position, totals: 50, distance: 6, colors: 'green' });
        this.moving = true;
        this.direction = direction;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        if (this.target) {
            const d = this.target.subtract(this.position).angle()+ Math.PI - this.direction.angle();
            
            if (d > Math.PI || d < 0){
                this.direction = this.direction.rotate(Math.PI/120);
            } else {
                this.direction = this.direction.rotate(-Math.PI/120);
            }
            this.position = this.position.add(this.direction.multiply(this.speed).scale(obj.interval / 10));

        }
    }
}
