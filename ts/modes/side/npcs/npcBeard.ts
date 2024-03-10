import { CanvasController } from '../../../utils/controller';
import { Vector2 } from '../../../utils/vector2';
import { WalkingNPC } from './walkingNPC';

export class NPCBeard extends WalkingNPC {
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
            size: new Vector2(40, 47),
            idle: '/img/spritesheets/bearded-idle.png',
            idleCount: 5,
            idleInterval: 30,
            walk: '/img/spritesheets/bearded-walk.png',
            walkCount: 5,
            walkInterval: 60,
            width
        });
    }
}