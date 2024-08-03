import { GlElementAttributes } from './elementBase';
import { GLGroup } from './group';
import { ObjStorage } from './objStorage';
import { Level } from './level';
import { TickerReturnData } from './ticker';
import { Vector2 } from './math/vector2';

export type modeAttributes = GlElementAttributes & {

};
export abstract class Mode extends GLGroup {
    public levels: Record<string, Level> = {};
    public storage: ObjStorage;
    public lastTouch: Vector2;

    public get camera(): typeof this.level.camera {
        return this.level.camera;
    }
    public set camera(value: typeof this.level.camera) {
        this.level.camera = value;
    }

    constructor(attr: modeAttributes = {}) {
        super(attr);
    }

    public build(): void {
        this.game.active.mode = this;
        this.storage = new ObjStorage();
        this.switchLevel(Object.keys(this.levels)[0]);
    }

    protected addLevel(s: string, level: Level) {
        this.levels[s] = level;
        this.addChild(level);
        document.body.appendChild(level.interface.dom)
    }

    public switchLevel(s: string) {
        Object.entries(this.levels).forEach(([key, level]) => {
            level.active = key === s;
        });
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.controllers.filter((child) => child.active).forEach((c) => c.tick(obj));
        this.children.filter((child) => child.active).forEach((c) => c.tick(obj));
    }
}
