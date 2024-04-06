import { ElementRelativity } from '../../utils/elementPosition';
import { TickerReturnData } from '../../utils/ticker';
import { CanvasElementAttributes, CanvasElement, CanvasElementType } from './canvasElement';
import { PrepAnimation } from '../prepAnimation';
import { PrepSpritesheet } from '../spritesheet';

export type CanvasAnimationAttributes = CanvasElementAttributes & {
    animation: PrepAnimation | PrepSpritesheet,
    frameRate?: number,
    paralax?: number,
    shadow?: [string, number, number, number],
    reverse?: boolean,
    loop?: boolean,
};


export class CanvasAnimation extends CanvasElement {
    public type: CanvasElementType = 'animation';
    public relativity: ElementRelativity = 'anchor';
    public ready: boolean = false;
    private prepped: PrepAnimation | PrepSpritesheet;
    public frame: number = 0;
    public frameRate: number;
    public shadow: [string, number, number, number];
    public reverse: boolean;
    public loop: boolean = true;
    public playing: boolean = false;

    public get max() { return this.prepped.max; }
    public get frames() { return this.prepped.frames; }

    constructor(attr: CanvasAnimationAttributes) {
        super({ ...attr, autoReady: false });
        this.prepped = attr.animation;
        this.prepped.callback = this.build.bind(this);
        this.frameRate = attr.frameRate || this.prepped.frameRate;
        this.shadow = attr.shadow;
        this.reverse = attr.reverse || false;
        this.loop = attr.loop !== undefined ? attr.loop : true;
    }

    get width() {
        return this.prepped.size.x;
    }

    get height() {
        return this.prepped.size.y;
    }


    build(): void {
        this.prepped.frames.forEach((frame) => {
            this.addChild(frame, true);
            frame.shadow = this.shadow;
        });
        this.playing = true;
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        if (this.playing){
            const inc = 1/ (obj.frameRate / this.frameRate);
    
            if (this.loop) {
                this.frame = (this.frame + inc) % (this.max);
            } else {
                this.frame = Math.min((this.frame + inc), this.max - 1) ;
            }
    
            this.frames.forEach((frame, i) => {
                frame.active = Math.floor(this.frame) === (this.reverse?this.max - i - 1:i);
            });
        }
        
    }
}