import { CanvasElement } from '../elements/canvas/canvasElement';
import { DomElement } from '../elements/dom/domElement';
import { Game } from '../game';

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
        this.canvas = game.renderer;
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
        this.canvas.addEventListener('keydown', this.keyDown.bind(this));
        this.canvas.addEventListener('keyup', this.keyUp.bind(this));
        
    }

    public mouseMove(e: MouseEvent) {
        this.send('mouseMove', e); 
    }

    public keyDown(e: KeyboardEvent) {
        this.send('keyDown', e);
    }

    public keyUp(e: KeyboardEvent) {
        this.send('keyUp', e);
    }

    private send(event:inputEvents, e: KeyboardEvent|MouseEvent){
        Object.values(this.game.modes).forEach((mode) => this.recursive(event, mode, e));
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