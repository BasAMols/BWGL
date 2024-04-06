import { CanvasImage } from '../../../elements/canvas/canvasImage';
import { CanvasWrapper } from '../../../elements/canvas/canvasWrapper';
import { PrepImage } from '../../../elements/prepImage';
import { Vector2 } from '../../../utils/vector2';
import { Train } from './train';
import { World } from './world';

export class Station extends CanvasWrapper {
    public level: World;
    private layers: [CanvasWrapper, CanvasImage, number, number, number][] = [];

    constructor(public train: Train, public backgroundLayer: CanvasWrapper, public foregroundLayer: CanvasWrapper, ) {
        super();
    }

    add(parent: CanvasWrapper, layer: CanvasImage, width: number, paralax: number, offset?: number) {
        this.layers.push([parent, layer, width, paralax, offset]);
        parent.addChild(layer);
    }

    build() {
        this.size = this.parent.size;


        this.add(this.backgroundLayer, new CanvasImage({
            image: new PrepImage({ 
                url: '/img/station/houses.png', 
                factor: 4
            }, this.game),
            position: new Vector2(0,66+30),
            worldSpaceParalaxX: -0.03,
            repeatX: 3,
            zoom: new Vector2(-1/1.12,1/1.12),
        }), 688*3, 1);

        this.add(this.backgroundLayer, new CanvasImage({
            image: new PrepImage({
                url: '/img/station/ground.png',
                factor: 4
            }, this.game),
            position: new Vector2(0, 0+30),
            repeatX: 80,
            repeatGapX: 16 * 3,
            worldSpaceParalaxX: -0.03,
        }), 16 * 3*2, 1);
        
        this.add(this.backgroundLayer, new CanvasImage({
            image: new PrepImage({
                url: '/img/station/ground-b.png',
                factor: 4
            }, this.game),
            position: new Vector2(0, 0+30),
            repeatX: 80,
            repeatGapX: 16 * 3,
            renderOffsetX: 16 * 3,
            worldSpaceParalaxX: -0.03,
        }), 16 * 3*2, 1);


        this.add(this.foregroundLayer, new CanvasImage({
            image: new PrepImage({
                url: '/img/station/ground.png',
                factor: 4
            }, this.game),
            position: new Vector2(0, -64),
            repeatX: 82,
            repeatGapX: 16 * 3,
            worldSpaceParalaxX: 0.06,
        }), 16 * 3*2, 1);
        
        this.add(this.foregroundLayer, new CanvasImage({
            image: new PrepImage({
                url: '/img/station/ground-b.png',
                factor: 4
            }, this.game),
            position: new Vector2(0, -64),
            repeatX: 82,
            repeatGapX: 16 * 3,
            renderOffsetX: 16 * 3,
            worldSpaceParalaxX: 0.06,
        }), 16 * 3*2, 1);


    }
}