import { Mode } from '../../utils/mode';
import { World as TestWorld3D } from './levels/world';

export class Test extends Mode{
    public context: '2d' | '3d' = '3d';
    public constructor() {
        super({hasDom: true});
    }

    build(){
        super.build();
        // this.addChild(new CanvasColorBackground('#272727'))
        this.addLevel('platform', new TestWorld3D());
        this.switchLevel('platform');
    }
}