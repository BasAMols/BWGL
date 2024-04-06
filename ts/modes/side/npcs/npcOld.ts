import { CanvasController } from '../../../utils/controller';
import { Vector2 } from '../../../utils/vector2';
import { WalkingNPC } from './walkingNPC';

export class NPCOld extends WalkingNPC {
    constructor({
        scale = 5,
        position = Vector2.zero,
        controllers = [],
        width
    }: {
        scale?: number;
        position?: Vector2;
        controllers?: CanvasController[];
        width: number;
    } ) {
        super({
            scale,
            position,
            controllers,
            size: new Vector2(34, 42),
            idle: '/img/spritesheets/oldman-idle.png',
            idleCount: 8,
            idleInterval: 5,
            walk: '/img/spritesheets/oldman-walk.png',
            walkCount: 12,
            walkInterval: 5, 
            width,
            waitTime: 5*8+400
        });
    }
}