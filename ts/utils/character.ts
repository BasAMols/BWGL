import { Collider, ColliderAttributes, ColliderType } from './collider';
import { ElementRelativity } from './elementPosition';

export type CharacterAttributes = ColliderAttributes & {
}

export abstract class Character extends Collider {
    public relativity: ElementRelativity = 'anchor';
    public colliderType: ColliderType = 'dynamic';
    public collider: Collider;

    constructor(attr: CharacterAttributes) {
        super(attr);
        this.position = attr.position;
        this.size = attr.size;
        this.collider = new Collider({
            size: this.size,
            cornerTolerance: 30,
        });
        this.colliderType = 'dynamic';
    }
}
