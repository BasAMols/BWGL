import { TickerReturnData } from '../../utils/ticker';
import { Vector2 } from '../../utils/vector2';
import { Snake } from '../swapper/character/snake';

export class MoveableSnake extends Snake {
    private speed = new Vector2(6, 6);
    private velocity: Vector2 = Vector2.zero;

    constructor(position: Vector2 = Vector2.zero) {
        super({ position, totals: 50, distance: 6, colors: 'green' });
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        const input = new Vector2(
            this.speed.x * (this.mode.input.right ? 1 : this.mode.input.left ? -1 : 0),
            this.speed.y * (this.mode.input.down ? 1 : this.mode.input.up ? -1 : 0)
        )

        this.velocity = this.velocity.scale(0.9).add(input.scale(0.15));
        this.position = this.position.add(this.velocity.scale(obj.interval / 10));
    }
}
