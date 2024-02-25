import { CanvasElement } from '../canvas/canvasElement';
import { CanvasWrapper } from '../canvas/canvasWrapper';
import { TickerReturnData } from './ticker';
import { DomElement } from '../dom/domElement';
import { Vector2 } from './vector2';

export class Renderer extends CanvasWrapper {
    public ctx: CanvasRenderingContext2D;
    public canvas: DomElement<'canvas'>;
    public hasDom = true;
    public constructor() {
        super({ hasDom: true });
    }

    build() {

        this.canvas = new DomElement('canvas');
        this.canvas.dom.tabIndex = 1;
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2) => {
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

    private recursive(element: CanvasElement) {
        if (element.active && element.visible) {
            if (element.renderStyle === 'under') {
                this.renderAll(element);
            }
            element.children.forEach((child) => this.recursive(child));
            if (element.renderStyle === 'over') {
                this.renderAll(element);
            }
        }
    }

    public renderAll(c: CanvasElement) {
        c.render(this.ctx);
    }
}