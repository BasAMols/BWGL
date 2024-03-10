import { CanvasElement } from '../canvas/canvasElement';
import { ElementAttributes } from "../utils/element";
import { Mode } from '../utils/mode';
import { TickerReturnData } from '../utils/ticker';
import { Vector2 } from "../utils/vector2";
import { DomElement } from './domElement';

export type DomElementAttributes = ElementAttributes & {
    id?: string,
    size?: Vector2,
    background?: string,
    position?: Vector2;
};
export class DomCanvas extends DomElement<'canvas'> {
    public dom: HTMLElementTagNameMap['canvas'];
    public ctx: CanvasRenderingContext2D;

    constructor() {
        super('canvas');
        this.dom = document.createElement('canvas');
        this.dom.style.position = 'absolute';
        this.dom.style.imageRendering = 'pixelated';
        this.dom.style.pointerEvents = 'all';
        this.dom.style.bottom = '0px';
        this.ctx = this.dom.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    }

    public build(): void {
        this.game.ctx = this.ctx;
        this.dom.tabIndex = 1;

        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2) => {
            this.size = size;
        });
        this.game.resize();
    }

    public addMode(child: Mode) {
        child.parent ??= this.game;
        child.game ??= this.game;
        child.mode ??= this.mode;
        child.level ??= this.level;
        this.game.dom.appendChild(child.dom);
        child.registerControllers(child);
        child.build();
    }

    public tick(obj: TickerReturnData) {

        // this.ctx.fillStyle = 'red';
        // this.ctx.beginPath();
        // this.ctx.roundRect(100, 100, 100, 100, 100);
        // this.ctx.fill();
        // this.ctx.closePath();

        super.tick(obj);

        this.ctx.save();
        this.ctx.scale(1, -1);
        this.ctx.translate(0, -this.height);

        Object.values(this.game.modes).filter((child) => child.active).forEach((mode) => mode.tick(obj));
        Object.values(this.game.modes).filter((child) => child.visible && child.active).forEach((mode) => {
            mode.preRender(this.ctx);
            mode.postRender(this.ctx);
        });
        this.ctx.restore();
    }
}


