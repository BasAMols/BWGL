import { CanvasWrapper, CanvasWrapperAttributes } from '../canvas/canvasWrapper';
import { Level } from './level';

export type modeAttributes = CanvasWrapperAttributes & {

}
export abstract class Mode extends CanvasWrapper {
    public levels: Record<string, Level> = {};

    constructor(attr: modeAttributes = {}) {
        super(attr);
        this.mode = this;
    }

    public addLevel(s: string, level: Level) {
        this.levels[s] = level;
        this.addChild(level);
    }

    public switchLevel(s:string){
        Object.entries(this.levels).forEach(([key, level])=>{
            level.active = key === s;
            level.visible = key === s;
        });
    }

    public mouseMove(e: MouseEvent) {
        Object.values(this.levels).find((l)=>l.active).mouseMove(e);
    }
}
