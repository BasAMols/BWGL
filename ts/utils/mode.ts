import { GlElementAttributes } from '../gl/elementBase';
import { GLGroup } from '../gl/group';
import { Level } from './level';
import { TickerReturnData } from './ticker';

export type modeAttributes = GlElementAttributes & {

};
export abstract class Mode extends GLGroup {
    public levels: Record<string, Level> = {};

    public get camera():typeof this.level.camera {
        return this.level.camera;
    }
    public set camera(value:typeof this.level.camera) {
        this.level.camera = value;
    }

    constructor(attr: modeAttributes = {}) {
        super(attr);
    }

    public build(): void {
        this.game.active.mode = this;
        this.switchLevel(Object.keys(this.levels)[0])
    }

    private keyAliases = {
        'w': 'up',
        'a': 'left',
        's': 'down',
        'd': 'right',
        ' ': 'space',
        'ArrowUp': 'up',
        'ArrowLeft': 'left',
        'ArrowDown': 'down',
        'ArrowRight': 'right',
    } as const;

    public input: {
        'up': boolean,
        'left': boolean,
        'down': boolean,
        'right': boolean,
        'space': boolean,
    } = {
            'up': false,
            'left': false,
            'down': false,
            'right': false,
            'space': false,
        };

    protected addLevel(s: string, level: Level) {
        this.levels[s] = level;
        this.addChild(level);
    }

    public switchLevel(s: string) {
        Object.entries(this.levels).forEach(([key, level]) => {
            level.active = key === s;
        });
    }

    public keyDown(e: KeyboardEvent) {
        if (Object.keys(this.keyAliases).includes(e.key)) {
            this.input[this.keyAliases[e.key as keyof typeof this.keyAliases]] = true;
        }
    }

    public keyUp(e: KeyboardEvent) {
        if (Object.keys(this.keyAliases).includes(e.key)) {
            this.input[this.keyAliases[e.key as keyof typeof this.keyAliases]] = false;
        }
    }


    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.controllers.filter((child) => child.active).forEach((c) => c.tick(obj));
        this.children.filter((child) => child.active).forEach((c) => c.tick(obj));
    }
}
