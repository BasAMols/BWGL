import { TickerReturnData } from '../../utils/ticker';
import { Character } from '../../gl/character';
import { GlElementType } from '../../gl/glRenderer';
import { Vector3, v3 } from '../../utils/vector3';
import { GlController, GlControllerOrder } from '../../gl/controller';
import { Util } from '../../utils/utils';
import { Vector2, v2 } from '../../utils/vector2';
import { Player } from './player_actor';

export class FreeCamera extends GlController {
    public type: GlElementType = 'controller';
    public order: GlControllerOrder = 'after';
    private lagList: Vector3[] = [];
    private lagCount: number = 8;
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
        const nP = this.target.position.add(this.target.size.multiply(0.5, 0.5, 0.5)).multiply(1, -1, 1);
        while (this.lagList.length < this.lagCount) {
            this.lagList.push(nP);
        }
        this.camera.target = this.lagList.shift();
    }
}