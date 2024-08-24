import { Mode } from '../../classes/mode';
import { TestLevel } from './level';

export class TestMode extends Mode{
    build(){
        super.build();
        this.addLevel('test', new TestLevel());
        this.switchLevel('test');
    }
}