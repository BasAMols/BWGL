import { CanvasElementRelativity } from '../canvas/canvasElement';
import { CanvasSquare } from '../canvas/canvasSquare';
import { CanvasWrapper, CanvasWrapperAttributes } from '../canvas/canvasWrapper';
import { Vector2 } from "./vector2";

export type levelAttributes =  CanvasWrapperAttributes & {

}
export abstract class Level extends CanvasWrapper{
    abstract start: Vector2;
    abstract background: CanvasSquare;
    abstract height: number;
    abstract width: number;
    public relativity: CanvasElementRelativity = 'anchor';


    public get size(): Vector2 {
        return new Vector2(this.width, this.height);
    }
    public set size(value: Vector2) {
        this.width = value.x;
        this.height = value.y;
    }
    public ready = false;

    constructor(attr: levelAttributes = {}) {
        super(attr);
        this.level = this;
    }
}
