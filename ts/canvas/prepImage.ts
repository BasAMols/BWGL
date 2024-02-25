import { Vector2 } from '../utils/vector2';

export type PreppedImageAttributes = {
    factor?: number;
    url: string;
};
export class PreppedImage {
    public original: HTMLImageElement;
    public image: HTMLImageElement;
    public get size(): Vector2 {
        return new Vector2(this.width, this.height);
    }
    public get width() { return this.image.width; }
    public get height() { return this.image.height; }

    private factor: number;
    public ready: boolean = false;

    constructor(attr: PreppedImageAttributes) {
        this.factor = attr.factor;
        this.original = new Image();
        this.original.src = attr.url;
        this.original.onload = () => {
            if (this.factor) {
                this.upScale();
            } else {
                this.loaded(this.original);
            }
        };
    }

    protected upScale() {
        const os = document.createElement('canvas');
        os.width = this.original.width;
        os.height = this.original.height;
        const osCTX = os.getContext('2d', { alpha: true});

        osCTX.drawImage(this.original, 0, 0, this.original.width, this.original.height);

        const ss = document.createElement('canvas');
        ss.width = this.factor * this.original.width;
        ss.height = this.factor * this.original.height;
        const ssCTX = ss.getContext('2d');

        for (let x = 0; x < this.original.width; x++) {
            for (let y = 0; y < this.original.height; y++) {
                const r = osCTX.getImageData(x, y, 1, 1).data.join(',');
                ssCTX.fillStyle = `rgba(${r})`;
                ssCTX.fillRect(
                    x * this.factor,
                    y * this.factor,
                    this.factor,
                    this.factor
                );
            }
        }

        const newI = new Image();
        newI.src = ss.toDataURL();
        
        newI.onload = () => {
            this.loaded(newI);
        };
    }

    protected loaded(i: HTMLImageElement) {
        this.image = i;
        this.ready = true;
    }

}
