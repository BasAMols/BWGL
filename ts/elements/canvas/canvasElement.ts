import { DomElement } from '../dom/domElement';
import { Collider } from '../../utils/collider';
import { CanvasController } from '../../utils/controller';
import { Element, ElementAttributes } from "../../utils/element";
import { TickerReturnData } from '../../utils/ticker';
import { Vector2 } from "../../utils/vector2";
import { GlElement } from '../gl/glElement';

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
export type CanvasElementType = 'color' | 'image' | 'wrapper' | 'logic' | 'animation' | 'collider';
export abstract class CanvasElement extends Element {
    public abstract type: CanvasElementType;
    public rendererType: "canvas" | "dom" | "gl" = 'canvas';
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
    public glElements: GlElement[] = [];
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

    public addChild(child: CanvasElement | DomElement<any> | GlElement, above: boolean = false): typeof child {
        child.parent ??= this;
        child.game ??= this.game;
        child.mode ??= this.mode;
        child.level ??= this.level;
        child.GLR ??= this.game.GLR;
        if (this.game.waitCount) {
            this.game.waitCount++;
        }

        if (child.rendererType === 'canvas') {
            this[above ? 'higherChildren' : 'lowerChildren'].push(child);
            child.registerControllers(child);
            if (child.dom && this.hasDom) {
                this.dom.addChild(child.dom);
            }
        } else if (child.rendererType === 'gl') {
            this.glElements.push(child as GlElement);
        } else {
            if (this.hasDom) {
                this.dom.addChild(child as DomElement<any>);
            } else {
                console.log('The CanvasElement class does not have a dom element to add children to. Child:', child.constructor.name);
            }
        }

        if (!this.autoReady) {
            child.build();
            if (this.game.waitCount) {
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

        this.controllers.filter((child) => child.active).forEach((c) => c.tick(obj));
        this.lowerChildren.filter((child) => child.active).forEach((c) => c.tick(obj));
        this.higherChildren.filter((child) => child.active).forEach((c) => c.tick(obj));
        this.glElements.filter((child) => child.active).forEach((c) => c.tick(obj));

        if (this.dom) {
            this.dom.tick(obj);
        }
    }


    public preRender(c: CanvasRenderingContext2D, gl?: WebGLRenderingContext) {
        c.save();

        if (this.relativity === 'anchor' || this.relativity === 'composite') {
            c.translate(this.x, this.y);
            c.scale(this.zoom.x, this.zoom.y);
        }

        c.save();
        c.globalCompositeOperation = this.composite;
        this.renderLower(c);
        this.render(c);
        c.restore();
    }

    public renderLower(c: CanvasRenderingContext2D, gl?: WebGLRenderingContext) {
        this.lowerChildren.filter((child) => child.visible && child.active).forEach((child) => {
            child.preRender(c);
            child.postRender(c);
        });
    }

    public render(c: CanvasRenderingContext2D, gl?: WebGLRenderingContext) {
        //
    }

    public renderHigher(c: CanvasRenderingContext2D, gl?: WebGLRenderingContext) {
        this.higherChildren.filter((child) => child.visible && child.active).forEach((child) => {
            child.preRender(c);
            child.postRender(c);
        });
        if (gl) {
            this.glElements.filter((child) => child.visible && child.active).forEach((child) => {
                child.preRender(gl);
                child.postRender(gl);
            });
        }
    }

    public renderGl(gl: WebGLRenderingContext) {
        this.glElements.filter((child) => child.visible && child.active).forEach((child) => {
            child.preRender(gl);
            child.postRender(gl);
        });
    }

    public postRender(c: CanvasRenderingContext2D, gl?: WebGLRenderingContext) {
        this.renderHigher(c);
        this.renderGl(gl);
        c.restore();
    }

}


