import { Vector2 } from '../../utils/vector2';
import { CanvasSquare } from './canvasSquare';
import { RadialGradient } from './canvasColor';


export class CanvasRadialGradientBackground extends CanvasSquare {
    public colorType = 'radialGradient' as const;
    constructor(radialGradient: RadialGradient) {
        super({
            position: Vector2.zero,
            radialGradient: radialGradient
        });
    }

    build() {
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2) => {
            this.size = this.level.size;
        });
    }
}
