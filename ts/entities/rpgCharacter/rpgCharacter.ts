import { CanvasElementRelativity } from '../../canvas/canvasElement';
import { CanvasGrid } from '../../canvas/canvasGrid';
import { CanvasWrapper } from '../../canvas/canvasWrapper';
import { CanvasController } from '../../utils/controller';
import { TickerReturnData } from '../../utils/ticker';
import { Vector2 } from '../../utils/vector2';

export class RPGCharacter extends CanvasWrapper {
    private scale: number;
    public relativity: CanvasElementRelativity = 'anchor';

    constructor({
        scale = 1,
        position = Vector2.zero,
        controllers = []
    }: {
        scale?: number;
        position?: Vector2;
        controllers?: CanvasController[];
    } = {}) {
        super({
            position,
            controllers,
        });
        this.scale = scale;
    }

    build() {
        this.addChild(new CanvasGrid({ json: '/json/overworld/overlay.json', width: 19, height: 19, factor: this.scale }));
    }

    public tick(o: TickerReturnData) {
        super.tick(o);
    }
}
