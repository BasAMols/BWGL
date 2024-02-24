import { Element, ElementAttributes } from "../utils/element";
import { Vector2 } from "../utils/vector2";

export type DomElementAttributes = ElementAttributes &  {
    id?: string,
    size?: Vector2,
    background?: string,
    position?: Vector2
}
export class DomElement<T extends keyof HTMLElementTagNameMap> extends Element {
    public dom: HTMLElementTagNameMap[T];

    private _position: Vector2; 

    public get position(): Vector2 {
        return this._position;
    }

    public set position(value: Vector2) {
        if (value && this.dom){
            this.dom.style.left = value.x + 'px';
            this.dom.style.top = value.y + 'px';
        }
    }

    public get id() { return this.dom.id }
    public set id(value: string) {
        if (value){
            this.dom.id = value;
        }
    }

    public get size() {
        return new Vector2(this.width,this.height)
    }
    public set size(value: Vector2) {
        if (value) {
            this.width = value.x;
            this.height = value.y;
        }
    };

    public set background (v: string) {
        this.dom.style.background = v; 
    }

    public get width(){return this.dom.clientWidth}
    public set width(value: number) {
        this.dom.style.width = `${value}px`
        this.dom.setAttribute('width', String(value));
    }

    public get height(){return this.dom.clientHeight}
    public set height(value: number) {
        this.dom.style.height = `${value}px`
        this.dom.setAttribute('height', String(value));
    }

    constructor(type: T, attr: DomElementAttributes = {}) {
        super(attr);
        this.dom = document.createElement(type)
        this.dom.style.position = 'absolute';
        this.id = attr.id || '';
        this.size = attr.size;
        this.background = attr.background || '';
        this.position = attr.position || Vector2.zero;
    }

    public appendChild(e: DomElement<any>) {
        this.dom.appendChild(e.dom)
        this.dom.addEventListener
    }

    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLAnchorElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        this.dom.addEventListener(type, listener, options)
    };
    removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLAnchorElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        this.dom.removeEventListener(type, listener, options)
    };

    

}
