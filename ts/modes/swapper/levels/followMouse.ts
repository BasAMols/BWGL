import { CanvasRadialGradientBackground } from '../../../canvas/canvasBackground';
import { Vector2 } from "../../../utils/vector2";
import { Level } from "../../../utils/level";
import { Snake } from '../character/snake';
import { MouseSnake } from '../character/mouseSnake';

export class FollowLevel extends Level {
    public start = new Vector2(300, 400);
    public background = new CanvasRadialGradientBackground({
        stops: [[0, 'red'], [1, 'blue']],
    });
    public height = 1145;
    public width = 2000;
    public snake: MouseSnake;

    build() {
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2) => {
            this.width = size.x;
            this.height = size.y;
        });
        this.addChild(this.background);
        this.snake = new MouseSnake(new Vector2(0 - 150, 200), Vector2.right);
        this.addChild(this.snake);
    }

    mouseMove(e: MouseEvent){
        super.mouseMove(e);
        this.snake.target = new Vector2(e.clientX, e.clientY);
    }
}