import { GlElement, GlElementAttributes } from '../gl/elementBase';
import { GLCuboid as GlCuboid } from '../gl/cuboid';
import { GLGroup } from '../gl/group';
import { Colors } from '../utils/colors';
import { v3 } from '../utils/vector3';
import { TickerReturnData } from '../utils/ticker';

export class TestObj extends GLGroup {
    r1: GlCuboid;
    r2: GlCuboid;
    final: GlElement;
    r3: GlCuboid;

    public constructor(attr: GlElementAttributes) {
        super(attr);
    }

    public build(): void {
        super.build();
        this.position = v3(0,20,480)
        this.final = new GlCuboid({ 
            position: v3(-1,-1,0),
            size: v3(0.1,0.1,0.1), 
            colors: [Colors.r]
        });
        this.addChild(this.final)

        this.final.addChild(new GlCuboid({ 
            position: v3(-5,-5,-5),
            size: v3(10,10,10), 
            colors: [Colors.r],
        }));

        this.r1 = new GlCuboid({ 
            size: v3(100,5,5), 
            colors: [Colors.b]
        });
        this.r2 = new GlCuboid({ 
            size: v3(5,5,5), 
            position: v3(100,-0,-0),
            colors: [Colors.b]
        });

        this.addChild(this.r1);
        this.r1.addChild(this.r2);

        // this.addChild(new GlCuboid({ 
        //     position: this.size.multiply(v3(0,-0.5,0)),
        //     size: this.size, 
        //     colors: [Colors.r]
        // }))
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        // this.r1.position = v3(Math.sin(obj.frame/200)*100, 0, 0)
        this.r1.rotation = this.r1.rotation.add(v3(0,0.005, 0.001));
        this.final.position = this.r2.globalPosition.subtract(this.globalPosition);
        // console.log(this.r2.worldPosition.array);
        
    }
}