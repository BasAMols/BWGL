import { TickerReturnData } from '../../utils/ticker';
import { Character } from '../../gl/character';
import { GlElementType } from '../../gl/glRenderer';
import { Vector3, v3 } from '../../utils/vector3';
import { GlController, GlControllerOrder } from '../../gl/controller';
import { Util } from '../../utils/utils';
import { v2 } from '../../utils/vector2';

export class CarCamera extends GlController {
    public type: GlElementType = 'controller';
    public order: GlControllerOrder = 'after';
    private lagList: Vector3[] = [];
    private lagCount: number = 8;
    public get active(): boolean {
        return super.active;
    }
    public set active(value: boolean) {
        super.active = value;
        if (value){
            this.camera.offset = v3(0, -15, 200);
            this.camera.rotation = v3(0.15, 0, 0);
            this.camera.fov = 70;
        }
    }

    constructor(public target: Character){
        super({autoReady: false});
    }

    mouseMove(e: MouseEvent): void {
        const r = v2(e.movementX, e.movementY).scale(0.005);
        this.camera.rotation = v3(
            Util.clamp(this.camera.rotation.x + r.y, -0.1, Math.PI / 2),
            this.camera.rotation.y + r.x,
            this.camera.rotation.z
        );
    }

    public build(): void {
    }

    scroll(e: WheelEvent): void {
        this.camera.offset.z = Util.clamp(this.camera.offset.z + e.deltaY * 0.1, 100, 200);
    }

    public tick(o: TickerReturnData) {
        super.tick(o);
        const nP = this.target.position.add(this.target.size.multiply(0.5,0.5,0.5)).multiply(1,-1,1);
        while (this.lagList.length < this.lagCount){
            this.lagList.push(nP);
        }
        this.camera.target = this.lagList.shift();
    }
}