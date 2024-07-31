import { Game, glob } from '../game';
import { Event } from "./event";
import { GLRenderer } from './rendering/glRenderer';
import { Level } from './level';
import { Mode } from './mode';
import { TickerReturnData } from './ticker';
import { GLTranslator } from './rendering/glTranslator';

export type ElementAttributes = {
    
};

export abstract class Element {
    public abstract rendererType: 'dom' | 'gl';

    private events: Event<unknown>[] = [];

    get t(): TickerReturnData {
        return this.game.t;
    }

    public parent!: Element;

    public get game(): Game {
        return glob.game;
    }
    
    public get mode(): Mode {
        return this.game.mode;
    }
    public get level(): Level {
        return this.game.level;
    }
    public get GLT(): GLTranslator {
        return this.game.GLR.glt;
    }
    public get GLR(): GLRenderer {
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
