import { GlElementAttributes } from '../elementBase';
import { GLGroup } from '../group';


export type LightTypes = 'spot'|'ambient'
export type LightAttributes = GlElementAttributes;

export abstract class Light extends GLGroup{
    public abstract lightType: LightTypes;
}