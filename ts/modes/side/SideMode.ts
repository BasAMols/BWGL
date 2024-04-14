import { Mode } from '../../utils/mode';
import { World } from './world';

export class SideMode extends Mode{
    build(){
        super.build();
        this.addLevel('platform', new World());
        this.switchLevel('platform');
    }
}