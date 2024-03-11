import { CanvasWrapper } from './elements/canvasWrapper';
import { FPS } from './utils/debug/fps';
import { Ticker, TickerReturnData } from './utils/ticker';
import { Event } from './utils/event';
import { Vector2 } from './utils/vector2';
import { Input } from './utils/input';
import { Mode } from './utils/mode';
import { ElementRelativity } from './utils/elementPosition';
import { DomCanvas } from './elements/domCanvas';
import { SideMode } from './modes/side/SideMode';
import { Loader } from './utils/debug/loader';

export class Game extends CanvasWrapper {
    public relativity: ElementRelativity = 'anchor';
    public ticker: Ticker;
    public renderer: DomCanvas;
    private fps: FPS;
    public modes: Record<string, Mode> = {};
    public game = this;
    public ctx: CanvasRenderingContext2D;
    public input: Input;
    public ready: boolean = false;
    private _waitCount: number = 0;
    private readyToStart: boolean = false;
    private started: boolean = false;
    private loader: Loader;
    public total: number = 0;
    public get waitCount(): number {
        return this._waitCount;
    }
    public set waitCount(value: number) {
        if (value > this._waitCount){
            this.total++;
        }
        if (!this.started){
            if (value === 0 && this.readyToStart) {
                this.start();
            } else {
                this.loader.update(value, this.total);
            }
        }
        this._waitCount = value;

    }

    public constructor() {
        super({ hasDom: true });
        this.game = this;
        this.addEvent(new Event('resize'));
        window.addEventListener("resize", () => { this.resize(); });
        this.build();
    }
    build() {
        this.loader = new Loader();
        this.addChild(this.loader);

        this.renderer = new DomCanvas();
        this.addChild(this.renderer);

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
        this.resize();
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

    resize() {
        this.game.getEvent('resize').alert(new Vector2(document.body.clientWidth, document.body.clientHeight));
    }

    private debug() {
        this.fps = new FPS();
        this.dom.appendChild(this.fps);
        this.ticker.add(this.fps.tick.bind(this.fps));
    }

    protected addMode(s: string, mode: Mode) {
        this.modes[s] = mode;
        mode.parent = this;
        mode.mode = mode;
        this.renderer.addMode(mode);
    }

    public switchMode(s: string) {
        document.title = s;
        Object.entries(this.modes).forEach(([key, mode]) => {
            mode.active = key === s;
            mode.visible = key === s;
            mode.dom ? mode.dom.visible = key === s : null;
        });
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


