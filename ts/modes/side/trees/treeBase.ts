import { GLobj } from '../../../gl/obj';
import { ObjStorage } from '../../../gl/objStorage';
import { Vector3, v3 } from '../../../utils/vector3';

export type TreeBaseAttributes = {
    name: string,
    storage: ObjStorage,
    position?: Vector3,
    rotation?: Vector3,
    scale?: number,
};
export abstract class TreeBase extends GLobj {
    constructor(attr: TreeBaseAttributes) {
        super({
            storage: attr.storage,
            url: `treeModels/${attr.name}.obj`,
            rotation: attr.rotation || v3(),
            size: v3(70, 70, 70).scale(attr.scale||1) ,
            position: attr.position || v3()
        });
    }
}
export type TreeAttributes = {
    storage: ObjStorage,
    position?: Vector3,
    rotation?: Vector3,
    scale?: number,
};
