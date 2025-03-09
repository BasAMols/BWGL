import { Mode } from '../../classes/mode';
import { TopLevel } from './level';

export class TopMode extends Mode{
    build(){
        super.build();
        this.addLevel('level', new TopLevel());
        this.switchLevel('level');
    }
}