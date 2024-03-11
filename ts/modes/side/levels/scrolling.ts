import { CanvasImage } from '../../../elements/canvasImage';
import { CanvasSquare } from '../../../elements/canvasSquare';
import { CanvasWrapper } from '../../../elements/canvasWrapper';
import { PrepImage } from '../../../elements/prepImage';
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
            worldSpaceParalaxX: -1,
            position: new Vector2(800,100),
        }));

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/far-clouds.png', 
                factor: 3,
            }, this.game),
            position: new Vector2(0,400),
            worldSpaceParalaxX: -0.98,
            repeatX:16,
            opacity: 0.4,
        }), 128*3, 0.05);
        
        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/near-clouds.png', 
                factor: 3,
            }, this.game),
            position: new Vector2(0,400),
            worldSpaceParalaxX: -0.96,
            repeatX: 16,
            opacity: 0.3,
        }), 144*3, 0.10);

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/far-mountains.png', 
                factor: 3,
            }, this.game),
            position: new Vector2(0,350),
            worldSpaceParalaxX: -0.94,
            repeatX: 16,
        }), 160*3, 0.15);


        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/mountains.png', 
                factor: 4,
            }, this.game),
            position: new Vector2(0,250),
            worldSpaceParalaxX: -0.92,
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
            worldSpaceParalaxX: -0.5,

            repeatX: 16,
        }), 240*2, 0.6);

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/trees.png', 
                factor:3,
            }, this.game),
            position: new Vector2(0,320),
            worldSpaceParalaxX: -0.38,
            repeatX: 16,
        }), 240*3, 0.8);

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/dusk/trees.png', 
                factor:7,
            }, this.game),
            position: new Vector2(0,-100),
            worldSpaceParalaxX: -.26,
            repeatX: 16,
        }), 240*7, 0.95);

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/train/railtrack_v1.png', 
                factor: 7
            }, this.game),
            position: new Vector2(0,40),
            repeatX: Math.ceil(this.level.width / 64*7 + 1),
        }), 64*7, 1);

        this.add(new CanvasImage({
            image: new PrepImage({ 
                url: '/img/train/railtrack_v1.png', 
                factor: 7
            }, this.game),
            position: new Vector2(0,0),
            repeatX: Math.ceil(this.level.width / 64*7 + 1),
        }), 64*7, 1);

    }
    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        this.layers.forEach(([layer, width, paralax]) => {
            layer.x = (layer.x - (this.speed* paralax)) % width ;
        });
    }
}