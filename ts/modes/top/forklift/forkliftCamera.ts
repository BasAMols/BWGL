import { GlController, GlControllerOrder } from '../../../classes/controller';
import { v3 } from '../../../classes/math/vector3';
import { GlElementType } from '../../../classes/rendering/glRenderer';
import { TickerReturnData } from '../../../classes/ticker';
import { Util } from '../../../classes/util/utils';
import { glob } from '../../../game';
import { TopLevel } from '../level';
import { Forklift } from './forklift_actor';

export class ForkliftCamera extends GlController {
    public type: GlElementType = 'controller';
    public order: GlControllerOrder = 'after';
    public get active(): boolean {
        return super.active;
    }
    public set active(value: boolean) {
        super.active = value;
        if (value){
            this.camera.offset = v3(0, 0, 20);
            this.camera.rotation = v3(0.5, 0, 0);
            this.camera.fov = 80;

            const z = Util.clamp(this.camera.fov + this.button('zoom') * 0.05, 30, 120);
            this.camera.fov = z;
            
            const r = this.axis('camera').scale(0.005).scale(1);
            this.camera.rotation = v3(
                Util.clamp(this.camera.rotation.x + r.y, -1, Math.PI / 2),
                this.camera.rotation.y + r.x,
                this.camera.rotation.z
            );

            const p = (this.level as TopLevel).player
            this.camera.target = p.position.add(v3(p.anchorPoint.x, 10, p.anchorPoint.z), v3(0, 10, 0));
        }
    }

    constructor(public target: Forklift){
        super({autoReady: false});
    }

    public build(): void {
        super.build();
        this.active = true;
    }


    public tick(o: TickerReturnData) {
        super.tick(o);

        if (glob.device.locked) {

            const z = Util.clamp(this.camera.offset.z + this.button('zoom') * 0.05, 10, 120);
            this.camera.offset.z = z;
            
            const r = this.axis('camera').scale(0.005).scale(1);
            this.camera.rotation = v3(
                Util.clamp(this.camera.rotation.x + r.y, -1, Math.PI / 2),
                this.camera.rotation.y + r.x,
                this.camera.rotation.z
            );
        }
        
        const p = (this.level as TopLevel).forklift
        this.camera.target = p.position.add(v3(p.anchorPoint.x, 10, p.anchorPoint.z), v3(0, 10, 0));

    }
}