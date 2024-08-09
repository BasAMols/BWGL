import { TreeBase, TreeAttributes } from './treeBase';

export class Tree2 extends TreeBase {
    constructor(attr: TreeAttributes) {
        super({
            name: 'tree0_2',
            position: attr.position,
            rotation: attr.rotation,
            scale: attr.scale,
        });
    }
}
