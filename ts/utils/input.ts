import { DomElement } from '../dom/domElement';
import { Game } from '../game';

export class Input {
    private canvas: DomElement<"canvas">;
    private game: Game;
    public constructor(game: Game) {
        this.game = game;
        this.canvas = game.renderer.canvas;
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    }

    public mouseMove(e: MouseEvent) {
        const mode = this.getmode();
        if (mode && mode.mouseMove){
            mode.mouseMove(e);
        }
    }

    private getmode() {
        return Object.values(this.game.modes).find((l)=>l.active);
    }
}