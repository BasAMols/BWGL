import { CanvasWrapper, CanvasWrapperAttributes } from '../elements/canvas/canvasWrapper';
import { ElementRelativity } from './elementPosition';
import { Level } from './level';
import { TickerReturnData } from './ticker';
import { Vector2 } from './vector2';

export type modeAttributes = CanvasWrapperAttributes & {

}
export abstract class Mode extends CanvasWrapper {
    public levels: Record<string, Level> = {};
    public relativity: ElementRelativity = 'anchor';
    public assetManager: BABYLON.AssetsManager

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

    build(): void {
        super.build();
        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2) => {
            this.size = size;
        });
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

    public keyDown(e: KeyboardEvent) {
        if (Object.keys(this.keyAliases).includes(e.key)){
            this.input[this.keyAliases[e.key as keyof typeof this.keyAliases]] = true;
        }
    }
    
    public keyUp(e: KeyboardEvent) {
        if (Object.keys(this.keyAliases).includes(e.key)){
            this.input[this.keyAliases[e.key as keyof typeof this.keyAliases]] = false;
        }
    }

    
    public tick(obj: TickerReturnData) {
        super.tick(obj);
        
        this.controllers.filter((child)=>child.active).forEach((c) => c.tick(obj));
        this.lowerChildren.filter((child)=>child.active).forEach((c) => c.tick(obj));
        this.higherChildren.filter((child)=>child.active).forEach((c) => c.tick(obj));
        this.glElements.filter((child)=>child.active).forEach((c) => c.tick(obj));
        if (this.dom) {
            this.dom.tick(obj);
        }
    }
}
