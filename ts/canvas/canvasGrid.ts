
import { ElementRelativity } from '../utils/elementPosition';
import { TickerReturnData } from '../utils/ticker';
import { Vector2 } from "../utils/vector2";
import { CanvasAnimation } from './canvasAnimation';
import { CanvasElement, CanvasElementAttributes } from './canvasElement';
import { CanvasImage } from './canvasImage';
import { CanvasPrepSprites } from './canvasPrepSprites';
import { PrepAnimation } from './prepAnimation';
import { PrepImage } from './prepImage';

export type CanvasGridAttributes = CanvasElementAttributes & {
    json: string;
    sprites: CanvasPrepSprites
    factor?: number;
    paralax?: number;
    condition?: (position: Vector2, size: Vector2)=>void
};
export type TileData = {
    x: number,
    y: number,
    "type": string;
};
export class CanvasGrid extends CanvasElement {
    public type = 'logic' as const;
    public relativity: ElementRelativity = 'anchor';

    public factor: number;
    public json: string;
    public ready: Boolean = false;
    private spritesData: CanvasPrepSprites;
    private paralax: number;
    condition: (position: Vector2, size: Vector2) => void;

    constructor(attr: CanvasGridAttributes) {
        super(attr);
        this.factor = attr.factor || 10;
        this.json = attr.json;
        this.spritesData = attr.sprites;
        this.paralax = attr.paralax || 0;
        this.condition = attr.condition;
    }

    public build(): void {
        CanvasGrid.loadJsonFile(this.json).then(this.jsonLoaded.bind(this));
        this.game.waitCount++;
    }

    private jsonLoaded(tiles: TileData[]) {
        tiles.forEach((tile) => {
            
            if (this.spritesData.sprites[tile.type].type === 'image'){
                this.addChild(new CanvasImage({
                    position: new Vector2(
                        tile.x * this.factor,
                        tile.y * this.factor
                    ),
                    image: this.spritesData.sprites[tile.type] as PrepImage,
                    condition: this.condition?this.condition:null
                }));
            } else {
                this.addChild(new CanvasAnimation({
                    position: new Vector2(
                        tile.x * this.factor,
                        tile.y * this.factor
                    ),
                    animation: this.spritesData.sprites[tile.type] as PrepAnimation,
                }));
            }
        });

        this.game.waitCount--
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        this.x = (this.paralax * this.level.x);
    }

    private static async loadJsonFile(url: string): Promise<any> {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

}
