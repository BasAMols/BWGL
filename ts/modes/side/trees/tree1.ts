import { TreeBase, TreeAttributes } from './treeBase';

export class Tree1 extends TreeBase {
    constructor(attr: TreeAttributes) {
        super({
            name: 'tree0_1',
            position: attr.position,
            rotation: attr.rotation,
            scale: attr.scale*0.7,
        });
    }
}
