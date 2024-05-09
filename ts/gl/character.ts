import { GlElement, GlElementAttributes } from './elementBase';
import { GlElementType } from './glRenderer';

export type CharacterAttributes = GlElementAttributes & {
}

export abstract class Character extends GlElement {
    public type: GlElementType = 'group';
    constructor(attr: CharacterAttributes) {
        super(attr);
    }
}
