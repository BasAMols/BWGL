
import { CanvasCircle } from '../../../../canvas/canvasCircle';
import { TickerReturnData } from '../../../../utils/ticker';
import { Vector2 } from '../../../../utils/vector2';

export class Eye extends CanvasCircle {
    public renderStyle = 'over' as const;
    public readonly colorType = 'radialGradient';
    public offset: Vector2;

    constructor(offset: Vector2) {
        super({
            radialGradient: {
                stops: [[0.3, 'black'], [0.4, 'white'], [0.9, 'red'], [0.9, 'black']],
            },
            radius: 65, 
            stroke: 'black', 
        });
        this.offset = offset
    }
    tick(obj: TickerReturnData){
        super.tick(obj);
        this.position = this.parent.position.add(this.offset)
    }
}
