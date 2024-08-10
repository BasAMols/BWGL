import { Light, LightAttributes, LightTypes } from './light';


export type AmbientAttributes = LightAttributes & {
    color: [number,number,number],
};

export class AmbientLight extends Light{
    public lightType: LightTypes = 'ambient';
    public color: [number,number,number];
    
    public constructor(attr: AmbientAttributes) {
        super(attr);
        this.color = attr.color;
    }
}