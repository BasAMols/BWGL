import { GlElement } from './elementBase';
import { Character } from './character';
import { GlElementType } from './glr';

export class GlController extends GlElement {
    public type: GlElementType = 'controller';
    public target: Character;
}