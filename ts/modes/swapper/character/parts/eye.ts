
import { CanvasCircle } from '../../../../canvas/canvasCircle';
import { CanvasElipse } from '../../../../canvas/canvasElipse';
import { TickerReturnData } from '../../../../utils/ticker';
import { Vector2 } from '../../../../utils/vector2';

export class Eye extends CanvasCircle {
    public readonly colorType = 'radialGradient';
    public offset: Vector2;

    constructor(offset: Vector2, size: number = 65) {
        super({
            radialGradient: {
                stops: [[0, '#555555'], [0.5, 'black'], [0.5, 'white'], [1, 'grey'],],
            },
            // strokeWidth: 5,
            radius: size, 
            radiusY: size*1.1, 
            stroke: 'black', 
        });
        this.offset = offset
    }
    tick(obj: TickerReturnData){
        super.tick(obj);
        this.radialGradient.offset = new Vector2(
            -this.radius*Math.max(Math.min((this.movedAmount.x / obj.interval), .50),-.50),
            -this.radiusY*Math.max(Math.min((this.movedAmount.y / obj.interval), .60),-.60),
        )
        
        this.position = this.parent.position.add(this.offset)
    }
}
