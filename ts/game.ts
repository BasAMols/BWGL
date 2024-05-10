import { FPS } from './utils/debug/fps';
import { Ticker, TickerReturnData } from './utils/ticker';
import { Input } from './utils/input';
import { Mode } from './utils/mode';
import { Renderer } from './dom/renderer';
import { Loader } from './utils/debug/loader';
import { GLRenderer } from './gl/glRenderer';
import { Level } from './utils/level';
import { SideMode } from './modes/side/sideMode';

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
        this.build();
    }
    build() {
        this.renderer = new Renderer(this);

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
        // this.addMode('snakes', new SnakeMode());
        // this.addMode('rpg', new RPGMode());
        this.addMode('side', new SideMode());
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
        // this.addChild(new DomButton({
        //     text: 'RPG',
        //     fontSize: 39,
        //     fontWeight: 1000,
        //     color: 'white',
        //     position: new Vector2(130, 5),
        //     size: new Vector2(65, 50),
        //     background: '#ff00ffaa',
        //     fontFamily: 'monospace',
        //     padding: [0, 10, 0, 10],
        //     onClick: () => {
        //         this.switchMode('rpg');
        //     }
        // }));
        // this.addChild(new DomButton({
        //     text: 'SNAKES',
        //     fontSize: 39,
        //     fontWeight: 1000,
        //     color: 'white',
        //     position: new Vector2(220, 5),
        //     size: new Vector2(130, 50),
        //     background: '#ff00ffaa',
        //     fontFamily: 'monospace',
        //     padding: [0, 10, 0, 10],
        //     onClick: () => {
        //         this.switchMode('snakes');
        //     }
        // }));
        // this.addChild(new DomButton({
        //     text: 'TRAIN',
        //     fontSize: 39,
        //     fontWeight: 1000,
        //     color: 'white',
        //     position: new Vector2(375, 5),
        //     size: new Vector2(130, 50),
        //     background: '#ff00ffaa',
        //     fontFamily: 'monospace',
        //     padding: [0, 10, 0, 10],
        //     onClick: () => {
        //         this.switchMode('side');
        //     }
        // }));
    }
}


