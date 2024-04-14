import { GlElement, GlElementAttributes } from './elementBase';
import { GlElementType } from './glr';

export type CharacterAttributes = GlElementAttributes & {
}

export abstract class Character extends GlElement {
    public type: GlElementType = 'group';
    constructor(attr: CharacterAttributes) {
        super(attr);
    }
}
