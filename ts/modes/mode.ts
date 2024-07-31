import { Mode } from '../gl/mode';
import { World } from './side/level';

export class OpenWorldMode extends Mode{
    build(){
        super.build();
        this.addLevel('openWorld', new World());
        this.switchLevel('openWorld');
    }
}