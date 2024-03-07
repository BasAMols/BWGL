import { CanvasAnimation } from '../../../canvas/canvasAnimation';
import { CanvasPrepSprites, SpriteAnimationJSON } from '../../../canvas/canvasPrepSprites';
import { CanvasSquare } from '../../../canvas/canvasSquare';
import { PrepAnimation } from '../../../canvas/prepAnimation';
import { Character } from '../../../utils/character';
import { CanvasController } from '../../../utils/controller';
import { ElementRelativity } from '../../../utils/elementPosition';
import { TickerReturnData } from '../../../utils/ticker';
import { Util } from '../../../utils/utils';
import { Vector2 } from '../../../utils/vector2';

export class SideCharacter extends Character {
    private scale: number = 5;
    public relativity: ElementRelativity = 'anchor';
    public animations: Record<string, CanvasAnimation> = {};
    public direction: '00' | '09' | '18' | '27' = '00';
    public phase: 'idle' | 'attack' | 'walk' = 'idle';

    constructor({
        scale = 5,
        position = Vector2.zero,
        controllers = []
    }: {
        scale?: number;
        position?: Vector2;
        controllers?: CanvasController[];
    } = {}) {
        super({
            position,
            controllers,
            size: new Vector2(10 * scale, 20 * scale),
        });
    }

    build() {
        super.build();

        this.addChild(new CanvasSquare({
            color: 'red',
            size: this.size,
        }))

    }
    // public tick(o: TickerReturnData) {
    //     super.tick(o);
    //     this.phase = this.movedAmount.magnitude() > .1 ? 'walk' : 'idle';
    //     if (this.phase === 'walk') {
    //         const degrees = (3 - Math.round((this.movedAmount.angleDegrees() + 1) / 90 + 4) % 4) * 9;
    //         this.direction = degrees.toString().padStart(2, '0') as '00' | '09' | '18' | '27';
    //     }
        
    //     Object.entries(this.animations).forEach(([key, animation]) => {
    //         if (key.startsWith('walk')){
    //             animation.interval = Util.clamp(Math.floor(30 - this.movedAmount.magnitude()*0.8), 5, 50);
    //         }
    //         animation.active = key === `${this.phase}${this.direction}`;
    //     });

    // }
}
