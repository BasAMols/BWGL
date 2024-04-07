import { CanvasElement } from '../elements/canvas/canvasElement';
import { DomCanvas } from '../elements/dom/domCanvas';
import { GlElement } from '../elements/gl/glElement';
import { Game } from '../game';

export type inputEvents = 'mouseMove' | 'keyDown' | 'keyUp' | 'click' | 'scroll';
export type inputEventsData = {
    'mouseMove': MouseEvent,
    'keyDown': KeyboardEvent,
    'keyUp': KeyboardEvent,
    'click': MouseEvent,
    'scroll': WheelEvent,
};
export class Input {
    private canvas: DomCanvas;
    private game: Game;
    private locked: boolean;
    public constructor(game: Game) {
        this.game = game;
        this.canvas = game.renderer;
        this.canvas.dom.addEventListener('mousemove', this.mouseMove.bind(this));
        this.canvas.dom.addEventListener('keydown', this.keyDown.bind(this));
        this.canvas.dom.addEventListener('keyup', this.keyUp.bind(this));
        this.canvas.dom.addEventListener('click', this.mouseClick.bind(this));
        this.canvas.dom.addEventListener('wheel', this.scroll.bind(this));

        document.addEventListener('pointerlockchange', () => {
            this.locked = (document.pointerLockElement === this.canvas.dom);
        });

    }

    public mouseClick(e: MouseEvent) {
        if (this.locked) {
            this.send('click', e);
        } else {
            this.canvas.dom.requestPointerLock();
        }
    }
    public mouseMove(e: MouseEvent) {
        if (this.locked) {
            this.send('mouseMove', e);
        }

    }

    public scroll(e: WheelEvent) {
        if (this.locked) {
            this.send('scroll', e);
        }

    }

    public keyDown(e: KeyboardEvent) {
        if (this.locked) {
            this.send('keyDown', e);
        }
    }

    public keyUp(e: KeyboardEvent) {
        if (this.locked) {
            this.send('keyUp', e);
        }
    }

    private send(event: inputEvents, e: KeyboardEvent | MouseEvent) {
        Object.values(this.game.modes).forEach((mode) => this.recursive(event, mode, e));
    }

    private recursive(event: inputEvents, element: CanvasElement | GlElement, e: KeyboardEvent | MouseEvent | WheelEvent) {
        if (element.active) {
            if (element[event]) {
                if (event === 'mouseMove' || event === 'click') {
                    element[event](e as MouseEvent);
                } else if (event === 'scroll') {
                    element[event](e as WheelEvent);
                } else {
                    element[event](e as KeyboardEvent);
                }
            }
            if (element.rendererType !== 'gl') {
                element.lowerChildren.forEach((child) => this.recursive(event, child, e));
                element.higherChildren.forEach((child) => this.recursive(event, child, e));
                element.glElements.forEach((child) => this.recursive(event, child, e));
            }
            element.controllers.forEach((child) => this.recursive(event, child, e));
        }
    }
}