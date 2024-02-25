import { CanvasElement } from '../canvas/canvasElement';
import { CanvasWrapper } from '../canvas/canvasWrapper';
import { TickerReturnData } from './ticker';
import { DomElement } from '../dom/domElement';
import { Vector2 } from './vector2';
import { CanvasSquare } from '../canvas/canvasSquare';

export class Renderer extends CanvasWrapper {
    public ctx: CanvasRenderingContext2D;
    public canvas: DomElement<'canvas'>;
    public hasDom = true;
    blockRight: CanvasSquare;
    public constructor() {
        super({ hasDom: true });
    }

    build() {

        this.canvas = new DomElement('canvas');
        this.canvas.dom.tabIndex = 1;
        this.blockRight = new CanvasSquare({
                position: new Vector2(0, 0),
                size: new Vector2(20, 20),
                color: 'black'
            });
            this.addChild(this.blockRight, true);

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
            element.lowerChildren.forEach((child) => this.recursive(child));
            this.renderAll(element);
            element.higherChildren.forEach((child) => this.recursive(child));
        }
    }

    public renderAll(c: CanvasElement) {
        const activeLevel = Object.values(Object.values(this.game.modes).find((mode) => mode.active)?.levels).find((level) => level.active);
        if (activeLevel.width < this.canvas.width) {
            this.blockRight.visible = true
            this.blockRight.position = new Vector2(activeLevel.width, 0);
            this.blockRight.size = new Vector2(this.canvas.width - activeLevel.width, this.canvas.height);
        } else {
            this.blockRight.visible = false
        }

        c.render(this.ctx);
    }
}