import { Element, ElementAttributes } from "../utils/element";
import { GlElementType } from './glRenderer';
import { TickerReturnData } from '../utils/ticker';
import { Vector2 } from "../utils/vector2";
import { Vector3, v3 } from '../utils/vector3';
import { GlController } from './controller';
import { Collider } from '../utils/collider';

export type GlElementAttributes = ElementAttributes & {
    autoReady?: boolean,
    controllers?: GlController[];
    composite?: GlobalCompositeOperation;
    size?: Vector3;
    position?: Vector3;
    rotation?: Vector3;
    anchorPoint?: Vector3;
};
export interface GlElement {
    mouseMove?(e: MouseEvent): void;
    keyDown?(e: KeyboardEvent): void;
    keyUp?(e: KeyboardEvent): void;
    click?(e: MouseEvent): void;
    scroll?(e: WheelEvent): void;
    drag?(d: Vector2): void;
}
export abstract class GlElement extends Element {
    public abstract type: GlElementType;
    public rendererType = 'gl' as const;
    public autoReady: boolean;
    public anchorPoint: Vector3;
    public parent: GlElement;
    public position: Vector3 = v3(0);
    public size: Vector3 = v3(0);
    public rotation: Vector3 = v3(0);
    private _active: boolean = true;
    public readyState: boolean = false;
    public get active(): boolean {
        return this._active;
    }
    public set active(value: boolean) {
        this._active = value;
    }

    public children: GlElement[] = [];
    public controllers: GlController[] = [];
    public anchoredPosition: Vector2 = Vector2.zero;

    public get camera(): typeof this.mode.camera {
        return this.mode.camera;
    }
    public set camera(c: typeof this.mode.camera) {
        this.mode.camera = c;
    }

    constructor(attr: GlElementAttributes = {}) {
        super();
        this.autoReady = attr.autoReady !== undefined ? attr.autoReady : true;
        this.addControllers(attr.controllers || []);

        this.size = attr.size || this.parent?.size || v3(0);
        this.position = attr.position || v3(0);
        this.rotation = attr.rotation || v3(0);
        this.anchorPoint = attr.anchorPoint || v3(0);
    }

    public get absolutePosition(): Vector3 {
        return (this.parent?.absolutePosition || v3(0)).add(this.position);
    }

    public set absolutePosition(v: Vector3) {
        this.position = v.subtract(this.parent.absolutePosition);
    }

    public ready() {
        this.build();
        if (this.game.waitCount) {
            this.game.waitCount--;
        }
    }

    public addChild(child: GlElement): typeof child {
        child.parent ??= this;
        child.game ??= this.game;
        if (this.game.waitCount) {
            this.game.waitCount++;
        }
        this.children.push(child);
        if (child.autoReady) {
            child.ready();
        }
        GlElement.registerControllers(child);

        if (child.type === 'collider' && this.level) {
            this.level.colliders.push(child as Collider);
        }

        child.readyState = true;

        return child;
    }

    public removeChild(child: GlElement) {
        if (this.children.includes(child)){
            this.children.splice(this.children.indexOf(child), 1);
        }
    }

    public addControllers(c: GlController[]) {
        if (c.length > 0) {
            this.controllers.push(...c);
        }
    }

    public static registerControllers(child: GlElement) {
        child.controllers.forEach((controller) => {
            if (controller.parent === undefined) {
                controller.parent ??= child;
                controller.game ??= child.game;
                controller.build();
            }
        });
    }

    public tick(obj: TickerReturnData) {

        this.controllers.filter((child) => child.active && child.order === 'before').forEach((c) => c.tick(obj));
        this.children.filter((child) => child.active).forEach((c) => c.tick(obj));
        this.children.filter((child) => child.active).forEach((c) => c.afterTick(obj));
    }

    public afterTick(obj: TickerReturnData) {
        this.controllers.filter((child) => child.active && child.order === 'after').forEach((c) => c.tick(obj));
    }
}