import { CanvasAnimation } from '../../../elements/canvas/canvasAnimation';
import { PrepSpritesheet } from '../../../elements/spritesheet';
import { Character } from '../../../utils/character';
import { ElementRelativity } from '../../../utils/elementPosition';
import { Vector2 } from '../../../utils/vector2';

export abstract class IdleNPC extends Character {
    public relativity: ElementRelativity = 'anchor';
    public animations: Record<string, CanvasAnimation> = {};
    public scale: number;
    private specifics: [string, number, number, number];

    constructor({
        scale = 5,
        position = Vector2.zero,
        size,
        idle,
        idleCount,
        idleInterval,
        direction = -1
    }: {
        scale?: number;
        position?: Vector2;
        size: Vector2,
        idle: string,
        idleCount: number,
        idleInterval: number,
        direction: number;
    }) {
        super({
            position,
            size: new Vector2(size.x, size.y),
        });
        this.scale = scale;
        this.specifics = [idle, idleCount, idleInterval, direction];
    }

    build() {
        const [url, count, interval, direction] = this.specifics;

        this.animations.idle = new CanvasAnimation({
            animation: new PrepSpritesheet({
                url,
                factor: this.scale,
                size: this.size,
                repeatX: count,
                frameRate: interval,
            }, this.game),
            zoom: new Vector2(direction, 1),
            position: new Vector2(this.size.x * this.scale / 2 * direction * -1, 0),
        });
        this.addChild(this.animations.idle, true);

        this.size = this.size.scale(this.scale);
    }
}