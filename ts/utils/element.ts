import { Game } from '../game';
import { Event } from "./event";
import { GLR } from '../gl/glRenderer';
import { Level } from './level';
import { Mode } from './mode';
import { TickerReturnData } from './ticker';

export type ElementAttributes = {
    
};

export abstract class Element {
    public abstract rendererType: 'dom' | 'gl';

    private events: Event<unknown>[] = [];

    get t(): TickerReturnData {
        return this.game.t;
    }

    public parent!: Element;
    public game!: Game;
    
    public get mode(): Mode {
        return this.game.mode;
    }
    public get level(): Level {
        return this.game.level;
    }
    public get GLR(): GLR {
        return this.game.GLR;
    }
    public get gl(): WebGLRenderingContext{
        return this.game.gl
    };

    public build(): void  {
        //
    }

    addEvent(e: Event<unknown>) {
        this.events.push(e);
    }

    getEvent(id: string) {
        return this.events.find((e)=>id === e.id)
    }
}
