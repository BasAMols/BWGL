import { DomText } from "../../elements/dom/domText";
import { TickerReturnData } from '../ticker';
import { Vector2 } from '../vector2';

export class FPS extends DomText {
    private fCount: number = 0;
    private tCount: number = 0;
    public constructor( ) {
        super({
            text: FPS.getString(''),
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

    public tick({frameRate, frame}: TickerReturnData){
        if (frame % 100 === 1){
            this.text = FPS.getString(frameRate.toFixed(0));
        }
    }

    public static getString(v: string){
        return `${String(v)}<sub style="font-size:25px; top: -7px; position: relative">FPS</sub>`
    }
}