import { TreeBase, TreeAttributes } from './treeBase';

export class Tree5 extends TreeBase {
    constructor(attr: TreeAttributes) {
        super({
            name: 'tree0_5',
            position: attr.position,
            rotation: attr.rotation,
            scale: attr.scale,
        });
    }
}
