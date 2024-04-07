import { GlElement, GlElementAttributes } from '../elements/gl/glElement';
import { GlElementType } from './gl';

export type CharacterAttributes = GlElementAttributes & {
}

export abstract class Character extends GlElement {
    public type: GlElementType = 'group';
    constructor(attr: CharacterAttributes) {
        super(attr);
    }
}
