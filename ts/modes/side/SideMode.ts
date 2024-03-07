import { CanvasColorBackground } from '../../canvas/canvasBackground';
import { Mode } from '../../utils/mode';
import { PlatformLevel } from './levels/platform';

export class SideMode extends Mode{
    public constructor() {
        super({hasDom: true});
    }

    build(){
        super.build();
        this.addChild(new CanvasColorBackground('#272727'))
        this.addLevel('platform', new PlatformLevel());
        this.switchLevel('platform');
    }

}