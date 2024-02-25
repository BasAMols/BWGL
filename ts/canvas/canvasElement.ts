import { DomElement } from '../dom/domElement';
import { Game } from '../game';
import { CanvasController } from '../utils/controller';
import { Element, ElementAttributes } from "../utils/element";
import { Level } from '../utils/level';
import { Mode } from '../utils/mode';
import { TickerReturnData } from '../utils/ticker';
import { Vector2 } from "../utils/vector2";

export type CanvasElementAttributes = ElementAttributes & {
    hasDom?: boolean,
    position?: Vector2,
    controllers?: CanvasController[]
}
export interface CanvasElement {
    tick?(obj: TickerReturnData): void
    build?(): void
    mouseMove?(e: MouseEvent): void
    keyDown?(e: KeyboardEvent): void
    keyUp?(e: KeyboardEvent): void
}
export type CanvasElementType = 'color'|'image'|'wrapper'|'logic';
export abstract class CanvasElement extends Element {
    public abstract type: CanvasElementType;
    public parent!: CanvasElement;
    public game!: Game;
    public mode!: Mode;
    public level!: Level;
    public dom!: DomElement<any>;

    public absolute: boolean = true; 
    private lastPosition: Vector2  = Vector2.zero; 
    public movedAmount: Vector2 = Vector2.zero; 
    public position: Vector2  = Vector2.zero; 
    public active: boolean = true;
    public visible: boolean = true;
    public lowerChildren: CanvasElement[] = [];
    public higherChildren: CanvasElement[] = [];
    public controllers: CanvasController[] = [];
    constructor(attr: CanvasElementAttributes = {}) {
        super(attr);
        this.position = attr.position || Vector2.zero;
        this.addControllers(attr.controllers || []);
        if (attr.hasDom){
            this.dom = new DomElement('div')
        }
    }

    public addChild(child: CanvasElement, above: boolean = false){
        if (child.parent === undefined){
            child.parent ??= this;
            child.game ??= this.game;
            child.mode ??= this.mode;
            child.level ??= this.level;

            this[above?'higherChildren':'lowerChildren'].push(child);

            if (child.dom){
                this.dom.appendChild(child.dom);
            }

            if (child.build){
                child.build()
            }

            child.registerControllers(child);

        } else {
            console.log('The element is already a parent of another element.');
        }
    }

    public addControllers(c: CanvasController[]){
        this.controllers.push(...c);
    }

    public registerControllers(child: CanvasElement) {
        child.controllers.forEach((controller) => {
            if (controller.parent === undefined){
                controller.parent ??= child;
                controller.game ??= child.game;
                controller.mode ??= child.mode;
                controller.level ??= child.level;
            }
        });
    }
    
    public tick?(obj: TickerReturnData) {
        if (this.active){
            this.movedAmount = this.lastPosition.subtract(this.position);
            this.lastPosition = this.position;
            this.controllers.forEach((c) => c.tick(obj) );
            this.lowerChildren.forEach((c) => c.tick(obj) );
            this.higherChildren.forEach((c) => c.tick(obj) );
        }
    }

    public abstract render(c: CanvasRenderingContext2D ): void
}


