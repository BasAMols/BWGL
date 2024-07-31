import { TreeBase, TreeAttributes } from './treeBase';

export class Tree6 extends TreeBase {
    constructor(attr: TreeAttributes) {
        super({
            name: 'tree0_6',
            storage: attr.storage,
            position: attr.position,
            rotation: attr.rotation,
            scale: attr.scale,
        });
    }
}
