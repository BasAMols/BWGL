import { CanvasColorBackground } from '../../../canvas/canvasBackground';
import { Vector2 } from "../../../utils/vector2"
import { Level } from "../../../utils/level"

export class Empty extends Level {

    public start = new Vector2(300, 400)
    public background = new CanvasColorBackground('darkblue')
    public height = 1145
    public width = 1594

    build() {
        this.addChild(this.background);
    }

}