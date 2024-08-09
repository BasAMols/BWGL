import { Character } from '../../../classes/character';
import { GlController, GlControllerOrder } from '../../../classes/controller';
import { v3 } from '../../../classes/math/vector3';
import { GlElementType } from '../../../classes/rendering/glRenderer';
import { TickerReturnData } from '../../../classes/ticker';
import { glob } from '../../../game';
import { Player } from './player_actor';


export class FreeCamera extends GlController {
    public type: GlElementType = 'controller';
    public order: GlControllerOrder = 'after';
    public parent: Player;

    constructor(public target: Character) {
        super({ autoReady: false });
    }

    public build(): void {
        this.camera.target = v3(0, 100, -200);
        this.camera.offset = v3(0, 0, 250);
        this.camera.rotation = v3(0.01, 0, 0);
        this.camera.fov = 30;
    }

    public tick(o: TickerReturnData) {
        super.tick(o);

        if (glob.device.locked) {
            this.camera.target.x = this.target.position.x;
        }

    }
}