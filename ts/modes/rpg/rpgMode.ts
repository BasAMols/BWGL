import { Mode } from '../../utils/mode';
import { TickerReturnData } from '../../utils/ticker';
import { OverworldLevel as OverworldLevel } from './levels/overworldLevel';

export class RPGMode extends Mode{
    public constructor() {
        super({hasDom: true});
    }

    build(){
        this.addLevel('overworld', new OverworldLevel());
        this.switchLevel('overworld');
    }
    
    tick(obj: TickerReturnData): void {
        super.tick(obj);
    }
}