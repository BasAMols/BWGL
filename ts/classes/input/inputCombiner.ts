import { glob } from '../../game';
import { Vector2, v2 } from '../math/vector2';


export abstract class InputReader<T extends number | Vector2> {
    tick(): void {
        //void
    }
    abstract get value(): T;
}

export class KeyboardReader extends InputReader<number>{
    key: string;
    constructor(key: string) {
        super();
        glob.device.keyboard.register(
            key,
            () => { this._state = true; },
            () => { this._state = false; }
        );
    }
    private _state: boolean = false;
    get value(): number {
        return Number(this._state);
    }
}

export class KeyboardJoyStickReader extends InputReader<Vector2>{
    constructor(keys: [string, string, string, string]) {
        super();
        keys.forEach((k, i) => {
            glob.device.keyboard.register(
                k,
                () => { this._state[Math.floor(i/2)][i%2] = true; this.setVector(); },
                () => { this._state[Math.floor(i/2)][i%2] = false; this.setVector(); }
            );
        });
    }

    private setVector() {
        this._vector = v2(
            -this._state[0][0] + +this._state[0][1],
            -this._state[1][0] + +this._state[1][1],
        );
    }
    
    private _state: [[boolean, boolean], [boolean, boolean]] = [[false, false], [false, false]];
    private _vector: Vector2 = v2(0);
    get value(): Vector2 {
        return this._vector;
    }
}

export class MouseMoveReader extends InputReader<Vector2>{
    constructor() {
        super();
        glob.renderer.dom.addEventListener('mousemove', (e) => {
            this._delta.x += e.movementX;
            this._delta.y += e.movementY;
        });
    }
    private _delta: Vector2 = v2(0);
    get value(): Vector2 {
        return this._delta;
    }
    public tick(): void {
        this._delta = v2(0);
    }
}

export class MouseScrollReader extends InputReader<number>{
    constructor() {
        super();
        glob.renderer.dom.addEventListener('wheel', (e) => {
            this._delta += e.deltaY;
        });
    }
    private _delta: number = 0;
    get value(): number {
        return this._delta;
    }
    tick(): void {
        this._delta = 0;
    }
}

// export class TouchReader<T extends number|Vector2> extends InputReader<T>{
//     get value(): T {
//         throw new Error('Method not implemented.');
//     }

// }

// export class ControllerReader<T extends number|Vector2> extends InputReader<T>{
//     get value(): T {
//         throw new Error('Method not implemented.');
//     }

// }

export abstract class Input<T extends number | Vector2> {
    constructor(protected readers: InputReader<T>[]) {

    }
    protected abstract _value: T;
    abstract get value(): T;
    public tick() {
        this.readers.forEach((r) => {
            r.tick();
        });
    }
}

export class JoyStick extends Input<Vector2> {
    protected _value: Vector2;
    get value(): Vector2 {
        let total = v2(0);
        this.readers.forEach((r) => {
            total = total.add(r.value);
        });
        return total;
    }
}
export class Button extends Input<number> {
    protected _value: number;
    get value(): number {
        let total = 0;
        this.readers.forEach((r) => {
            total += r.value;
        });
        return total;
    }
}

export class InputMap {
    joysticks: Record<string, JoyStick> = {};
    buttons: Record<string, Button> = {};
    constructor(
        joysticks: Record<string, InputReader<Vector2>[]> = {},
        buttons: Record<string, InputReader<number>[]> = {}
    ) {
        Object.entries(joysticks).forEach(([key, readers]) => {
            this.joysticks[key] = new JoyStick(readers);
        });
        Object.entries(buttons).forEach(([key, readers]) => {
            this.buttons[key] = new Button(readers);
        });
    }

    public tick() {
        Object.values(this.joysticks).forEach((j) => {
            j.tick();
        });
        Object.values(this.buttons).forEach((j) => {
            j.tick();
        });
    }

    public axis(key: string) {
        return this.joysticks[key].value;
    }

    public button(key: string) {
        return this.buttons[key].value;
    }
}