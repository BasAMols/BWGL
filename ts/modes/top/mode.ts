import { Mode } from '../../classes/mode';
import { DeskLevel } from './level';

export class TopMode extends Mode{
    build(){
        super.build();
        this.addLevel('level', new DeskLevel());
        this.switchLevel('level');
    }
}