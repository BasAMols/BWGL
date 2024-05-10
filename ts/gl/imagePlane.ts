import { Vector2 } from '../utils/vector2';
import { v3 } from '../utils/vector3';
import { GLCuboid, GlCuboidAttributes } from './cuboid';
import { GLTexture } from './texture';

export type CanvasImageAttributes = GlCuboidAttributes & {
    textureUrl: string,
    // condition?: (position: Vector2, size: Vector2) => void,
    // screenSpaceParalaxX?: number,
    // screenSpaceParalaxY?: number,
    repeatX?: number,
    repeatY?: number,
    // repeatGapX?: number,
    // repeatGapY?: number,
    // renderOffsetX?: number,
    // renderOffsetY?: number,
    // opacity?: number,
    // shadow?: [string, number, number, number],
};
export class GlImage extends GLCuboid {
    public condition: (position: Vector2, size: Vector2) => void;
    public repeatX: number;
    public repeatY: number;
    public repeatGapX: number;
    public repeatGapY: number;
    public opacity: number;
    public shadow: [string, number, number, number];
    public screenSpaceParalaxX: number;
    public screenSpaceParalaxY: number;
    renderOffsetX: number;
    renderOffsetY: number;

    constructor(attr: CanvasImageAttributes) {
        super({
            ...attr,
            size: attr.size.multiply(v3(attr.repeatX || 1, attr.repeatY || 1, 1)),
        });

        // this.condition = attr.condition;
        // this.screenSpaceParalaxX = attr.screenSpaceParalaxX || 0;
        // this.screenSpaceParalaxY = attr.screenSpaceParalaxY || 0;
        this.repeatX = attr.repeatX || 1;
        this.repeatY = attr.repeatY || 1;
        // this.repeatGapX = attr.repeatGapX || 0;
        // this.repeatGapY = attr.repeatGapY || 0;
        // this.renderOffsetX = attr.renderOffsetX || 0;
        // this.renderOffsetY = attr.renderOffsetY || 0;
        // this.opacity = attr.opacity || 1;
        // this.shadow = attr.shadow;
    }

    public build(): void {
        super.build();
        if (this.repeatX !== 1 || this.repeatY !== 1) {

            const img = new Image();
            img.src = `${window.location.href}${this.textureUrl}`;
            img.onload = () => {

                const repeater = document.createElement('canvas');
                repeater.width = img.width * this.repeatX;
                repeater.height = img.height * this.repeatY;
                const repeaterContext = repeater.getContext('2d');

                for (let x = 0; x < this.repeatX; x++) {
                    for (let y = 0; y < 1; y++) {
                        repeaterContext.drawImage(
                            img,
                            x * img.width,
                            y * img.height,
                            img.width,
                            img.height
                        );
                    }
                }
                this.texture = new GLTexture(this.game, { image: repeater });

            };

        }

    }

    // public render(ctx: CanvasRenderingContext2D) {        
    //     if (this.prepped.ready && (!this.condition || this.condition(this.position.add(this.parent.position), this.prepped.size))) {            
    //         for (let i = 0; i < this.repeatX; i++) {
    //             for (let j = 0; j < this.repeatY; j++) {
    //                 if (this.opacity !== 1){
    //                     ctx.globalAlpha = this.opacity;
    //                 }
    //                 if (this.shadow){
    //                     ctx.shadowColor = this.shadow[0];
    //                     ctx.shadowOffsetX = this.shadow[1];
    //                     ctx.shadowOffsetY = this.shadow[2];
    //                     ctx.shadowBlur = this.shadow[3];
    //                 }

    //                 ctx.drawImage(
    //                     this.prepped.image,
    //                     this.x + (this.worldSpaceParalaxX * this.level.x) + ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x)) * this.screenSpaceParalaxX + (i * this.prepped.width)+ (i * this.repeatGapX)+this.renderOffsetX,
    //                     this.y + (j * this.prepped.height)+ (j * this.repeatGapY)+this.renderOffsetY,
    //                     this.prepped.width,
    //                     this.prepped.height,
    //                 );
    //             }
    //         }     
    //     }
    //     // this.level.x + this.x + (this.prepped.width/2); // center of image
    //     // this.level.x + this.x + (this.prepped.width/2);
    // }
}
