import { TreeBase, TreeAttributes } from './treeBase';

export class Tree4 extends TreeBase {
    constructor(attr: TreeAttributes) {
        super({
            name: 'tree0_4',
            storage: attr.storage,
            position: attr.position,
            rotation: attr.rotation,
            scale: attr.scale,
        });
    }
}
