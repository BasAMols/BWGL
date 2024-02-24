import { CanvasSquare } from '../canvas/canvasSquare';
import { CanvasColor } from '../canvas/canvasColor';
import { CanvasCircle } from '../canvas/canvasCircle';
import { CanvasElement } from '../canvas/canvasElement';
import { CanvasWrapper } from '../canvas/canvasWrapper';
import { TickerReturnData } from './ticker';
import { DomElement } from '../dom/domElement';
import { Vector2 } from './vector2';
import { Input } from './input';

export class Renderer extends CanvasWrapper {
    public ctx: CanvasRenderingContext2D;
    public canvas: DomElement<'canvas'>;
    public hasDom = true;
    public constructor() {
        super({hasDom: true});
    }

    build() {

        this.canvas = new DomElement('canvas');
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2)=>{
            this.canvas.size = size;
        });
        this.game.resize();

        this.ctx = this.canvas.dom.getContext('2d');
        this.dom.appendChild(this.canvas);
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.recursive(this);
    }

    private recursive(parent: CanvasElement) {
        if (parent.active && parent.visible) {
            if (parent.renderStyle === 'under'){
                this.render(parent);
            }
            parent.children.forEach((child) => this.recursive(child));
            if (parent.renderStyle === 'over'){
                this.render(parent);
            }
        }
    }

    private render(c: CanvasElement) {
        if (c.type === 'color') {
            (c as CanvasColor).render(this.ctx);
        }
    }
}