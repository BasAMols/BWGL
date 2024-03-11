import { CanvasSquare } from '../elements/canvasSquare';
import { CanvasWrapper, CanvasWrapperAttributes } from '../elements/canvasWrapper';
import { Collider } from './collider';
import { ElementRelativity } from './elementPosition';
import { Vector2 } from "./vector2";

export type levelAttributes =  CanvasWrapperAttributes & {

}
export abstract class Level extends CanvasWrapper{
    abstract start: Vector2;
    abstract background: CanvasSquare;
    public relativity: ElementRelativity = 'anchor';
    public ready = false;
    public colliders: Collider[] = [];

    constructor(attr: levelAttributes = {}) {
        super(attr);
        this.level = this;
        this.mode = this.mode;
        this.size = this.size;
    }

}
