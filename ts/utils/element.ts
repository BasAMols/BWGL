import { Game } from '../game';
import { ElementVisible, ElementVisibleAttributes } from './elementVisible';
import { Event } from "./event";
import { GLR } from './gl';
import { Level } from './level';
import { Mode } from './mode';
import { TickerReturnData } from './ticker';

export type ElementAttributes = ElementVisibleAttributes;

export abstract class Element extends ElementVisible {
    public abstract rendererType: 'dom' | 'canvas' | 'gl';

    private events: Event<unknown>[] = [];

    get t(): TickerReturnData {
        return this.game.t;
    }

    public parent!: Element;
    public game!: Game;
    public mode!: Mode;
    public level!: Level;
    public GLR!: GLR;
    public get gl(): WebGLRenderingContext{
        return this.GLR.gl
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
