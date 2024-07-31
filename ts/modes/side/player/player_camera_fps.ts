import { Character } from '../../../classes/character';
import { GlController, GlControllerOrder } from '../../../classes/controller';
import { v2, Vector2 } from '../../../classes/math/vector2';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { GlElementType } from '../../../classes/rendering/glRenderer';
import { TickerReturnData } from '../../../classes/ticker';
import { Util } from '../../../classes/util/utils';


export class fpsCamera extends GlController {
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
            this.camera.offset = v3(0, 0, 0);
            this.camera.rotation = v3(0, 0, 0);
            this.camera.fov = 80;
        }
    }

    constructor(public target: Character){
        super({autoReady: false});
    }

    mouseMove(e: MouseEvent): void {
        const r = v2(e.movementX, e.movementY).scale(0.005);
        this.camera.rotation = v3(
            Util.clamp(this.camera.rotation.x + r.y, -Math.PI / 2, Math.PI / 5),
            this.camera.rotation.y + r.x,
            this.camera.rotation.z
        );
    }

    drag(d: Vector2): void {
        const r = d.scale(0.005);
        this.camera.rotation = v3(
            Util.clamp(this.camera.rotation.x + r.y, -0.1, Math.PI / 2),
            this.camera.rotation.y + r.x,
            this.camera.rotation.z
        );
    }

    public build(): void {
        super.build();
        this.active = true;
    }

    public tick(o: TickerReturnData) {
        super.tick(o);
        this.camera.target = this.target.position.add(this.target.size.multiply(0.5,0.9,0.5)).multiply(1,-1,1);
        // (this.target as Player).skeleton.head.position.y = -1000
    }
}