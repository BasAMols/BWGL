import { Event } from "./event";
import { Vector2 } from './vector2';

export interface ElementAttributes {
    position?: Vector2,
}

export abstract class Element {
    private events: Event<unknown>[] = [];
    
    constructor(attr: ElementAttributes = {}) {
        
    }

    addEvent(e: Event<unknown>) {
        this.events.push(e);
    }

    getEvent(id: string) {
        return this.events.find((e)=>id === e.id)
    }
}
