import { Mode } from '../../classes/mode';
import { DeskLevel } from './level';

export class DeskWorld extends Mode{
    build(){
        super.build();
        this.addLevel('deskWorld', new DeskLevel());
        this.switchLevel('deskWorld');
    }
}