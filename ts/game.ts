import { FPS } from './gl/debug/fps';
import { Ticker, TickerReturnData } from './gl/ticker';
import { Input } from './gl/input';
import { Mode } from './gl/mode';
import { Renderer } from './dom/renderer';
import { Loader } from './gl/debug/loader';
import { GLRenderer } from './gl/rendering/glRenderer';
import { Level } from './gl/level';
import { OpenWorldMode } from './modes/side/mode';

export var glob = new class{
    public game: Game;
    public get renderer(){
        return this.game.renderer;
    }
    public get mode(){
        return this.game.active.mode;
    }
    public get level(){
        return this.game.active.level;
    }
    public get storage() {
        return this.mode.storage
    }
}

export class Game {
    public ticker: Ticker;
    public renderer: Renderer;
    private fps: FPS;
    public modes: Record<string, Mode> = {};
    public input: Input;
    public readyToStart: boolean = false;
    private _waitCount: number = 0;
    private started: boolean = false;
    private loader: Loader;
    public total: number = 0;
    public GLR: GLRenderer;
    public active: {
        mode: Mode,
        level: Level,
    } = {
        mode: undefined,
        level: undefined,
    };
    get t(): TickerReturnData {
        return this.renderer.tickerData;
    }
    public get waitCount(): number {
        return this._waitCount;
    }
    public set waitCount(value: number) {
        if (value > this._waitCount) {
            this.total++;
        }
        if (!this.started) {
            if (value === 0 && this.readyToStart) {
                this.start();
            } else {
                this.loader.update(value, this.total);
            }
        }
        this._waitCount = value;

    }

    public constructor() {
        glob.game = this;
        this.build();
    }
    build() {
        this.renderer = new Renderer();

        this.loader = new Loader();
        this.renderer.addChild(this.loader);

        this.GLR = new GLRenderer(this);
        this.setupModes();

        this.ticker = new Ticker();
        this.ticker.add(this.tick.bind(this));
        this.input = new Input(this);
        this.debug();
        this.fps.visible = false;

        if (this.waitCount === 0) {
            this.start();
        } else {
            this.readyToStart = true;
        }
    }

    public tick(obj: TickerReturnData) {
        this.renderer.tick(obj);
    }

    private setupModes() {
        this.addMode('side', new OpenWorldMode());
        this.switchMode('side');
    }

    private debug() {
        this.fps = new FPS();
        this.renderer.appendChild(this.fps);
        this.ticker.add(this.fps.tick.bind(this.fps));
    }

    protected addMode(s: string, mode: Mode) {
        this.modes[s] = mode;
        this.renderer.addMode(mode);
    }

    public switchMode(s: string) {
        document.title = s;
        this.active.mode = this.modes[s];
        Object.entries(this.modes).forEach(([key, mode]) => {
            mode.active = key === s;
        });
    }

    public get mode(): Mode {
        return this.active.mode;
    }
    public get level(): Level {
        return this.active.level;
    }
    public get gl(): WebGLRenderingContext {
        return this.GLR.gl;
    }

    public start() {
        this.started = true;
        this.loader.visible = false;
        this.fps.visible = true;
        this.ticker.start();
    }
}


