import { GLGroup } from '../../gl/group';
import { GlImage } from '../../gl/imagePlane';
import { v3 } from '../../utils/vector3';

export class Scroller extends GLGroup {
    build() {
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/far-clouds.png',
            position: v3(-4000, -200, 3500),
            size: v3(128, 240, 0).scale(10),
            opacity: 0.4, 
            repeatX: 10
        }));
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/far-clouds.png',
            position: v3(-4000, -200, 3500),
            repeatX: 10,
            opacity: 0.4, 
            size: v3(128, 240, 0).scale(10),
        }));
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/near-clouds.png',
            position: v3(-4000, -300, 3200),
            repeatX: 10,opacity: 0.4, 
            size: v3(144, 240, 0).scale(10),
        }));
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/mountains.png',
            position: v3(-3500, -500, 2500),
            repeatX: 10,
            size: v3(320, 240, 0).scale(8),
        }));
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/far-mountains.png',
            position: v3(-4000, -700, 2000),
            repeatX: 10,
            size: v3(160, 240, 0).scale(10),
        }));
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/near-clouds.png',
            position: v3(-2000, -300, 1750),
            repeatX: 20,
            opacity: 0.5,
            size: v3(144, 240, 0).scale(6),
        }));
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/mountains.png',
            position: v3(-4000, -300, 1500),
            repeatX: 4,
            size: v3(320, 240, 0).scale(6),
        }));
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/trees.png',
            position: v3(-2000, -100, 720),
            repeatX: 20,
            size: v3(240, 240, 0).scale(3),
        }));
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/trees.png',
            position: v3(-2000, 0, 650),
            repeatX: 20,
            size: v3(240, 240, 0).scale(2),
        }));
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/trees.png',
            position: v3(-2000, 0, 570),
            repeatX: 20,
            size: v3(240, 240, 0).scale(1.5),
        }));
        this.addChild(new GlImage({
            textureUrl: 'img/dusk/trees.png',
            position: v3(-2000, 0, 490),
            repeatX: 20,
            size: v3(240, 240, 0)
        }));
    }
}