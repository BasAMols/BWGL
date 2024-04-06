import { CanvasController } from '../../utils/controller';
import { Element, ElementAttributes } from "../../utils/element";
import { TickerReturnData } from '../../utils/ticker';
import { Vector2 } from "../../utils/vector2";

export type GlElementAttributes = ElementAttributes & {
    autoReady?: boolean,
    controllers?: CanvasController[];
    composite?: GlobalCompositeOperation;
};
export interface GlElement {
    mouseMove?(e: MouseEvent): void;
    keyDown?(e: KeyboardEvent): void;
    keyUp?(e: KeyboardEvent): void;
}
export type GlElementType = 'camera'|'light'|'mesh' ;
export abstract class GlElement extends Element {
    public abstract type: GlElementType;
    public rendererType = 'gl' as const;
    private autoReady: boolean;
    private _z: number;

    public get x() {
        return super.x;
    }

    public set x(n: number) {
        super.x = n;
    }

    public get y() {
        return super.y;
    }

    public set y(n: number) {
        super.y = n;
    }

    public get z() {
        return this._z;
    }

    public set z(n: number) {
        this._z = n;
    }

    public get width() {
        return super.width;
    }

    public set width(n: number) {
        super.width = n;
    }

    public get height() {
        return super.height;
    }

    public set height(n: number) {
        super.height = n;
    }

    public get renderPosition(): Vector2 {
        return this.position.add(this.anchoredPosition);
    }
    public get renderX() { return this.renderPosition.x; }
    public get renderY() { return this.renderPosition.y; }

    public glChildren: GlElement[] = [];
    public controllers: CanvasController[] = [];
    public anchoredPosition: Vector2 = Vector2.zero;

    constructor(attr: GlElementAttributes = {}) {
        super(attr);

        this.autoReady = attr.autoReady || false;        
        this.addControllers(attr.controllers || []);
    }

    public addChild(child: GlElement): typeof child{
        child.parent ??= this;
        child.game ??= this.game;
        child.mode ??= this.mode;
        child.level ??= this.level;
        child.GLR ??= this.game.GLR;
        child.gl ??= this.game.gl;
        if (this.game.waitCount){
            this.game.waitCount++;
        }
        this.glChildren.push(child);
        child.registerControllers(child);
        

        if (!this.autoReady) {
            child.build();
            if (this.game.waitCount){
                this.game.waitCount--;
            }
    
        }

        // if (child.rendererType === 'canvas' && child.type === 'collider' && (child as Collider).colliderType === 'static' && this.level) {
        //     this.level.colliders.push(child as Collider);
        // }

        return child;

    }

    public addControllers(c: CanvasController[]) {
        if (c.length > 0) {
            this.controllers.push(...c);
        }
    }

    public registerControllers(child: GlElement) {
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
        this.glChildren.filter((child)=>child.active).forEach((c) => c.tick(obj));
    }
    

    public preRender(c: WebGLRenderingContext) {
        this.renderLower(c);
        this.render(c);
    }

    public renderLower(c: WebGLRenderingContext) {
        this.glChildren.filter((child)=>child.visible && child.active).forEach((child) => {
            child.preRender(c);
            child.postRender(c);
        });
    }

    public render(c: WebGLRenderingContext) {
        //
    }

    public postRender(c: WebGLRenderingContext) {
    }

}


