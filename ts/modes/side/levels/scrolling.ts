import { CanvasImage } from '../../../canvas/canvasImage';
import { CanvasSquare } from '../../../canvas/canvasSquare';
import { CanvasWrapper } from '../../../canvas/canvasWrapper';
import { PrepImage } from '../../../canvas/prepImage';
import { TickerReturnData } from '../../../utils/ticker';
import { Vector2 } from '../../../utils/vector2';

export class Scroller extends CanvasWrapper {
    public speed: number = 6
    private layers: [CanvasImage, number, number][] = []


    add(layer: CanvasImage, width: number, paralax: number) {
        this.layers.push([layer, width, paralax]);
        this.addChild(layer);
    }

    build() {
        this.size = this.parent.size

        this.addChild(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/sky.png', 
                factor: 5,
            }, this.game),
            paralax: -1,
            position: new Vector2(800,100),
        }));

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/far-clouds.png', 
                factor: 3,
            }, this.game),
            position: new Vector2(0,400),
            paralax: -0.98,
            repeatX:16,
            opacity: 0.4,
        }), 128*3, 0.05);
        
        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/near-clouds.png', 
                factor: 3,
            }, this.game),
            position: new Vector2(0,400),
            paralax: -0.96,
            repeatX: 16,
            opacity: 0.3,
        }), 144*3, 0.10);

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/far-mountains.png', 
                factor: 3,
            }, this.game),
            position: new Vector2(0,350),
            paralax: -0.94,
            repeatX: 16,
        }), 160*3, 0.15);


        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/mountains.png', 
                factor: 4,
            }, this.game),
            position: new Vector2(0,250),
            paralax: -0.92,
            repeatX: 16,
        }), 320*4, 0.17);
        
        this.addChild(new CanvasSquare({
            color: '#2C2546',
            size: new Vector2(this.width, 500),
        }));

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/trees.png', 
                factor:2,
            }, this.game),
            position: new Vector2(0,500),
            paralax: -0.7,
            repeatX: 16,
        }), 240*2, 0.6);

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/trees.png', 
                factor:3,
            }, this.game),
            position: new Vector2(0,350),
            paralax: -0.65,
            repeatX: 16,
        }), 240*3, 0.8);

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/trees.png', 
                factor:5,
            }, this.game),
            position: new Vector2(0,-50),
            paralax: -.6,
            repeatX: 16,
        }), 240*5, 0.9);

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/train/railtrack_v1.png', 
                factor: 6
            }, this.game),
            repeatX: Math.ceil(this.level.width / 64*6 + 1),
        }), 64*6, 1);

    }
    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        this.layers.forEach(([layer, width, paralax]) => {
            layer.x = (layer.x - (this.speed* paralax)) % width;
        });
    }
}