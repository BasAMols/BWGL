import { CanvasAnimation } from '../../../elements/canvasAnimation';
import { PrepSpritesheet } from '../../../elements/spritesheet';
import { Character } from '../../../utils/character';
import { CanvasController } from '../../../utils/controller';
import { ElementRelativity } from '../../../utils/elementPosition';
import { TickerReturnData } from '../../../utils/ticker';
import { Vector2 } from '../../../utils/vector2';

export abstract class WalkingNPC extends Character {
    public relativity: ElementRelativity = 'anchor';
    public animations: Record<string, CanvasAnimation> = {};
    public phase: 'idle' | 'walk' = 'idle';
    public scale: number;
    public length: number = 1000;
    public direction: -1 | 1 = 1;
    public place: number = 0;
    public waitTime: number = 0;
    private speed = 1;
    private frame: number = 0;
    private waiting: boolean = false;
    private startPosition: number = 0;

    private specifics: [`${typeof this.phase}`, string, number, number, boolean][];

    constructor({
        scale = 5,
        position = Vector2.zero,
        controllers = [],
        size,
        idle,
        idleCount,
        idleInterval,
        walk,
        walkCount,
        walkInterval,
        width,
        waitTime = 0
    }: {
        scale?: number;
        position?: Vector2;
        controllers?: CanvasController[];
        idle: string,
        size: Vector2,
        idleCount: number,
        idleInterval: number,
        walk: string,
        walkCount: number,
        walkInterval: number,
        width: number,
        waitTime?: number,
    }) {
        super({
            position,
            controllers,
            size: new Vector2(size.x, size.y),
        });
        this.scale = scale;
        this.length = width;
        this.startPosition = position.x;
        this.waitTime = waitTime;
        this.specifics = [
            ['idle', idle, idleCount, idleInterval, false],
            ['walk', walk, walkCount, walkInterval, true],
        ];
    }

    build() {
        this.specifics.forEach(([key, url, count, interval, loop]) => {
            this.animations[key] = new CanvasAnimation({
                animation: new PrepSpritesheet({
                    url,
                    factor: this.scale,
                    size: this.size,
                    repeatX: count,
                    interval: interval,
                }, this.game),
                loop,
            });

            this.addChild(this.animations[key], true);
        });
        this.size = this.size.scale(this.scale);
        this.go(this.direction);
    }

    public wait(){
        this.waiting = true;
        this.frame = 0;
        this.animations.idle.frame = 0;
        this.animations.idle.active = true;
        this.animations.walk.active = false;
    }

    public go(d: -1 | 1) {
        this.turn(d)
        this.waiting = false;
        this.animations.idle.active = false;
        this.animations.walk.active = true;
    }

    public turn(d: -1 | 1) {
        this.direction = d;
        Object.entries(this.animations).forEach(([key, a]) => {
            a.zoomX = this.direction;
            a.x = this.size.x/2 * (this.direction*-1);
        });
    }

    public tick(o: TickerReturnData) {
        super.tick(o);

        if (this.waiting) {
            this.frame++;
            if (this.frame > this.waitTime) {
                this.go(this.direction *-1 as -1 | 1);
            }
        }

        if (!this.waiting) {

            this.place += (this.speed * o.interval / 10) * this.direction;
            
            if (this.place > this.length) {
                this.place = this.length;
                this.wait();
            }
            if (this.place < 0) {
                this.place = 0;
                this.wait();
            }

            this.x = this.place + this.startPosition;
        }
    }
}