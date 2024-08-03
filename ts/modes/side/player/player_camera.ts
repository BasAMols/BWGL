import { Character } from '../../../classes/character';
import { GlController, GlControllerOrder } from '../../../classes/controller';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { GlElementType } from '../../../classes/rendering/glRenderer';
import { TickerReturnData } from '../../../classes/ticker';
import { Util } from '../../../classes/util/utils';
import { glob } from '../../../game';
import { Player } from './player_actor';


export class FreeCamera extends GlController {
    public type: GlElementType = 'controller';
    public order: GlControllerOrder = 'after';
    public lagList: Vector3[] = [];
    private lagCount: number = 1;
    public parent: Player;
    zoom: number = 0;
    public get active(): boolean {
        return super.active;
    }
    public set active(value: boolean) {
        super.active = value;
        if (value) {
            this.camera.offset = v3(0, -15, this.zoom);
            this.camera.rotation = v3(0.3, Math.PI / 8, 0);
            this.camera.fov = 60;
        }
    }

    constructor(public target: Character) {
        super({ autoReady: false });
        this.camera.offset = v3(0, -15, this.zoom);
        this.camera.rotation = v3(0.3, Math.PI / 8, 0);
        this.camera.fov = 60;
    }

    public tick(o: TickerReturnData) {
        super.tick(o);

        if (glob.device.locked) {
            //camera rotation
            const r = this.axis('camera').scale(0.005);
            this.camera.rotation = v3(
                Util.clamp(this.camera.rotation.x + r.y, -1, Math.PI / 2),
                this.camera.rotation.y + r.x,
                this.camera.rotation.z
            );

            //zoom
            this.zoom = Util.clamp(this.zoom + (this.button('zoom') * 0.1), 30, 300);

            //aim
            this.camera.offset = this.button('aim') ? v3(-15, -10, 30) : v3(0, -15, this.zoom);

            //follow player
            const nP = this.target.position.add(this.target.size.multiply(0.5, 0.3, 0.5));
            this.camera.target = nP;

        }

    }
}