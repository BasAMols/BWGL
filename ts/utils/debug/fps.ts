import { DomText } from "../../dom/domText";
import { TickerReturnData } from '../ticker';
import { Vector2 } from '../vector2';

export class FPS extends DomText {
    private fCount: number = 0;
    private tCount: number = 0;
    public constructor( ) {
        super({
            text: FPS.getString(0),
            fontSize: 35,
            fontWeight: 900,
            color: 'white',
            position: new Vector2(5,5), 
            size: new Vector2(100, 50),
            background: '#ff0000aa',
            fontFamily: 'monospace',
            padding: [0,10,0,10]
        });
    }

    public tick({interval}: TickerReturnData){
        this.fCount++;
        this.tCount+=interval;
        if (this.tCount > 1000){
            this.text = FPS.getString(this.fCount);
            this.fCount = 0;
            this.tCount = 0;
        }
    }

    public static getString(v: number){
        return `${String(v)}<sub style="font-size:25px; top: -7px; position: relative">FPS</sub>`
    }
}