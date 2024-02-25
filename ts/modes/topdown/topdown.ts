import { Mode } from '../../utils/mode';
import { Overworld as Overworld } from './overworld';

export class Topdown extends Mode{
    public constructor() {
        super({hasDom: true});
    }

    build(){
        this.addLevel('overworld', new Overworld());
        this.switchLevel('overworld');
    }
}