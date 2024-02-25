import { Vector2 } from "../../../utils/vector2";
import { Level } from "../../../utils/level";
import { CanvasRadialGradientBackground } from '../../../canvas/canvasRadialGradientBackground';
import { Snake } from '../character/snake';
import { Random } from '../../../controllers/random';

export class DiscoLevel extends Level {
    public start = new Vector2(300, 400);
    public background = new CanvasRadialGradientBackground({
        stops: [[0, 'purple'], [1, 'pink']],
    });
    public height = 1145;
    public width = 2000;

    build() {
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2) => {
            this.width = size.x;
            this.height = size.y;
        });
        this.addChild(this.background);

        this.addChild(new Snake({
            totals: 30,
            distance: 1,
            topRadius: 50,
            bottomRadius: 1,
            position: new Vector2(0 - 150, 200),
            controllers: [new Random(200, Vector2.left)]
        }));
        this.addChild(new Snake({
            totals: 50,
            distance: 4,
            position: new Vector2(0 - 150, 200),
            controllers: [new Random(200, Vector2.right)]
        }));
        this.addChild(new Snake({
            totals: 50,
            distance: 4,
            position: new Vector2(this.width + 150, 950),
            colors: 'green',
            controllers: [new Random(100, Vector2.left)]
        },));


        // this.addChild(new RandomSnake(new Vector2(0 - 150, 450), Vector2.right));
        // this.addChild(new RandomSnake(new Vector2(0-150,700), Vector2.right))
        // this.addChild(new RandomSnake(new Vector2(0-150,950), Vector2.right))
        // this.addChild(new RandomSnake(new Vector2(this.width + 150, 200), Vector2.left));
        // this.addChild(new RandomSnake(new Vector2(this.width + 150, 450), Vector2.left));
        // this.addChild(new RandomSnake(new Vector2(this.width+150,700), Vector2.left))
    }

}