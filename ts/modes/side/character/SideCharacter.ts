import { CanvasAnimation } from '../../../elements/canvas/canvasAnimation';
import { PrepSpritesheet } from '../../../elements/spritesheet';
import { Character } from '../../../utils/character';
import { CanvasController } from '../../../utils/controller';
import { ElementRelativity } from '../../../utils/elementPosition';
import { TickerReturnData } from '../../../utils/ticker';
import { Util } from '../../../utils/utils';
import { Vector2 } from '../../../utils/vector2';
import { CameraController } from '../../snakeMode/controllers/cameraController';

export class SideCharacter extends Character {
    private scale: number = 5;
    public relativity: ElementRelativity = 'anchor';
    public animations: Record<string, CanvasAnimation> = {};
    public direction: number = 1;
    public phase: 'idle' | 'walk' = 'idle';
    private specifics: [`${typeof this.phase}`, string, number, number][];

    constructor({
        position = Vector2.zero,
        controllers = []
    }: {
        position?: Vector2;
        controllers?: CanvasController[];
    } = {}) {
        super({
            position,
            controllers,
            size: new Vector2(15*5, 40*5),
        });
        this.specifics = [
            ['idle', '/img/spritesheets/hat-man-idle.png', 4, 5],
            ['walk', '/img/spritesheets/hat-man-walk.png', 6, 5],
        ];
    }

    build() {
        this.level.addControllers([new CameraController({ target: this })]);

        this.specifics.forEach(([key, url, count, fps]) => {
            this.animations[key] = new CanvasAnimation({
                animation: new PrepSpritesheet({
                    url,
                    factor: this.scale,
                    size: new Vector2(39, 52),
                    repeatX: count,
                    frameRate: fps,
                }, this.game),
            });

            this.addChild(this.animations[key], true);
        });

    }
    public tick(o: TickerReturnData) {
        super.tick(o);
        this.phase = this.movedAmount.magnitude() > .1 ? 'walk' : 'idle';

        Object.entries(this.animations).forEach(([key, a])=>{
            if (this.movedAmount.x !== 0){
                a.zoom = new Vector2(this.movedAmount.x < 0 ? 1 : -1, 1);
                a.x = ((20*this.scale) * (this.movedAmount.x < 0 ? -1 : 1)) + (7.5*this.scale)
            }
            if (key.startsWith('walk')) {
                a.frameRate = Util.clamp(Math.floor(6 - this.movedAmount.magnitude() * 0.8), 5, 50);
            }
            a.active = key === `${this.phase}`;
        });
    }
}