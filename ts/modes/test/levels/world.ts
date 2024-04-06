import { CanvasColorBackground } from '../../../elements/canvas/canvasBackground';
import { Level } from '../../../utils/level';
import { Vector2 } from '../../../utils/vector2';
import { SideCharacter } from '../character/SideCharacter';
import { Grid } from './train';


export class World extends Level {
    public start = Vector2.zero;
    public background = new CanvasColorBackground('#46345E');
    public character: SideCharacter;
    public grid: Grid;

    constructor() {
        super({
            size: new Vector2((256 * 6) * 2, 1200),
            depth: 400,
        });
    }

    build() {
        this.start = new Vector2((256 * 6) * 1, 15 * 6 + 90);
        // this.addChild(new GLCamera());
        // this.addChild(new GLLight());
        // this.addChild(new GLMesh());
    }

}