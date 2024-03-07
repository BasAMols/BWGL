import { Game } from '../game';
import { Vector2 } from '../utils/vector2';
import { CanvasImage } from './canvasImage';
import { PrepImage } from './prepImage';

export type PrepSpritesheetAttributes = {
    url: string,
    size: Vector2;
    repeatX?: number,
    repeatY?: number,
    sectionX?: number,
    sectionY?: number,
    interval?: number;
    factor?: number;
};
export class PrepSpritesheet {
    public type: 'animation' = 'animation';
    protected url: string;
    protected size: Vector2;
    protected repeatX: number;
    protected repeatY: number;
    protected sectionX: number;
    protected sectionY: number;
    protected factor: number;
    protected game: Game;
    public ready: boolean = false;
    public interval: number;
    public frames: CanvasImage[] = [];
    public max: number = 0;
    public callback: ()=>void;

    constructor(attr: PrepSpritesheetAttributes, game: Game) {
        this.game = game;
        this.factor = attr.factor || 1;
        this.interval = attr.interval || 10;
        this.url = attr.url;
        this.size = attr.size;
        this.repeatX = attr.repeatX || 1;
        this.repeatY = attr.repeatY || 1;
        this.sectionX = attr.sectionX || 0;
        this.sectionY = attr.sectionY || 0;
        this.game.waitCount++;
        const i = new Image();
        i.src = this.url;
        i.onload = () => {
            this.game.waitCount--;
            this.add(i);
            if(this.callback){
                this.callback();
            }
        }
    }

    protected add(image: HTMLImageElement) {
        for (let j = 0; j < this.repeatY; j++) {
            for (let i = 0; i < this.repeatX; i++) {
                const frame = new CanvasImage({
                    image: new PrepImage({
                        image,
                        url: this.url,
                        factor: this.factor,
                        cropPosition: new Vector2(this.sectionX + (this.size.x * i), this.sectionY + (this.size.y * j)),
                        cropSize: this.size
                    },this.game)
                });
                this.frames.push(frame);
                this.max++;
            }
        }
    }
}



