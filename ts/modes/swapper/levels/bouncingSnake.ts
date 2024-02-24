import { CanvasColorBackground } from '../../../canvas/canvasBackground';
import { Vector2 } from "../../../utils/vector2"
import { Level } from "../../../utils/level"
import { BounceSnake } from '../character/bouncingSnake';

export class BouncerLevel extends Level {
    public start = new Vector2(300, 400)
    public background = new CanvasColorBackground('black')
    public height = 1145
    public width = 2000

    build(){
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2)=>{
            this.width = size.x
            this.height = size.y
        });
        this.addChild(this.background);
        this.addChild(new BounceSnake(new Vector2(300,200), Vector2.right))
    }

}
