import { ElementRelativity } from '../utils/elementPosition';
import { TickerReturnData } from '../utils/ticker';
import { CanvasElement, CanvasElementAttributes, CanvasElementType } from './canvasElement';
import { PrepAnimation } from './prepAnimation';
import { PrepSpritesheet } from './spritesheet';

export type CanvasAnimationAttributes = CanvasElementAttributes & {
    animation: PrepAnimation | PrepSpritesheet,
    interval?: number,
    paralax?: number
};
export class CanvasAnimation extends CanvasElement {
    public type: CanvasElementType = 'animation';
    public relativity: ElementRelativity = 'anchor';
    public ready: boolean = false;
    private prepped: PrepAnimation | PrepSpritesheet;
    private frame: number = 0;
    public interval: number;

    public get max (){ return this.prepped.max }
    public get frames (){ return this.prepped.frames }

    constructor(attr: CanvasAnimationAttributes) {
        super({...attr, autoReady: false});
        this.prepped = attr.animation;
        this.prepped.callback = this.build.bind(this);
        this.interval = attr.interval || this.prepped.interval;
    }

    build(): void {
        this.prepped.frames.forEach((frame) => {
            this.addChild(frame);
        });
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.frame = (this.frame+1)%(this.max*this.interval);
        this.frames.forEach((frame,i) => {
            frame.active = Math.floor(this.frame/this.interval) === i;
        });
    }
}
