import { DomElement } from '../dom/domElement';
import { Game } from '../game';
import { Element, ElementAttributes } from "../utils/element";
import { Level } from '../utils/level';
import { Mode } from '../utils/mode';
import { TickerReturnData } from '../utils/ticker';
import { Vector2 } from "../utils/vector2";

export type CanvasElementAttributes = ElementAttributes & {
    hasDom?: boolean,
    position?: Vector2
}
export interface CanvasElement {
    tick?(obj: TickerReturnData): void
    build?(): void
}
export abstract class CanvasElement extends Element {
    public abstract type: 'color'|'image'|'wrapper'|'grid';
    public renderStyle: 'over'|'under' = 'over';

    public parent!: CanvasElement;
    public game!: Game;
    public mode!: Mode;
    public level!: Level;
    public dom!: DomElement<any>;

    public absolute: boolean = true; 
    public position: Vector2; 
    public active: boolean = true;
    public visible: boolean = true;
    public children: CanvasElement[] = [];
    constructor(attr: CanvasElementAttributes = {}) {
        super(attr);
        this.position = attr.position || Vector2.zero;
        if (attr.hasDom){
            this.dom = new DomElement('div')
        }
    }

    public addChild(child: CanvasElement, below: boolean = false){
        if (child.parent === undefined){
            child.parent ??= this;
            child.game ??= this.game;
            child.mode ??= this.mode;
            child.level ??= this.level;

            this.children.push(child);
            if (child.dom){
                this.dom.appendChild(child.dom);
            }

            if (child.build){
                child.build()
            }
        } else {
            console.log('The element is already a parent of another element.');
        }
    }
    
    public tick?(obj: TickerReturnData) {
        if (this.active){
            this.children.forEach((c) => c.tick(obj) );
        }
    }

    public abstract render(c: CanvasRenderingContext2D ): void

}


