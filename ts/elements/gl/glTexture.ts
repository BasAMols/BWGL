import { Game } from '../../game';

export type GLTextureAttributes = {
    url?: string;
    color?: [number,number,number,number];
};

export class GLTexture {
    public texture: WebGLTexture;
    private image: HTMLImageElement;
    constructor(public game: Game, attr: GLTextureAttributes) {
        this.image = new Image();
        if (attr.url) {
            this.game.waitCount++;
            this.image.onload = () => {
                this.game.waitCount--;
                this.loadTexture();
            };
            this.image.src = `${window.location.href}/tex/${attr.url}`;
        } else {
            this.loadColor(attr.color || [0.2,0.2,0.3,.5]);
        }
    }
    loadColor([r,g,b,a]: [number,number,number,number]) {
        const gl = this.game.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([r*255, g*255, b*255, a*255])
        );
        this.texture = texture;
    }
    loadTexture() {
        const gl = this.game.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this.image
        );
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

        if (this.isPowerOf2(this.image.width) && this.isPowerOf2(this.image.height)) {
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