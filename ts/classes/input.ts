import { Game } from '../game';
import { DomText } from './dom/domText';
import { Renderer } from './dom/renderer';
import { Vector2 } from './math/vector2';

export class kbm {
    private canvas: Renderer;
    private _locked: boolean;
    private overlay: DomText;
    private lastTouch: Vector2;
    public get locked(): boolean {
        return this._locked;
    }
    public set locked(value: boolean) {
        this._locked = value;
        this.overlay.dom.style.display = !value? 'block': 'none';
    }
    public constructor(game: Game) {
        this.canvas = game.renderer;
        this.canvas.dom.addEventListener('click', this.mouseClick.bind(this));
        this.overlay = new DomText({
            text: 'Pauzed',
        });
        this.overlay.dom.setAttribute('style', `
            transform-origin: left bottom;
            pointer-events: none;
            bottom: 0px;
            left: 0px;
            user-select: none;
            z-index: 999;
            position: absolute;
            height: 100vh;
            width: 100vw;
            color: white !important;
            font-family: monospace;
            font-weight: bold;
            font-size: 40px;
            padding-left: 50px;
            padding-top: 20px;
            box-sizing: border-box;
            text-transform: uppercase;`
        );
        document.body.appendChild(this.overlay.dom);

        document.addEventListener('pointerlockchange', () => {
            this.locked = (document.pointerLockElement === this.canvas.dom);
        });

    }

    public mouseClick(e: MouseEvent) {
        if (!this.locked) {
            this.canvas.dom.requestPointerLock();
        }
    }
}