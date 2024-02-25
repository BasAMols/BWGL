import { CanvasWrapper } from './canvas/canvasWrapper';
import { Renderer } from './utils/renderer';
import { FPS } from './utils/debug/fps';
import { SnakeMode } from './modes/swapper/snakeMode';
import { Ticker } from './utils/ticker';
import { Event } from './utils/event';
import { Vector2 } from './utils/vector2';
import { Input } from './utils/input';
import { Mode } from './utils/mode';
import { Topdown } from './modes/topdown/topdown';
import { DomButton } from './dom/domButton';

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

        this.setupModes();

        this.ticker = new Ticker();
        this.ticker.add(this.tick.bind(this));

        this.input = new Input(this);

        this.debug();
        this.start();  
        this.resize();
    }

    private setupModes() {
        this.addMode('snakes', new SnakeMode());
        this.addMode('topdown', new Topdown());

        this.dom.appendChild(new DomButton({
            text: 'RPG',
            fontSize: 39,
            fontWeight: 1000,
            color: 'white',
            position: new Vector2(130, 5),
            size: new Vector2(65, 50),
            background: '#ff00ffaa',
            fontFamily: 'monospace',
            padding: [0, 10, 0, 10],
            onClick: () => {
                this.switchMode('topdown');
            }
        }));
        this.dom.appendChild(new DomButton({
            text: 'SNAKES',
            fontSize: 39,
            fontWeight: 1000,
            color: 'white',
            position: new Vector2(220, 5),
            size: new Vector2(130, 50),
            background: '#ff00ffaa',
            fontFamily: 'monospace',
            padding: [0, 10, 0, 10],
            onClick: () => {
                this.switchMode('snakes');
            }
        }));

        this.switchMode('snakes');
    }

    resize() {
        this.game.getEvent('resize').alert(new Vector2(document.body.clientWidth,document.body.clientHeight));
    }

    private debug() {
        this.fps = new FPS();
        this.dom.appendChild(this.fps);
        this.ticker.add(this.fps.tick.bind(this.fps));
    }

    
    protected addMode(s: string, mode: Mode) {
        this.modes[s] = mode;
        this.renderer.addChild(mode);
    }

    public switchMode(s:string){
        Object.entries(this.modes).forEach(([key, mode])=>{
            mode.active = key === s;
            mode.visible = key === s;
            mode.dom?mode.dom.visible = key === s: null;
        });
    }

    public start() {
        this.ticker.start();
    }
}


