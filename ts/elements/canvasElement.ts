import { DomElement } from './domElement';
import { Collider } from '../utils/collider';
import { CanvasController } from '../utils/controller';
import { Element, ElementAttributes } from "../utils/element";
import { TickerReturnData } from '../utils/ticker';
import { Vector2 } from "../utils/vector2";

export type CanvasElementAttributes = ElementAttributes & {
    hasDom?: boolean,
    autoReady?: boolean,
    controllers?: CanvasController[];
    composite?: GlobalCompositeOperation;
};
export interface CanvasElement {
    mouseMove?(e: MouseEvent): void;
    keyDown?(e: KeyboardEvent): void;
    keyUp?(e: KeyboardEvent): void;
}
export type CanvasElementType = 'color' | 'image' | 'wrapper' | 'logic' | 'animation' | 'collider' ;
export abstract class CanvasElement extends Element {
    public abstract type: CanvasElementType;
    public rendererType = 'canvas' as const;
    public dom!: DomElement<any>;
    private autoReady: boolean;
    private hasDom: boolean;
    public composite: GlobalCompositeOperation = 'source-over';

    public get x() {
        return super.x;
    }

    public set x(n: number) {
        super.x = n;
        if (this.dom) {
            this.dom.x = n;
        }
    }

    public get y() {
        return super.y;
    }

    public set y(n: number) {
        super.y = n;
        if (this.dom) {
            this.dom.y = n;
        }
    }

    public get width() {
        return super.width;
    }

    public set width(n: number) {
        super.width = n;
        if (this.dom) {
            this.dom.width = n;
        }
    }

    public get height() {
        return super.height;
    }

    public set height(n: number) {
        super.height = n;
        if (this.dom) {
            this.dom.height = n;
        }
    }

    public get renderPosition(): Vector2 {
        return this.position.add(this.anchoredPosition);
    }
    public get renderX() { return this.renderPosition.x; }
    public get renderY() { return this.renderPosition.y; }

    public lowerChildren: CanvasElement[] = [];
    public higherChildren: CanvasElement[] = [];
    public controllers: CanvasController[] = [];
    public anchoredPosition: Vector2 = Vector2.zero;

    constructor(attr: CanvasElementAttributes = {}) {
        super(attr);
        this.hasDom = attr.hasDom || false;
        if (this.hasDom) {
            this.dom = new DomElement('div');
        }
        this.autoReady = attr.autoReady || false;
        this.composite = attr.composite || 'source-over';
        this.addControllers(attr.controllers || []);
    }

    public addChild(child: CanvasElement | DomElement<any>, above: boolean = false): typeof child{
        child.parent ??= this;
        child.game ??= this.game;
        child.mode ??= this.mode;
        child.level ??= this.level;
        if (this.game.waitCount){
            this.game.waitCount++;
        }

        if (child.rendererType === 'canvas') {
            this[above ? 'higherChildren' : 'lowerChildren'].push(child);
            child.registerControllers(child);
            if (child.dom && this.hasDom) {
                this.dom.addChild(child.dom);
            }
        } else {
            if (this.hasDom) {
                this.dom.addChild(child);
            } else {
                console.log('The CanvasElement class does not have a dom element to add children to. Child:', child.constructor.name);
            }
        }

        if (!this.autoReady) {
            child.build();
            if (this.game.waitCount){
                this.game.waitCount--;
            }
    
        }

        if (child.rendererType === 'canvas' && child.type === 'collider' && (child as Collider).colliderType === 'static' && this.level) {
            this.level.colliders.push(child as Collider);
        }

        return child;

    }

    public addControllers(c: CanvasController[]) {
        if (c.length > 0) {
            this.controllers.push(...c);
        }
    }

    public registerControllers(child: CanvasElement) {
        child.controllers.forEach((controller) => {
            if (controller.parent === undefined) {
                controller.parent ??= child;
                controller.game ??= child.game;
                controller.mode ??= child.mode;
                controller.level ??= child.level;
                controller.build();
            }
        });
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        
        this.controllers.filter((child)=>child.active).forEach((c) => c.tick(obj));
        this.lowerChildren.filter((child)=>child.active).forEach((c) => c.tick(obj));
        this.higherChildren.filter((child)=>child.active).forEach((c) => c.tick(obj));
        if (this.dom) {
            this.dom.tick(obj);
        }
    }
    

    public preRender(c: CanvasRenderingContext2D) {
        c.save();
        
        if (this.relativity === 'anchor') {
            c.translate(this.x, this.y);
            c.scale(this.zoom.x, this.zoom.y);
        }
        
        this.lowerChildren.filter((child)=>child.visible && child.active).forEach((child) => {
            child.preRender(c);
            child.postRender(c);
        });
        
        c.save();
        c.globalCompositeOperation = this.composite;
        this.render(c);
        c.restore();
    }

    public render(c: CanvasRenderingContext2D) {
        //
    }

    public postRender(c: CanvasRenderingContext2D) {
        this.higherChildren.filter((child)=>child.visible && child.active).forEach((child) => {
            child.preRender(c);
            child.postRender(c);
        });

        c.restore();
    }

}


