import { Skeleton } from '../utils/skeleton';
import { GlElement, GlElementAttributes } from './elementBase';
import { GlElementType } from './glRenderer';

export type CharacterAttributes = GlElementAttributes & {
}

export abstract class Character extends GlElement {
    public type: GlElementType = 'group';
    public stat: Record<string, boolean> = {}
    public skeleton: Skeleton;
    public get ani(){
        return this.skeleton.animator
    }
    constructor(attr: CharacterAttributes) {
        super(attr);
    }
}
