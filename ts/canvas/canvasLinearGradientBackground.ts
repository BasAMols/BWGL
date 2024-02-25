import { Vector2 } from '../utils/vector2';
import { CanvasSquare } from './canvasSquare';
import { LinearGradient } from './canvasColor';


export class CanvasLinearGradientBackground extends CanvasSquare {
    public colorType = 'linearGradient' as const;
    constructor(liniarGradient: LinearGradient) {
        super({
            position: Vector2.zero,
            linearGradient: liniarGradient
        });
    }

    build() {
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2) => {
            this.size = this.level.size;
        });
    }
}
