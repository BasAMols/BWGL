import { TickerReturnData } from '../../utils/ticker';
import { Util } from '../../utils/utils';
import { MovementController } from './movementController';

export class SideController extends MovementController {
    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.parent.position.x = Util.clamp(this.parent.position.x, -600, 1000);
        this.parent.position.z = Util.clamp(this.parent.position.z, 260, 340);
    }
}