import { Skeleton } from '../utils/skeleton';
import { GlElement } from './elementBase';
import { GlElementType } from './glRenderer';

export class GLGroup extends GlElement {
    public type: GlElementType = 'group';
    public skeleton: Skeleton;
    public get ani(){
        return this.skeleton.animator
    }
}