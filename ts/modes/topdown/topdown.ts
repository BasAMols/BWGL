import { Mode } from '../../utils/mode';
import { TickerReturnData } from '../../utils/ticker';
import { Overworld as Overworld } from './overworld';

export class Topdown extends Mode{
    public constructor() {
        super({hasDom: true});
    }

    build(){
        this.addLevel('overworld', new Overworld());
        this.switchLevel('overworld');
    }
    
    tick(obj: TickerReturnData): void {
        super.tick(obj);
    }
}