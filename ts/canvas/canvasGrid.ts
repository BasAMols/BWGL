
import { Vector2 } from "../utils/vector2";
import { CanvasElement, CanvasElementAttributes, CanvasElementRelativity } from './canvasElement';
import { CanvasImage } from './canvasImage';
import { PreppedImage } from './prepImage';

export type CanvasGridAttributes = CanvasElementAttributes & {
    factor?: number;
    width?: number;
    height?: number;
    json?: string;
};
export type TileData = {
    x: number,
    y: number,
    "type": string;
};
export type SpriteData = {
    "url": string,
    "name": string,
};

export class CanvasGrid extends CanvasElement {
    public type = 'logic' as const;
    public relativity: CanvasElementRelativity = 'relative';

    public factor: number;
    public width: number;
    public height: number;
    public json: string;
    public ready: Boolean = false;
    private sprites: Record<string, PreppedImage> = {};

    public get gridDimentsion(): Vector2 {
        return new Vector2(this.width, this.height);
    }

    public set gridDimentsion(value: Vector2) {
        this.width = value.x;
        this.height = value.y;
    }

    constructor(attr: CanvasGridAttributes = {}) {
        super(attr);
        this.width = attr.width || 10;
        this.height = attr.height || 10;
        this.factor = attr.factor || 10;
        this.json = attr.json;

        CanvasGrid.loadJsonFile(this.json).then(this.jsonLoaded.bind(this));
    }

    private jsonLoaded({ sprites, tiles }: { sprites: SpriteData[], tiles: TileData[]; }) {
        sprites.forEach((sprite) => {
            if (tiles.find((tile) => sprite.name === tile.type)){
                this.sprites[sprite.name] = new PreppedImage({
                    url: sprite.url,
                    factor: this.factor
                });
            }

        });
        tiles.forEach((sprite) => {
            this.addChild(new CanvasImage({
                position: new Vector2(
                    sprite.x * this.factor * 16,
                    (this.height - sprite.y) * this.factor * 16
                ),
                image: this.sprites[sprite.type],
            }));
        });
    }

    private static async loadJsonFile(url: string): Promise<any> {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);
    }

}
