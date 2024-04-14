import { Game } from '../game';
import { Color } from '../utils/colors';

export type GLTextureAttributes = {
    url?: string;
    color?: Color[];
};

export class GLTexture {
    static textureOffset(index:number, total:number): number[] {
        const inc = 1 / total;
        return [
            index * inc + (inc / 3), 0,
            index * inc + (inc / 3), 1,
            (index + 1) * inc - (inc / 3), 0
        ];

    }
    public texture: WebGLTexture;
    private image: HTMLImageElement;
    constructor(public game: Game, attr: GLTextureAttributes) {
        this.image = new Image();
        if (attr.url) {
            this.game.waitCount++;
            this.image.onload = () => {
                this.game.waitCount--;
                this.loadTexture(this.image);
            };
            this.image.src = `${window.location.href}/${attr.url}`;
        } else {
            this.loadColor(attr.color || [[0.8, 0.8, 0.7, 1]]);
        }
    }
    loadColor(colors: Color[]) {
        // gl.bindTexture(gl.TEXTURE_2D, texture);
        // gl.texImage2D(
        //     gl.TEXTURE_2D,
        //     0,
        //     gl.RGBA,
        //     1,
        //     1,
        //     0,
        //     gl.RGBA,
        //     gl.UNSIGNED_BYTE,
        //     new Uint8Array([...first.map((n)=>n*255)])
        // );
        // this.texture = texture;


        const ss = document.createElement('canvas');
        ss.width = colors.length;
        ss.height = 1;
        const ssCTX = ss.getContext('2d');

        for (let x = 0; x < colors.length; x++) {
            const color = colors[x];
            ssCTX.fillStyle = `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${color[3]})`;
            ssCTX.fillRect(
                x,
                0,
                1,
                1
            );
        }
        this.loadTexture(ss);

    }
    loadTexture(img: HTMLImageElement | HTMLCanvasElement) {
        const gl = this.game.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
        );
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        if (this.isPowerOf2(img.width) && this.isPowerOf2(img.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        this.texture = texture;
    }

    isPowerOf2(value: number) {
        return (value & (value - 1)) === 0;
    }
}