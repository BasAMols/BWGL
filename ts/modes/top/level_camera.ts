import { GlController, GlControllerOrder } from '../../classes/controller';
import { v3 } from '../../classes/math/vector3';
import { GlElementType } from '../../classes/rendering/glRenderer';
import { TickerReturnData } from '../../classes/ticker';
import { Util } from '../../classes/util/utils';
import { glob } from '../../game';
import { TopLevel } from './level';


export class fixedCamera extends GlController {
    public type: GlElementType = 'controller';
    public order: GlControllerOrder = 'after';
    public get active(): boolean {
        return super.active;
    }
    public set active(value: boolean) {
        super.active = value;
        if (value) {
            this.camera.offset = v3(0, 0, 0);
            this.camera.rotation = v3(0, Math.PI, 0);
            this.camera.fov = 60;
        }
    }

    public build(): void {
        this.camera.offset = v3(0, 0, 0);
        this.camera.rotation = v3(Math.PI/2, 0, 0);
        this.camera.fov = 90;
        this.camera.target = v3(0, 40, 0);
    }

    public tick(o: TickerReturnData) {
        super.tick(o);

        if (glob.device.locked) {

            const z = Util.clamp(this.camera.fov + this.button('zoom') * 0.05, 5, 120);
            this.camera.fov = z;
            
            const r = this.axis('camera').scale(0.005).scale(z / 60);
            this.camera.rotation = v3(
                Util.clamp(this.camera.rotation.x + r.y, -1, Math.PI / 2),
                this.camera.rotation.y + r.x,
                this.camera.rotation.z
            );
            this.camera.target = (this.level as TopLevel).character.position.add(v3(0, 0, 10));
            const t = this.axis('movement').scale(0.1);
            const m = t.rotate(-this.camera.rotation.yaw);

        } else {

        }

    }
}