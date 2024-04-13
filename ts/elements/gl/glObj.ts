import { Color } from '../../utils/colors';
import { GlElementType } from '../../utils/gl';
import { Vector3 } from '../../utils/vector3';
import { GlElementAttributes } from './glElement';
import { GLRendable } from './glRendable';
import { GLTexture } from './glTexture';

export type GLobjAttributes = GlElementAttributes & {
    url?: string;
};
export type textureCoords = [number, number];
export type vertexCoords = [number, number, number];
export type vertexData = [vertexCoords, number, vertexCoords, string];
export type faceData = [vertexData, vertexData, vertexData];
export class GLobj extends GLRendable {
    public type: GlElementType = 'mesh';
    public texture: GLTexture;
    public verticesCount: number = 0;
    private matIndeces: string[] = [];
    private mats: Record<string, string[]> = {};
    private positionIndeces: number[] = [];
    private indexIndeces: number[] = [];
    private normalIndeces: number[] = [];
    private textureIndeces: number[] = [];
    private texturePositionIndeces: number[] = [];

    constructor(attr: GLobjAttributes = {}) {
        super({ ...attr, ...{ autoReady: false } });

        this.loadFile(`${window.location.href}/obj/${attr.url}`)
            .then(this.parseMtl.bind(this))
            .then(this.parseObj.bind(this))
            .then(() => {
                this.ready();
            });

    }

    public build(): void {
        super.build();
    }

    private async parseMtl(str: string) {
        if (/mtllib/.test(str)) {
            await this.loadFile(`${window.location.href}obj/${str.split(/mtllib/)[1].split(/(?: |\n)/)[1]}`)
                .then((v) => {
                    v.split('newmtl ').slice(1).forEach((s: string) => {
                        const l = s.split('\n');
                        this.mats[l.shift()] = l;
                    });
                });

            return str;

        } else {
            return str;
        }
    }

    private parseFaces(lineArray: string[], mat: string, points: vertexCoords[], normals: vertexCoords[], tCoords: textureCoords[]) {
        const textRemainder = lineArray.slice(1);
        const numbRemainder = textRemainder.map(Number);
        (({
            usemtl: () => {
                mat = textRemainder[0];
            },
            f: () => {
                if (numbRemainder.length === 3) {

                    this.positionIndeces.push(...points[numbRemainder[0] - 1]);
                    this.positionIndeces.push(...points[numbRemainder[1] - 1]);
                    this.positionIndeces.push(...points[numbRemainder[2] - 1]);

                } else if (numbRemainder.length === 6) {

                    this.positionIndeces.push(...points[numbRemainder[0] - 1]);
                    this.positionIndeces.push(...points[numbRemainder[2] - 1]);
                    this.positionIndeces.push(...points[numbRemainder[4] - 1]);
                    this.textureIndeces.push(numbRemainder[1] - 1);
                    this.textureIndeces.push(numbRemainder[3] - 1);
                    this.textureIndeces.push(numbRemainder[5] - 1);

                } else {
                    this.positionIndeces.push(...points[numbRemainder[0] - 1]);
                    this.positionIndeces.push(...points[numbRemainder[3] - 1]);
                    this.positionIndeces.push(...points[numbRemainder[6] - 1]);
                    this.textureIndeces.push(
                        ...GLTexture.textureOffset(Object.keys(this.mats).indexOf(mat), Object.keys(this.mats).length)
                    );
                    this.normalIndeces.push(...normals[numbRemainder[2] - 1]);
                    this.normalIndeces.push(...normals[numbRemainder[5] - 1]);
                    this.normalIndeces.push(...normals[numbRemainder[8] - 1]);
                }

                this.indexIndeces.push(this.indexIndeces.length);
                this.indexIndeces.push(this.indexIndeces.length);
                this.indexIndeces.push(this.indexIndeces.length);
                this.matIndeces.push(mat);
                this.matIndeces.push(mat);
                this.matIndeces.push(mat);
                // this.texturePositionIndeces.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);

            },
        } as Record<string, () => void>)[lineArray[0]] || (() => { }))();

        return mat;
    }

    private parseObj(str: string) {
        let mat = 'none';
        const lines = str.split("\n");
        const nonVertex: string[][] = [];
        const points: vertexCoords[] = [];
        const normals: vertexCoords[] = [];
        const tCoords: textureCoords[] = [];

        lines.forEach(async (line) => {
            const words = line.split(/(?: |\/)/);
            const command = words[0];
            const numbers = words.slice(1).map(Number);

            if (command === 'v') {
                points.push([numbers[0], numbers[1], numbers[2]]);
            } else if (command === 'vn') {
                normals.push([numbers[0], numbers[1], numbers[2]]);
            } else if (command === 'vt') {
                tCoords.push([numbers[0], numbers[1]]);
            } else {
                nonVertex.push(words);
            }

        });

        nonVertex.forEach((words) => {
            mat = this.parseFaces(words, mat, points, normals, tCoords);
        });

        this.verticesCount = this.indexIndeces.length;
    }

    public async loadFile(url: string): Promise<any> {
        const response = await fetch(url);
        const data = await response.text();
        return data;
    }

    protected indexBuffer() {
        return this.getIndexBuffer(this.indexIndeces);
    }

    protected positionBuffer(size: Vector3) {
        return this.getPositionBuffer(this.positionIndeces.map((n, i) => n * size.array[i % 3]));
    }

    protected normalBuffer() {
        return this.getNormalBuffer(this.normalIndeces);
    }

    protected textureBuffer(size: Vector3) {
        if (Object.values(this.mats).length) {
            this.texture = new GLTexture(this.game, { color: Object.values(this.mats).map((s) => [...s[2].slice(3).split(' ').map(Number), Number(s[6].slice(2))] as Color) });
        } else {
            this.texture = new GLTexture(this.game, {});
        }
        // this.textureIndeces = [
        //     // select the top left image
        //     0, 0,
        //     0, 1,
        //     0.166666, 0,
        //     0, 1,
        //     0.166666, 0,
        //     0.166666, 1,
        //     // select the top middle image
        //     0.166666, 0,
        //     0.166666, 1,
        //     0.333333, 0,
        //     0.166666, 1,
        //     0.333333, 0,
        //     0.333333, 1,
        //     // select to top right image
        //     0.333333, 0,
        //     0.333333, 1,
        //     0.50, 0,
        //     0.333333, 1,
        //     0.50, 0,
        //     0.50, 1,
        //     // select the bottom left image
        //     0.50, 0,
        //     0.50, 1,
        //     0.666666, 0,
        //     0.50, 1,
        //     0.666666, 0,
        //     0.666666, 1,
        //     // select the bottom middle image
        //     0.666666, 0,
        //     0.666666, 1,
        //     0.833333, 0,
        //     0.666666, 1,
        //     0.833333, 0,
        //     0.833333, 1,
        //     // select the bottom right image
        //     0.833333, 0,
        //     0.833333, 1,
        //     1.00, 0,
        //     0.833333, 1,
        //     1.00, 0,
        //     1.00, 1,
        // ];
        return this.getTextureBuffer(this.textureIndeces);
    }
}