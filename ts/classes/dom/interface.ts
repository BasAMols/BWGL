import { DomElement, DomElementAttributes } from "./domElement";

export type  UIAttributes = DomElementAttributes & {
   
}
export class UI extends DomElement<'div'> {
    public constructor(attr: UIAttributes = {}) {
        super('div', attr);
        this.dom.style.width = '100%';
        this.dom.style.height = '100%';
        this.dom.style.zIndex = '3';
        this.dom.style.pointerEvents = 'none';
    }
}