import { Mode } from '../../utils/mode';
import { World } from './world';

export class OpenWorldMode extends Mode{
    build(){
        super.build();
        this.addLevel('openWorld', new World());
        this.switchLevel('openWorld');
    }
}