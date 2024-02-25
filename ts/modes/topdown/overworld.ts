import { CanvasColorBackground } from '../../canvas/canvasBackground';
import { CanvasGrid } from '../../canvas/canvasGrid';
import { Level } from '../../utils/level';
import { Vector2 } from '../../utils/vector2';
import { MoveableSnake } from './moveAbleSnake';

export class Overworld extends Level {
    private zoom = 3;

    public start = new Vector2(13*50, 8*50)
    public background = new CanvasColorBackground('#272727')
    public height = 20*this.zoom*16
    public width = 20*this.zoom*16

    build() {
        this.addChild(this.background);
        this.addChild(new CanvasGrid({json: '/json/overworld/terrain.json', width: 19, height: 19, factor: this.zoom}));
        this.addChild(new CanvasGrid({json: '/json/overworld/Objects.json', width: 19, height: 19, factor: this.zoom}));
        this.addChild(new CanvasGrid({json: '/json/overworld/decorations.json', width: 19, height: 19, factor: this.zoom}));
        this.addChild(new CanvasGrid({json: '/json/overworld/overlay.json', width: 19, height: 19, factor: this.zoom}));
        this.addChild(new MoveableSnake(this.start));
    }
}