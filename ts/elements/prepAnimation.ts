import { Game } from '../game';
import { CanvasImage } from './canvas/canvasImage';
import { PrepImage } from './prepImage';

export type PrepAnimationAttributes = {
    frameRate?: number;
    factor?: number;
    urls: string[];
};
export class PrepAnimation {
    public type: 'animation' = 'animation';
    public frames: CanvasImage[] = [];
    public max: number = 0;
    public factor: number;
    public ready: boolean = false;
    protected urls: string[];
    public frameRate: number;
    protected game: Game;
    public callback: ()=>void;

    public get size() {
        return this.frames[0].prepped.size;
    }

    constructor(attr: PrepAnimationAttributes, game: Game) {
        this.game = game;
        this.factor = attr.factor || 1;
        this.frameRate = attr.frameRate || 10;
        this.urls = attr.urls;
        this.add();
    }

    protected add() {
        this.urls.forEach((url)=>{      
            this.game.waitCount++;
            const frame = new CanvasImage({image: new PrepImage({ url, factor: this.factor }, this.game)});
            this.frames.push(frame);
            this.game.waitCount--;
            this.max++;
        });
        if(this.callback){
            this.callback();
        }
    }
}
