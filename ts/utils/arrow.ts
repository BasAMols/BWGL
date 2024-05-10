import { GlElement, GlElementAttributes } from '../gl/elementBase';
import { GLCuboid as GlCuboid, GlCuboidAttributes } from '../gl/cuboid';
import { Color, Colors } from './colors';
import { Vector3, v3 } from './vector3';
import { GLGroup } from '../gl/group';
import { GLPyramid } from '../gl/pyramid';


export type ArrowAttributes = GlElementAttributes & {
    length?: number,
    width?: number,
    direction?: Vector3,
    colors?: Color[],
};

export type ArrowType = 'static' | 'dynamic';

export class Arrow extends GLGroup {
    public direction: Vector3;
    public debugObject: GlElement;
    private width: number;
    private length: number;
    private colors: Color[];

    public constructor(attr: ArrowAttributes) {
        super(attr);
        this.direction = attr.direction = v3(1,0,0);
        this.width = attr.width || 2;
        this.length = attr.length || 4;
        this.colors = attr.colors || [Colors.r];
    }

    public build(): void {
        const s = new GlCuboid({ 
            position: v3(-this.width/4,0,-this.width/4),
            size: v3(this.width/2,this.length/2,this.width/2), 
            colors: this.colors as GlCuboidAttributes['colors'], 
        });
        this.addChild(s)

        const p = new GLPyramid({ 
            position: v3(-this.width/2,this.length/2,-this.width/2),
            size: v3(this.width,this.length/2,this.width), 
            colors: [Colors.r], 
        });
        this.addChild(p)
        
        
    }
}