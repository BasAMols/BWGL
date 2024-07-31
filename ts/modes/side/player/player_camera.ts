import { Character } from '../../../classes/character';
import { GlController, GlControllerOrder } from '../../../classes/controller';
import { v2, Vector2 } from '../../../classes/math/vector2';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { GlElementType } from '../../../classes/rendering/glRenderer';
import { TickerReturnData } from '../../../classes/ticker';
import { Util } from '../../../classes/util/utils';
import { Player } from './player_actor';


export class FreeCamera extends GlController {
    public type: GlElementType = 'controller';
    public order: GlControllerOrder = 'after';
    public lagList: Vector3[] = [];
    private lagCount: number = 1;
    public parent: Player;
    public get active(): boolean {
        return super.active;
    }
    public set active(value: boolean) {
        super.active = value;
        if (value) {
            this.camera.offset = v3(0, -15, 60);
            this.camera.rotation = v3(0.3, Math.PI / 8, 0);
            this.camera.fov = 60;
        }
    }

    constructor(public target: Character) {
        super({ autoReady: false });
    }

    mouseMove(e: MouseEvent): void {
        const r = v2(e.movementX, e.movementY).scale(0.005);
        this.camera.rotation = v3(
            Util.clamp(this.camera.rotation.x + r.y, -1, Math.PI / 2),
            this.camera.rotation.y + r.x,
            this.camera.rotation.z
        );
    }

    drag(d: Vector2): void {
        const r = d.scale(0.01);
        this.camera.rotation = v3(
            Util.clamp(this.camera.rotation.x + r.y, -1, Math.PI / 2),
            this.camera.rotation.y + r.x,
            this.camera.rotation.z
        );
    }

    scroll(e: WheelEvent): void {
        if (!this.parent.aiming) {
            this.camera.offset.z = Util.clamp(this.camera.offset.z + e.deltaY * 0.1, 10, 300);

        }
    }

    public build(): void {
        super.build();
        this.active = true;
    }


    keyUp(e: KeyboardEvent): void {
        if (e.key === 'e' || e.key === 'E') {
            this.camera.offset = v3(0, -15, 60);
        }
    }

    keyDown(e: KeyboardEvent): void {
        if (e.key === 'e' || e.key === 'E') {
            this.camera.offset = v3(-15, -10, 30);
        }
    }

    public tick(o: TickerReturnData) {
        super.tick(o);
        const nP = this.target.position.add(this.target.size.multiply(0.5, 0.3, 0.5));
        while (this.lagList.length < this.lagCount) {
            this.lagList.push(nP);
        }
        this.camera.target = this.lagList.shift();
    }
}