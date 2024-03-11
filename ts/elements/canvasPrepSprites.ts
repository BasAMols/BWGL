
import { Game } from '../game';
import { CanvasController } from '../utils/controller';
import { ElementRelativity } from '../utils/elementPosition';
import { Vector2 } from "../utils/vector2";
import { PrepAnimation } from './prepAnimation';
import { PrepImage } from './prepImage';

export type CanvasGridAttributes = {
    factor?: number;
    jsons: string[],
    callback?: ()=>void;
};


export interface SpriteImageJSON {
    "name": string,
    "type": 'image',
    "image": SpriteImagePrepData,
};

export interface SpriteImagePrepData{
    "url": string,
};

export interface SpriteAnimationJSON {
    "name": string,
    "type": 'animation'
    "animation": SpriteAnimationPrepData,
};

export interface SpriteAnimationPrepData {
    "urls": string[],
    "interval"?: number,
};



export class CanvasPrepSprites extends CanvasController{
    public type = 'logic' as const;
    public relativity: ElementRelativity = 'relative';

    public factor: number;
    public gridWidth: number;
    public gridHeight: number;
    public jsons: string[];
    public ready: Boolean = false;
    private readyCallback: () => void;
    private spritesLoaded: number = 0;
    private spritesMax: number = 0;
    public sprites: Record<string, PrepImage|PrepAnimation> = {};

    public get gridDimentsion(): Vector2 {
        return new Vector2(this.gridWidth, this.gridHeight);
    }

    public set gridDimentsion(value: Vector2) {
        this.gridWidth = value.x;
        this.gridHeight = value.y;
    }

    constructor(attr: CanvasGridAttributes) {
        super();
        this.factor = attr.factor || 10;
        this.spritesMax = attr.jsons.length;
        this.readyCallback = attr.callback;
        this.jsons = attr.jsons;
    }

    public build(): void {
        this.game.waitCount++
        this.jsons.forEach((json) => {
            this.game.waitCount++
            CanvasPrepSprites.loadJsonFile(json).then(this.jsonLoaded.bind(this));
        });
    }

    private checkReady() {
        if (this.spritesLoaded === this.spritesMax){
            this.ready = true;
            this.game.waitCount--
            this.readyCallback();
        }
    }

    private jsonLoaded(sprites: (SpriteImageJSON|SpriteAnimationJSON)[]) {
        sprites.forEach((sprite) => {
            if (!this.sprites[sprite.name]){
                if (sprite.type === 'image'){
                    this.sprites[sprite.name] = new PrepImage(Object.assign(sprite.image, {factor: this.factor}), this.game);
                } else {
                    this.sprites[sprite.name] = new PrepAnimation(Object.assign(sprite.animation, {factor: this.factor}), this.game);
                }
            }
        });
        this.game.waitCount--
        this.spritesLoaded++;
        this.checkReady();
    }

    public static async loadJsonFile(url: string): Promise<any> {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

}
