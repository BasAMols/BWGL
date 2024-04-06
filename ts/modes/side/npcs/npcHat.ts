import { CanvasController } from '../../../utils/controller';
import { Vector2 } from '../../../utils/vector2';
import { WalkingNPC } from './walkingNPC';

export class NPCHat extends WalkingNPC {
    constructor({
        scale = 5,
        position = Vector2.zero,
        controllers = [],
        width,
    }: {
        scale?: number;
        position?: Vector2;
        controllers?: CanvasController[];
        width: number
    }) {
        super({
            scale,
            position,
            controllers,
            size: new Vector2(39, 52),
            idle: '/img/spritesheets/hat-man-idle.png',
            idleCount: 4,
            idleInterval: 10,
            walk: '/img/spritesheets/hat-man-walk.png',
            walkCount: 6,
            walkInterval: 15,            
            width,
            waitTime: 40*4+200
        });
    }
}