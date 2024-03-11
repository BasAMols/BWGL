import { Vector2 } from '../utils/vector2';
import { CanvasSquare } from './canvasSquare';

export class CanvasColorBackground extends CanvasSquare {
    constructor(color: string) {
        super({
            position: Vector2.zero,
            color,
        });
    }

    build() {
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2)=>{
            this.size = this.parent.size;            
        });
    }

}


