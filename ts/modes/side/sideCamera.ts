import { TickerReturnData } from '../../utils/ticker';
import { Character } from '../../gl/character';
import { GlElementType } from '../../gl/glr';
import { v3 } from '../../utils/vector3';
import { GlController } from '../../gl/controller';

export class SideCamera extends GlController {
    public type: GlElementType = 'controller';

    public get active(): boolean {
        return super.active;
    }
    public set active(value: boolean) {
        super.active = value;
        if (value) {
            this.camera.target = v3(0, -75, 170);
            this.camera.offset = v3(0);
            this.camera.rotation = v3(0.15, 0, 0);
            this.camera.fov = 70;
        }
    }


    constructor(public target: Character) {
        super({ autoReady: false });
    }

    // mouseMove(e: MouseEvent): void {
    //     const r = v2(e.movementX, e.movementY).scale(0.005);
    //     this.camera.rotation = v3(
    //         Util.clamp(this.camera.rotation.x + r.y, -0.1, Math.PI / 2),
    //         this.camera.rotation.y + r.x,
    //         this.camera.rotation.z
    //     );

    // }

    // scroll(e: WheelEvent): void {
    //     this.camera.offset.z = Util.clamp(this.camera.offset.z + e.deltaY * 0.1, 10, 300);
    // }

    public tick(o: TickerReturnData) {
        super.tick(o);
        this.camera.target = v3(
            this.target.position.x + (this.target.size.x / 2),
            this.camera.target.y,
            this.camera.target.z
        );
    }
}