import { Vector3, v3 } from '../../../classes/math/vector3';
import { GLobj } from '../../../classes/objects/obj';

export type TreeBaseAttributes = {
    name: string,
    position?: Vector3,
    rotation?: Vector3,
    scale?: number,
};
export abstract class TreeBase extends GLobj {
    constructor(attr: TreeBaseAttributes) {
        super({
            url: `treeModels/${attr.name}.obj`,
            rotation: attr.rotation || v3(),
            size: v3(70, 70, 70).scale(attr.scale||1) ,
            position: attr.position || v3()
        });
    }
}
export type TreeAttributes = {
    position?: Vector3,
    rotation?: Vector3,
    scale?: number,
};
