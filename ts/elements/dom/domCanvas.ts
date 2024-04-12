import { Game } from '../../game';
import { ElementAttributes } from "../../utils/element";
import { Mode } from '../../utils/mode';
import { TickerReturnData } from '../../utils/ticker';
import { Vector2 } from "../../utils/vector2";
import { DomElement } from './domElement';

export type DomElementAttributes = ElementAttributes & {
    id?: string,
    size?: Vector2,
    background?: string,
    position?: Vector2;
};
export class DomCanvas extends DomElement<'canvas'> {
    public dom: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public domGl: HTMLCanvasElement;
    public tickerData: TickerReturnData;

    constructor(public game: Game) {
        super('canvas');
        this.dom = document.createElement('canvas');
        this.dom.style.position = 'absolute';
        this.dom.style.imageRendering = 'pixelated';
        this.dom.style.pointerEvents = 'all';
        this.dom.style.bottom = '0px';
        this.ctx = this.dom.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.domGl = document.createElement('canvas');
        this.domGl.style.position = 'absolute';
        this.domGl.style.pointerEvents = 'none';
        this.domGl.style.bottom = '0px';

    }

    public build(): void {
        this.game.ctx = this.ctx;
        this.dom.tabIndex = 1;

        this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2) => {
            this.size = size;
            this.game?.GLR?.resize();
        });
        this.game.resize();

    }

    public get width() {
        return Math.round(Number(this.dom.style.width.replace(/\D/g, '')));
    }
    public set width(value: number) {
        if (this.dom) {
            this.dom.style.width = `${value}px`;
            this.dom.setAttribute('width', String(value));
        }
        if (this.domGl) {
            this.domGl.style.width = `${value}px`;
            this.domGl.setAttribute('width', String(value));
        }
    }

    public get height() {
        return Math.round(Number(this.dom.style.height.replace(/\D/g, '')));
    }
    public set height(value: number) {
        if (this.dom) {
            this.dom.style.height = `${value}px`;
            this.dom.setAttribute('height', String(value));
        }
        if (this.domGl) {
            this.domGl.style.height = `${value}px`;
            this.domGl.setAttribute('height', String(value));
        }
    }

    public addMode(child: Mode) {
        child.parent ??= this.game;
        child.game ??= this.game;
        child.mode ??= this.mode;
        child.level ??= this.level;
        child.GLR ??= this.game.GLR;
        this.game.dom.appendChild(child.dom);
        child.registerControllers(child);
        child.build();
    }

    private _context: '2d' | '3d';
    public get context(): '2d' | '3d' {
        return this._context;
    }
    public set context(value: '2d' | '3d') {
        this._context = value;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.tickerData = obj;

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.save();
        this.ctx.scale(1, -1);
        this.ctx.translate(0, -this.height);

        Object.values(this.game.modes).filter((child) => child.active).forEach((mode) => mode.tick(obj));

        Object.values(this.game.modes).filter((child) => child.visible && child.active).forEach((mode) => {
            mode.preRender(this.ctx);
            mode.postRender(this.ctx);
        });
        this.ctx.restore();

        this.game.GLR.draw();
    }
}


