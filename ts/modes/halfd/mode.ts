import { Mode } from '../../classes/mode';
import { HalfDimensionWorld } from './level';

export class HalfDimensionMode extends Mode{
    build(){
        super.build();
        this.addLevel('openWorld', new HalfDimensionWorld());
        this.switchLevel('openWorld');
    }
}