import { ElementRelativity } from '../utils/elementPosition';
import { TickerReturnData } from '../utils/ticker';
import { CanvasElement, CanvasElementAttributes, CanvasElementType } from './canvasElement';
import { PrepAnimation } from './prepAnimation';
import { PrepSpritesheet } from './spritesheet';

export type CanvasAnimationAttributes = CanvasElementAttributes & {
    animation: PrepAnimation | PrepSpritesheet,
    interval?: number,
    paralax?: number,
    shadow?: [string, number, number, number],
    reverse?: boolean,

};
export class CanvasAnimation extends CanvasElement {
    public type: CanvasElementType = 'animation';
    public relativity: ElementRelativity = 'anchor';
    public ready: boolean = false;
    private prepped: PrepAnimation | PrepSpritesheet;
    public frame: number = 0;
    public interval: number;
    public shadow: [string, number, number, number];
    public reverse: boolean;

    public get max (){ return this.prepped.max }
    public get frames (){ return this.prepped.frames }

    constructor(attr: CanvasAnimationAttributes) {
        super({...attr, autoReady: false});
        this.prepped = attr.animation;
        this.prepped.callback = this.build.bind(this);
        this.interval = attr.interval || this.prepped.interval;
        this.shadow = attr.shadow;
        this.reverse = attr.reverse || false;
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
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.frame = (this.frame+1)%(this.max*this.interval);
        this.frames.forEach((frame,i) => {
            if (this.reverse){
                frame.active = Math.floor(this.frame/this.interval) === this.max - i - 1;
            } else {
                frame.active = Math.floor(this.frame/this.interval) === i;
            }
        });
    }
}
