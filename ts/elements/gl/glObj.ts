import { Color } from '../../utils/colors';
import { GlElementType } from '../../utils/gl';
import { Vector3 } from '../../utils/vector3';
import { GlElementAttributes } from './glElement';
import { GLRendable } from './glRendable';
import { GLTexture } from './glTexture';

export type GLobjAttributes = GlElementAttributes & {
    url?: string;
};
export type vertexCoords = [number, number, number];
export type vertexData = [vertexCoords, number, vertexCoords, string];
export type faceData = [vertexData, vertexData, vertexData];
export class GLobj extends GLRendable {
    public texture: GLTexture;
    public type: GlElementType = 'mesh';
    public verticesCount: number = 0;
    private points: vertexCoords[] = [];
    private faces: faceData[];
    private matIndex: string[] = [];
    private mats: Record<string, string[]> = {};
    private normals: vertexCoords[] = [];
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
            await this.loadFile(`${window.location.href}obj/loco.mtl`)
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

    private parseLine(lineArray: string[], lastMat: string) {
        const textRemainder = lineArray.slice(1);
        const numbRemainder = textRemainder.map(Number);
        let mat = lastMat;
        const f = ({
            usemtl: () => {
                mat = textRemainder[0];
            },
            v: () => {
                this.points.push([numbRemainder[0], numbRemainder[1], numbRemainder[2]]);
            },
            vn: () => {
                this.normals.push([numbRemainder[0], numbRemainder[1], numbRemainder[2]]);
            },
            f: () => {
                this.matIndex.push(mat);
                const a: faceData = [
                    [this.points[numbRemainder[0]-1], numbRemainder[2], this.normals[numbRemainder[2]-1], mat],
                    [this.points[numbRemainder[3]-1], numbRemainder[5], this.normals[numbRemainder[5]-1], mat],
                    [this.points[numbRemainder[6]-1], numbRemainder[8], this.normals[numbRemainder[8]-1], mat]
                ];
                if (this.faces) {
                    this.faces.push(a as faceData);
                } else {
                    this.faces = [a] as faceData[];
                }
            },
            '#': () => {
                console.log(textRemainder);
            }

        } as Record<string, () => void>)[lineArray[0]];

        if (f) {
            f();
        }
        return mat;
    }

    private parseObj(str: string) {
        let mat = 'none';
        str.split("\n").forEach(async (line) => {
            mat = this.parseLine(line.split(/(?: |\/)/), mat);
        });

        let index = 0;
        this.faces.forEach((f) => {
            f.forEach((v) => {
                this.positionIndeces.push(v[0][0],v[0][1],v[0][2]);
                this.textureIndeces.push(v[1] - 1);
                this.normalIndeces.push(v[2][0],v[2][1],v[2][2]);
                this.indexIndeces.push(index);
                index++
            });
            this.texturePositionIndeces.push(0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
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
            this.texture = new GLTexture(this.game, { color: Object.values(this.mats)[0][2].slice(3).split(' ').map(Number) as Color });
        } else {
            this.texture = new GLTexture(this.game, {});
        }

        return this.getTextureBuffer(this.texturePositionIndeces);
    }
}