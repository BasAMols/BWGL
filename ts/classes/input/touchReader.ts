import { UI } from '../dom/UI';
import { Vector2, v2 } from '../math/vector2';
import { InputReader } from './input';

export class TouchButtonReader extends InputReader<number> {
    button: HTMLDivElement;
    constructor(public ui: UI, private alignment: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' = 'bottomLeft', private offset: Vector2 = v2(0)) {
        super();
        this.button = document.createElement('div');
        this.button.setAttribute('style', `
            width: 70px;
            height: 70px;
            border-radius: 10px;
            background: #00000024;
            z-index: 99999999999999999999999;
            position: absolute;
            pointer-events: all;
            box-shadow: inset 0px 0px 9px white;
            ${this.alignment.slice(-4) === "Left" ? 'left' : 'right'}:${this.offset.x}px;
            ${this.alignment.slice(3) === "top" ? 'top' : 'bottom'}:${this.offset.y}px;
        `);
        this.button.addEventListener('touchstart', () => {
            this._state = true;

        });
        this.button.addEventListener('touchend', () => {
            this._state = false;
        });
        this.ui.dom.appendChild(this.button);
    }
    private _state: boolean = false;
    get value(): number {
        return Number(this._state);
    }
}

export class TouchAxisReader extends InputReader<Vector2> {
    shell: HTMLDivElement;
    stick: HTMLDivElement;
    private _dragging: boolean;
    private _touchStart: Vector2;
    constructor(public ui: UI, private alignment: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' = 'bottomLeft', private offset: Vector2 = v2(0), private limit: number = 20, private scale: Vector2 = v2(1)) {
        super();
        this.shell = document.createElement('div');
        this.shell.setAttribute('style', `
            width: 20px;
            height: 20px;
            border-radius: 100%;
            background: #000000;
            z-index: 99999999999999999999999;
            position: absolute;
            pointer-events: all;
            ${this.alignment.slice(-4) === "Left" ? 'left' : 'right'}:${this.offset.x + 25}px;
            ${this.alignment.slice(3) === "top" ? 'top' : 'bottom'}:${this.offset.y + 25}px;
        `);

        this.stick = document.createElement('div');
        this.stick.setAttribute('style', `
            width: 70px;
            height: 70px;
            border-radius: 100%;
            background: #00000024;
            z-index: 99999999999999999999999;
            position: absolute;
            pointer-events: all;
            box-shadow: inset 0px 0px 9px white;
            left: -25px;
            top: -25px;
        `);
        // this.stick.addEventListener('touch');
        this.stick.addEventListener('touchstart', (e) => {
            this._dragging = true;
            this._touchStart = v2(e.touches[0].screenX, e.touches[0].screenY);
        });
        this.stick.addEventListener('touchmove', (e) => {
            if (this._dragging) {
                const rel = v2(e.touches[0].screenX, e.touches[0].screenY).subtract(this._touchStart).clampMagnitude(this.limit);
                this.stick.style.transform = `translate(${rel.x}px,${rel.y}px)`;
                this._state = rel.scale(1 / this.limit).multiply(this.scale);
            }
        });
        this.stick.addEventListener('touchend', () => {
            this._dragging = false;
            this._state = v2(0);
            this.stick.style.transform = 'translate(0,0)';
        });
        this.ui.dom.appendChild(this.shell);
        this.shell.appendChild(this.stick);
    }
    private _state: Vector2 = v2(0);
    get value(): Vector2 {
        return this._state;
    }
}

export class TouchLiniarAxisReader extends InputReader<Vector2> {
    shell: HTMLDivElement;
    stick: HTMLDivElement;
    private _dragging: boolean;
    private _touchStart: Vector2;
    constructor(public ui: UI, private alignment: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' = 'bottomLeft', private offset: Vector2 = v2(0), private limit: number = 20, private scale: Vector2 = v2(1)) {
        super();
        this.shell = document.createElement('div');
        this.shell.setAttribute('style', `
            width: 20px;
            height: 20px;
            border-radius: 100%;
            background: #000000;
            z-index: 99999999999999999999999;
            position: absolute;
            pointer-events: all;
            ${this.alignment.slice(-4) === "Left" ? 'left' : 'right'}:${this.offset.x + 25}px;
            ${this.alignment.slice(3) === "top" ? 'top' : 'bottom'}:${this.offset.y + 25}px;
        `);

        this.stick = document.createElement('div');
        this.stick.setAttribute('style', `
            width: 70px;
            height: 70px;
            border-radius: 100%;
            background: #00000024;
            z-index: 99999999999999999999999;
            position: absolute;
            pointer-events: all;
            box-shadow: inset 0px 0px 9px white;
            left: -25px;
            top: -25px;
        `);
        // this.stick.addEventListener('touch');
        this.stick.addEventListener('touchstart', (e) => {
            this._dragging = true;
            this._touchStart = v2(e.touches[0].screenX, e.touches[0].screenY);
        });
        this.stick.addEventListener('touchmove', (e) => {
            if (this._dragging) {
                let direct = v2(e.touches[0].screenX, e.touches[0].screenY).subtract(this._touchStart).clampMagnitude(this.limit);
                if (direct.magnitude() > this.limit / 4) {
                    let rel = Vector2.right.rotate(Math.round(direct.angle() / Math.PI * 2) * Math.PI / 2);
                    this.stick.style.transform = `translate(${rel.x * this.limit}px,${rel.y * this.limit}px)`;
                    if (direct.magnitude() < this.limit / 2) {
                        this._state = v2(0);
                        this.stick.style.transform = `translate(${rel.x * this.limit / 2}px,${rel.y * this.limit / 2}px)`;
                    } else {
                        this._state = rel.multiply(this.scale).toPrecision(1);
                        console.log(this._state);

                        this.stick.style.transform = `translate(${rel.x * this.limit}px,${rel.y * this.limit}px)`;
                    }
                } else {
                    this._state = v2(0);
                    this.stick.style.transform = 'translate(0,0)';
                }
            }
        });
        this.stick.addEventListener('touchend', () => {
            this._dragging = false;
            this._state = v2(0);
            this.stick.style.transform = 'translate(0,0)';
        });
        this.ui.dom.appendChild(this.shell);
        this.shell.appendChild(this.stick);
    }
    private _state: Vector2 = v2(0);
    get value(): Vector2 {
        return this._state;
    }
}

// export class TouchJoyStickReader extends InputReader<Vector2> {
//     constructor(keys: [string, string, string, string]) {
//         super();
//         keys.forEach((k, i) => {
//             glob.device.keyboard.register(
//                 k,
//                 () => { this._state[Math.floor(i / 2)][i % 2] = true; this.setVector(); },
//                 () => { this._state[Math.floor(i / 2)][i % 2] = false; this.setVector(); }
//             );
//         });
//     }

//     private setVector() {
//         this._vector = v2(
//             -this._state[0][0] + +this._state[0][1],
//             -this._state[1][0] + +this._state[1][1]
//         );
//     }

//     private _state: [[boolean, boolean], [boolean, boolean]] = [[false, false], [false, false]];
//     private _vector: Vector2 = v2(0);
//     get value(): Vector2 {
//         return this._vector;
//     }
// }
