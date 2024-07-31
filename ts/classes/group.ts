import { Skeleton } from './animation/skeleton';
import { GlElement } from './elementBase';
import { GlElementType } from './rendering/glRenderer';

export class GLGroup extends GlElement {
    public type: GlElementType = 'group';
    public skeleton: Skeleton;
    public get ani(){
        return this.skeleton.animator
    }
}