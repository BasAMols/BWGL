import { CanvasColorBackground } from '../../canvas/canvasBackground';
import { Mode } from '../../utils/mode';
import { TickerReturnData } from '../../utils/ticker';
import { OverworldLevel as OverworldLevel } from './levels/overworldLevel';

export class RPGMode extends Mode{
    public constructor() {
        super({hasDom: true});
    }

    build(){
        super.build();
        this.addChild(new CanvasColorBackground('#272727'))
        this.addLevel('overworld', new OverworldLevel());
        this.switchLevel('overworld');
    }

}