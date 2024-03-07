import { Game } from '../game';
import { Vector2 } from '../utils/vector2';

export type PrepImageAttributes = {
    factor?: number;
    url: string;
    image?: HTMLImageElement;
    cropSize?: Vector2,
    cropPosition?: Vector2,
};
export class PrepImage {
    private game: Game;
    public type: 'image' = 'image';
    public original: HTMLImageElement;
    public image: HTMLImageElement;
    protected cropSize: Vector2;
    protected cropPosition: Vector2;
    public get size(): Vector2 {
        return new Vector2(this.width, this.height);
    }
    public get width() { return this.image.width; }
    public get height() { return this.image.height; }

    public factor: number;
    public ready: boolean = false;

    constructor(attr: PrepImageAttributes, game: Game) {
        this.game = game;
        this.cropSize = attr.cropSize;
        this.cropPosition = attr.cropPosition || Vector2.zero;
        this.factor = attr.factor || 1;

        if (attr.image) {
            this.original = attr.image;
            this.upScale();
        } else {
            this.original = new Image();
            this.original.src = attr.url;
            this.game.waitCount++;
            this.original.onload = () => {
                this.game.waitCount--;
                this.upScale();
            };
        }
    }

    protected upScale() {
        this.game.waitCount++;
        const originalSize = this.cropSize || new Vector2(this.original.width, this.original.height);
        const newSize = originalSize.scale(this.factor);

        const os = document.createElement('canvas');
        os.width = newSize.x;
        os.height = newSize.y;
        const osCTX = os.getContext('2d', { alpha: true, willReadFrequently: true });

        osCTX.drawImage(this.original, this.cropPosition.x, this.cropPosition.y, originalSize.x, originalSize.y, 0, 0, originalSize.x, originalSize.y);

        const ss = document.createElement('canvas');
        ss.width = newSize.x;
        ss.height = newSize.y;
        const ssCTX = ss.getContext('2d', { willReadFrequently: true });

        for (let x = 0; x < originalSize.x; x++) {
            for (let y = 0; y < originalSize.y; y++) {
                const r = osCTX.getImageData(x, y, 1, 1, { colorSpace: "srgb" });
                ssCTX.fillStyle = `rgba(${r.data[0]}, ${r.data[1]}, ${r.data[2]}, ${r.data[3] / 255})`;
                ssCTX.fillRect(
                    Math.round(x * this.factor),
                    newSize.y - Math.round(y * this.factor),
                    Math.round(this.factor),
                    Math.round(this.factor) * -1
                );
            }
        }

        const newI = new Image();
        newI.src = ss.toDataURL();

        newI.onload = () => {
            this.game.waitCount--;
            this.loaded(newI);
        };
    }

    protected loaded(i: HTMLImageElement) {
        this.image = i;
        this.ready = true;
    }

}
