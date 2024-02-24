import { Vector2 } from '../utils/vector2';
import { CanvasSquare } from './canvasSquare';
import { LinearGradient, RadialGradient } from './canvasColor';

export class CanvasColorBackground extends CanvasSquare {
    constructor(color: string) {
        super({
            position: Vector2.zero,
            color,
        });
    }

    build() {
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2)=>{
            this.size = size
        });
    }
}

export class CanvasLinearGradientBackground extends CanvasSquare {
    public colorType = 'linearGradient' as const;
    constructor(liniarGradient: LinearGradient) {
        super({
            position: Vector2.zero,
            linearGradient: liniarGradient
        });
    }

    build() {
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2)=>{
            this.size = size
        });
    }
}

export class CanvasRadialGradientBackground extends CanvasSquare {
    public colorType = 'radialGradient' as const;
    constructor(radialGradient: RadialGradient) {
        super({
            position: Vector2.zero,
            radialGradient: radialGradient
        });
    }

    build() {
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2)=>{
            this.size = size
        });
    }
}
