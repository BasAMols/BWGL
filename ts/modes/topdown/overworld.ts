import { CanvasColorBackground } from '../../canvas/canvasBackground';
import { CanvasGrid } from '../../canvas/canvasGrid';
import { Bounce } from '../../controllers/bounce';
import { DirectTop } from '../../controllers/directTop';
import { Random } from '../../controllers/random';
import { Level } from '../../utils/level';
import { Vector2 } from '../../utils/vector2';
import { Snake } from '../swapper/character/snake';

export class Overworld extends Level {
    private zoom = 3;

    public start = new Vector2(-100, -100)
    public background = new CanvasColorBackground('#272727')
    public height = 20*this.zoom*16
    public width = 20*this.zoom*16

    build() {
        this.addChild(this.background);
        this.addChild(new CanvasGrid({json: '/json/overworld/terrain.json', width: 19, height: 19, factor: this.zoom}));
        this.addChild(new CanvasGrid({json: '/json/overworld/Objects.json', width: 19, height: 19, factor: this.zoom}));
        this.addChild(new CanvasGrid({json: '/json/overworld/decorations.json', width: 19, height: 19, factor: this.zoom}));
        this.addChild(new CanvasGrid({json: '/json/overworld/overlay.json', width: 19, height: 19, factor: this.zoom}));
        this.addChild(new Snake({ 
            position: this.start, 
            totals: 30, 
            distance: 6, 
            topRadius: 100,
            bottomRadius: 4,
            colors: 'green', 
            controllers: [ new  Random(100, Vector2.down)] 
        }));
    }
}