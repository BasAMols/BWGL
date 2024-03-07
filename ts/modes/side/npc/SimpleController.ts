import { Character } from '../../../utils/character';
import { Collisions } from '../../../utils/collisions';
import { CanvasController } from '../../../utils/controller';
import { TickerReturnData } from '../../../utils/ticker';
import { Util } from '../../../utils/utils';
import { Vector2 } from '../../../utils/vector2';

export class SimpleController extends CanvasController {
    private speed = 1;

    private direction: number;
    private length: number;
    private place: number;

    constructor(length: number, direction: -1|1 = 1, place: number = 0) {
        super();
        this.length = length;
        this.direction = direction;
        this.place = place
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        this.place += (this.speed*obj.interval/10)*this.direction;
        if (this.place > this.length) {
            this.place = this.length;
            this.direction = -1;
        }
        if (this.place < 0) {
            this.place = 0;
            this.direction = 1;
        }
        // console.log(this.place);
        
        this.parent.x = this.place;
    }
}