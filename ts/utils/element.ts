import { Game } from '../game';
import { ElementVisible, ElementVisibleAttributes } from './elementVisible';
import { Event } from "./event";
import { Level } from './level';
import { Mode } from './mode';

export type ElementAttributes = ElementVisibleAttributes;

export abstract class Element extends ElementVisible {
    public abstract rendererType: 'dom' | 'canvas';
    private events: Event<unknown>[] = [];

    public parent!: Element;
    public game!: Game;
    public mode!: Mode;
    public level!: Level;

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
