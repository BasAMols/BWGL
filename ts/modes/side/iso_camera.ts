import { TickerReturnData } from '../../utils/ticker';
import { Character } from '../../gl/character';
import { GlElementType } from '../../gl/glRenderer';
import { Vector3, v3 } from '../../utils/vector3';
import { GlController, GlControllerOrder } from '../../gl/controller';
import { Util } from '../../utils/utils';

export class ISOCamera extends GlController {
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
            this.camera.offset = v3(0, -15, 1560);
            this.camera.rotation = v3(Math.PI/8, Math.PI/4, 0);
            this.camera.fov = 10;
        }
    }

    constructor(public target: Character){
        super({autoReady: false});
    }

    scroll(e: WheelEvent): void {
        this.camera.offset.z = Util.clamp(this.camera.offset.z + e.deltaY * 0.5, 1000, 5000);
    }

    public build(): void {
        super.build();
        this.active = true;
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