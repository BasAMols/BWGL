import { TreeBase, TreeAttributes } from './treeBase';

export class Tree3 extends TreeBase {
    constructor(attr: TreeAttributes) {
        super({
            name: 'tree0_3',
            position: attr.position,
            rotation: attr.rotation,
            scale: attr.scale,
        });
    }
}
