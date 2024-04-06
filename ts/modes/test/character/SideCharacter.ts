import { CanvasAnimation } from '../../../elements/canvas/canvasAnimation';
import { CanvasSquare } from '../../../elements/canvas/canvasSquare';
import { Character } from '../../../utils/character';
import { CanvasController } from '../../../utils/controller';
import { ElementRelativity } from '../../../utils/elementPosition';
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
    }

    build() {
        this.level.addControllers([new CameraController({ target: this })]);
        this.addChild(new CanvasSquare({
            color: null,
            size: this.size,
            stroke: 'blue',
            strokeWidth: 2,	
        }));
    }
}