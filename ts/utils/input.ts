import { CanvasElement } from '../canvas/canvasElement';
import { DomElement } from '../dom/domElement';
import { Game } from '../game';
import { Mode } from './mode';

export type inputEvents = 'mouseMove'|'keyDown'|'keyUp';
export type inputEventsData = {
    'mouseMove': MouseEvent,
    'keyDown': KeyboardEvent,
    'keyUp': KeyboardEvent,
}
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
        this.recursive('mouseMove', this.game.renderer, e); 
    }

    public keyDown(e: KeyboardEvent) {
        this.recursive('keyDown', this.game.renderer, e);
    }

    public keyUp(e: KeyboardEvent) {
        this.recursive('keyUp', this.game.renderer, e);
    }

    private recursive(event:inputEvents, element: CanvasElement, e: KeyboardEvent|MouseEvent) {
        if (element.active) {
            if (element[event]) {
                if (event === 'mouseMove') {
                    element[event](e as MouseEvent);
                } else {
                    element[event](e as KeyboardEvent);
                }
            }
            element.lowerChildren.forEach((child) => this.recursive(event, child, e));
            element.controllers.forEach((child) => this.recursive(event, child, e));
        }
    }
}