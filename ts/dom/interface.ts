import { DomElement, DomElementAttributes } from "./domElement";

export type  InterfaceAttributes = DomElementAttributes & {
   
}
export class Interface extends DomElement<'div'> {
    public constructor(attr: InterfaceAttributes = {}) {
        super('div', attr);
        this.dom.style.width = '100%';
        this.dom.style.height = '100%';
        this.dom.style.zIndex = '3';
        this.dom.style.pointerEvents = 'none';
    }
}