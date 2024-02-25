import { DomElement } from '../dom/domElement';
import { Game } from '../game';
import { Mode } from './mode';

export class Input {
    private canvas: DomElement<"canvas">;
    private game: Game;
    public constructor(game: Game) {
        this.game = game;
        this.canvas = game.renderer.canvas;
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
        this.canvas.addEventListener('keydown', this.keyDown.bind(this));
        this.canvas.addEventListener('keyup', this.keyUp.bind(this));

    }

    public mouseMove(e: MouseEvent) {
        const mode = this.getMode();
        if (mode && mode.mouseMove){
            mode.mouseMove(e);
        }
    }

    public keyDown(e: KeyboardEvent) {
        const mode = this.getMode();
        if (mode && mode.keyDown){
            mode.keyDown(e);
        }
    }

    public keyUp(e: KeyboardEvent) {
        const mode = this.getMode();
        if (mode && mode.keyUp){
            mode.keyUp(e);
        }
    }

    private getMode(): Mode {
        return Object.values(this.game.modes).find((l)=>l.active);
    }
}