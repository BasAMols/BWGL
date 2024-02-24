import { CanvasWrapper } from './canvas/canvasWrapper';
import { Renderer } from './utils/renderer';
import { FPS } from './utils/debug/fps';
import { SwapperMode } from './modes/swapper/swapper';
import { Ticker } from './utils/ticker';
import { Event } from './utils/event';
import { Vector2 } from './utils/vector2';
import { Input } from './utils/input';
import { Mode } from './utils/mode';

export class Game extends CanvasWrapper {
    public ticker: Ticker;
    public renderer: Renderer;
    private fps: FPS;
    public modes: Record<string, Mode> = {};
    public game = this;
    public ctx: any;
    public hasDom = true;
    public input: Input;
    
    public constructor()  {
        super({hasDom: true});
        this.game = this;
        this.addEvent(new Event('resize'));
        window.addEventListener("resize", ()=>{this.resize()});
        this.build();
        this.resize();
    }
    build() {
        this.renderer = new Renderer();
        this.addChild(this.renderer);

        this.addMode('swapper', new SwapperMode())

        this.ticker = new Ticker();
        this.ticker.add(this.tick.bind(this));

        this.input = new Input(this);

        this.debug();
        this.start();   
        this.resize();
    }

    resize() {
        this.game.getEvent('resize').alert(new Vector2(document.body.clientWidth,document.body.clientHeight));
    }

    private debug() {
        this.fps = new FPS();
        this.dom.appendChild(this.fps);
        this.ticker.add(this.fps.tick.bind(this.fps));
    }

    
    public addMode(s: string, mode: Mode) {
        this.modes[s] = mode;
        this.renderer.addChild(mode);
    }

    public switchMode(s:string){
        Object.entries(this.modes).forEach(([key, mode])=>{
            mode.active = key === s;
            mode.visible = key === s;
        });
    }

    private start() {
        this.switchMode('swapper');
        this.ticker.start();
    }
}


