import { GLGroup } from '../../gl/group';
import { GlImage } from '../../gl/imagePlane';
import { v3 } from '../../utils/vector3';

export class Scroller extends GLGroup {
    build() {
        // this.addChild(new GlImage({
        //     url: 'img/dusk/sky.png',
        //     position3: v3(-2500,-1000,4000),
        //     size3: v3(200,128,0).scale(30),
        // }));
        for (let index = 0; index < 10; index++) {
            this.addChild(new GlImage({
                url: 'img/dusk/far-clouds.png',
                position: v3(-4000 + (128*10)*index,-200,3500),
                size: v3(128,240,0).scale(10),
            }));
        }
        for (let index = 0; index < 10; index++) {
            this.addChild(new GlImage({
                url: 'img/dusk/near-clouds.png',
                position: v3(-4000 + (144*10)*index,-300,3200),
                size: v3(144,240,0).scale(10),
            }));
        }
        for (let index = 0; index < 10; index++) {
            this.addChild(new GlImage({
                url: 'img/dusk/mountains.png',
                position: v3(-3500 + (320*8)*index,-500,2500),
                size: v3(320,240,0).scale(8),
            }));
        }
        for (let index = 0; index < 8; index++) {
            this.addChild(new GlImage({
                url: 'img/dusk/far-mountains.png',
                position: v3(-4000 + (160*10)*index,-700,2000),
                size: v3(160,240,0).scale(10),
            }));
        }
        for (let index = 0; index < 3; index++) {
            this.addChild(new GlImage({
                url: 'img/dusk/mountains.png',
                position: v3(-4000 + (320*6)*index,-300,1500),
                size: v3(320,240,0).scale(6),
            }));
        }
        for (let index = 0; index < 13; index++) {
            this.addChild(new GlImage({
                url: 'img/dusk/trees.png',
                position: v3(-4000 + (240*3)*index,-100,1000),
                size: v3(240,240,0).scale(3),
            }));
        }
        for (let index = 0; index < 20; index++) {
            this.addChild(new GlImage({
                url: 'img/dusk/trees.png',
                position: v3(-4000 + (240*2)*index,-100,600),
                size: v3(240,240,0).scale(2),
            }));
            this.addChild(new GlImage({
                url: 'img/dusk/trees.png',
                position: v3(-4000+120 + (240*2)*index,-100,500),
                size: v3(240,240,0).scale(2),
            }));
        }
        for (let index = 0; index < 40; index++) {
            this.addChild(new GlImage({
                url: 'img/dusk/trees.png',
                position: v3(-4000+120 + (240)*index,-50,420),
                size: v3(240,240,0)
            }));
            this.addChild(new GlImage({
                url: 'img/dusk/trees.png',
                position: v3(-4000 + (240)*index,0,410),
                size: v3(240,240,0)
            }));
        }


        // this.add(new CanvasImage({
        //     image: new PrepImage({ 
        //         url: '/img/dusk/far-clouds.png', 
        //         factor: 3,
        //     }, this.game),
        //     position: new Vector2(0,400),
        //     worldSpaceParalaxX: -0.98,
        //     repeatX:16,
        //     opacity: 0.4,
        // }), 128*3, 0.05);
        
        // this.add(new CanvasImage({
        //     image: new PrepImage({ 
        //         url: '/img/dusk/near-clouds.png', 
        //         factor: 3,
        //     }, this.game),
        //     position: new Vector2(0,400),
        //     worldSpaceParalaxX: -0.96,
        //     repeatX: 16,
        //     opacity: 0.3,
        // }), 144*3, 0.10);

        // this.add(new CanvasImage({
        //     image: new PrepImage({ 
        //         url: '/img/dusk/far-mountains.png', 
        //         factor: 3,
        //     }, this.game),
        //     position: new Vector2(0,350),
        //     worldSpaceParalaxX: -0.94,
        //     repeatX: 16,
        // }), 160*3, 0.15);


        // this.add(new CanvasImage({
        //     image: new PrepImage({ 
        //         url: '/img/dusk/mountains.png', 
        //         factor: 4,
        //     }, this.game),
        //     position: new Vector2(0,250),
        //     worldSpaceParalaxX: -0.92,
        //     repeatX: 16,
        // }), 320*4, 0.17);
        
        // this.addChild(new CanvasSquare({
        //     color: '#2C2546',
        //     size: new Vector2(this.width, 500),
        // }));

        // this.add(new CanvasImage({
        //     image: new PrepImage({ 
        //         url: '/img/dusk/trees.png', 
        //         factor:2,
        //     }, this.game),
        //     position: new Vector2(0,500),
        //     worldSpaceParalaxX: -0.5,

        //     repeatX: 16,
        // }), 240*2, 0.6);

        // this.add(new CanvasImage({
        //     image: new PrepImage({ 
        //         url: '/img/dusk/trees.png', 
        //         factor:3,
        //     }, this.game),
        //     position: new Vector2(0,320),
        //     worldSpaceParalaxX: -0.38,
        //     repeatX: 16,
        // }), 240*3, 0.8);

        // this.add(new CanvasImage({
        //     image: new PrepImage({ 
        //         url: '/img/dusk/trees.png', 
        //         factor:7,
        //     }, this.game),
        //     position: new Vector2(0,-100),
        //     worldSpaceParalaxX: -.26,
        //     repeatX: 16,
        // }), 240*7, 0.95);

        // this.add(new CanvasImage({
        //     image: new PrepImage({ 
        //         url: '/img/train/railtrack_v1.png', 
        //         factor: 7
        //     }, this.game),
        //     position: new Vector2(0,40),
        //     repeatX: Math.ceil(this.level.width / 64*7 + 1),
        // }), 64*7, 1);

        // this.add(new CanvasImage({
        //     image: new PrepImage({ 
        //         url: '/img/train/railtrack_v1.png', 
        //         factor: 7
        //     }, this.game),
        //     position: new Vector2(0,0),
        //     repeatX: Math.ceil(this.level.width / 64*7 + 1),
        //     worldSpaceParalaxX: 0.06,
        // }), 64*7, 1);

    }
    // public tick(obj: TickerReturnData): void {
    //     super.tick(obj);
    //     this.layers.forEach(([layer, width, paralax]) => {
    //         layer.x = (layer.x - (this.level.speed*10 * paralax)) % width ;
    //     });
    // }
}