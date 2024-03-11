import { Collider, ColliderAttributes } from './collider';

export type ReactorAttributes = ColliderAttributes & {
    reaction: () => void;
}

export class Reactor extends Collider {
    public callback: () => void;

    public constructor(attr: ReactorAttributes) {
        super(attr);
        this.callback = attr.callback;
    }
}