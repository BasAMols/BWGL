import { GlElement } from './elementBase';
import { Character } from './character';
import { GlElementType } from './rendering/glRenderer';
export type GlControllerOrder = 'before'|'after';
export class GlController extends GlElement {
    public type: GlElementType = 'controller';
    public order: GlControllerOrder = 'before';
    public target: Character;
}