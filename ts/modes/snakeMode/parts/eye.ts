
import { CanvasCircle } from '../../../elements/canvas/canvasCircle';
import { TickerReturnData } from '../../../utils/ticker';
import { Vector2 } from '../../../utils/vector2';

export class Eye extends CanvasCircle {
    public readonly colorType = 'radialGradient';
    public offset: Vector2;

    constructor(offset: Vector2, size: number = 65) {
        super({
            radialGradient: {
                stops: [[0, '#666'], [0.5, 'black'], [0.5, 'white'], [1, 'grey'],],
            },
            strokeWidth: 0.08*size,
            radius: size,
            radiusY: size * 1.1,
            stroke: 'black',
        });
        this.offset = offset;
    }
    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.radialGradient.offset = new Vector2(
            -this.radius * this.movedAmount.x*0.2,
            -this.radiusY * this.movedAmount.y*0.2,
        );
        this.radialGradient.offset.x = Math.min(this.radialGradient.offset.x, this.radius *0.6);
        this.radialGradient.offset.x = Math.max(this.radialGradient.offset.x, -this.radius *0.6);
        this.radialGradient.offset.y = Math.min(this.radialGradient.offset.y, this.radiusY *0.6);
        this.radialGradient.offset.y = Math.max(this.radialGradient.offset.y, -this.radiusY *0.6);

        this.position = this.parent.position.subtract(this.offset);
    }
}
