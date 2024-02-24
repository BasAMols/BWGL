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

    constructor(attr: levelAttributes = {}) {
        super(attr);
        this.level = this;
    }

    public mouseMove(e: MouseEvent) {
        // 
    }
}
