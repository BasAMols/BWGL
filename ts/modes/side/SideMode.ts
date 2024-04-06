import { Mode } from '../../utils/mode';
import { World } from './levels/world';

export class SideMode extends Mode{
    public constructor() {
        super({hasDom: true});
    }

    build(){
        super.build();
        // this.addChild(new CanvasColorBackground('#272727'))
        this.addLevel('platform', new World());
        this.switchLevel('platform');
    }
}