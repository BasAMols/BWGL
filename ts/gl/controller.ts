import { GlElement } from './elementBase';
import { Character } from './character';
import { GlElementType } from './glRenderer';

export class GlController extends GlElement {
    public type: GlElementType = 'controller';
    public target: Character;
}