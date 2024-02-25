import { CanvasWrapper, CanvasWrapperAttributes } from '../canvas/canvasWrapper';
import { Level } from './level';

export type modeAttributes = CanvasWrapperAttributes & {

}
export abstract class Mode extends CanvasWrapper {
    public levels: Record<string, Level> = {};

    private keyAliases = {
        'w': 'up',
        'a': 'left',
        's': 'down',
        'd': 'right',
        'ArrowUp': 'up',
        'ArrowLeft': 'left',
        'ArrowDown': 'down',
        'ArrowRight': 'right',
    } as const

    public input: {
        'up': boolean,
        'left': boolean,
        'down': boolean,
        'right': boolean,
    } = {
        'up': false,
        'left': false,
        'down': false,
        'right': false,
    }

    constructor(attr: modeAttributes = {}) {
        super(attr);
        this.mode = this;
    }

    protected addLevel(s: string, level: Level) {
        this.levels[s] = level;
        this.addChild(level);
    }

    public switchLevel(s:string){
        Object.entries(this.levels).forEach(([key, level])=>{
            level.active = key === s;
            level.visible = key === s;
            level.dom?level.dom.visible = key === s: null;
        });
    }

    public mouseMove(e: MouseEvent) {
        this.getLevel().mouseMove(e);
    }

    public keyDown(e: KeyboardEvent) {
        if (Object.keys(this.keyAliases).includes(e.key)){
            this.input[this.keyAliases[e.key as keyof typeof this.keyAliases]] = true;
        }
        this.getLevel().keyDown(e);
    }
    
    public keyUp(e: KeyboardEvent) {
        if (Object.keys(this.keyAliases).includes(e.key)){
            this.input[this.keyAliases[e.key as keyof typeof this.keyAliases]] = false;
        }
        this.getLevel().keyUp(e);
    }

    private getLevel(): Level {
        return Object.values(this.levels).find((l)=>l.active);
    }
}
