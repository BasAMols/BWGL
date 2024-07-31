import { Mode } from '../../gl/mode';
import { World } from './level';

export class OpenWorldMode extends Mode{
    build(){
        super.build();
        this.addLevel('openWorld', new World());
        this.switchLevel('openWorld');
    }
}