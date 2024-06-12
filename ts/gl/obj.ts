import { Color } from '../utils/colors';
import { GlElementType } from './glRenderer';
import { Vector3 } from '../utils/vector3';
import { GlElementAttributes } from './elementBase';
import { GLRendable } from './rendable';
import { GLTexture } from './texture';
import { ObjStorage } from './objStorage';

export type matData = Record<string, string[]>;

export type GLobjAttributes = GlElementAttributes & {
    url?: string;
    storage?: ObjStorage;
    opacity?: number;
    colorIntensity?: number;
};
export type textureCoords = [number, number];
export type vertexCoords = [number, number, number];
export type vertexData = [vertexCoords, number, vertexCoords, string];
export type faceData = [vertexData, vertexData, vertexData];

export type GLObjTransferData = {
    verticesCount: number;
    matIndeces: string[];
    matsData: Record<string, matData>;
    positionIndeces: number[];
    indexIndeces: number[];
    normalIndeces: number[];
    texturePositionIndeces: number[];
};
export class GLobj extends GLRendable {
    public type: GlElementType = 'mesh';
    public texture: GLTexture;
    public verticesCount: number = 0;
    private matIndeces: string[] = [];
    private mats: Record<string, string[]> = {};
    private matsData: Record<string, matData> = {};
    private positionIndeces: number[] = [];
    private indexIndeces: number[] = [];
    private normalIndeces: number[] = [];
    private textureIndeces: number[] = [];
    private texturePositionIndeces: number[] = [];
    path: string;

    public getData(): GLObjTransferData {
        return {
            verticesCount: this.verticesCount,
            matIndeces: this.matIndeces,
            matsData: this.matsData,
            positionIndeces: this.positionIndeces,
            indexIndeces: this.indexIndeces,
            normalIndeces: this.normalIndeces,
            texturePositionIndeces: this.texturePositionIndeces
        };
    }

    public giveData(data: GLObjTransferData) {
        this.verticesCount = data.verticesCount;
        this.matIndeces = data.matIndeces;
        this.matsData = data.matsData;
        this.positionIndeces = data.positionIndeces;
        this.indexIndeces = data.indexIndeces;
        this.normalIndeces = data.normalIndeces;
        this.texturePositionIndeces = data.texturePositionIndeces;
    }

    constructor(attr: GLobjAttributes = {}) {
        super({ ...attr, ...{ autoReady: false } });
        
        this.opacity = attr.opacity !== undefined ? attr.opacity : 1;
        this.colorIntensity = attr.colorIntensity !== undefined ? attr.colorIntensity : 1;

        this.path = attr.url.split('/').slice(0, -1).join('/') + '/';

        if (attr.storage){
            if (attr.storage.register(attr.url, this)) {
                this.loadFile(`${window.location.href}/obj/${attr.url}`)
                    .then(this.parseMtl.bind(this))
                    .then(this.parseObj.bind(this))
                    .then(() => {
                        this.ready();
                        attr.storage.loaded(attr.url);
                    });
            }
        } else {
            this.loadFile(`${window.location.href}/obj/${attr.url}`)
                .then(this.parseMtl.bind(this))
                .then(this.parseObj.bind(this))
                .then(() => {
                    this.ready();
                });
        }
    }

    private async parseMtl(str: string) {
        if (/mtllib/.test(str)) {
            await this.loadFile(`${window.location.href}obj/${this.path}${str.split(/mtllib/)[1].split(/\n/)[0].trim()}`)
                .then((v) => {
                    v.split('newmtl ').slice(1).forEach((s: string) => {
                        const lines = s.split(/\r\n|\r|\n/).filter((n) => n);

                        this.matsData[lines.shift()] = Object.fromEntries(lines.map((line) => {
                            const a = line.split(' ');
                            return [a.shift(), a];
                        }));
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

                    this.texturePositionIndeces.push(...tCoords[numbRemainder[1] - 1]);
                    this.texturePositionIndeces.push(...tCoords[numbRemainder[3] - 1]);
                    this.texturePositionIndeces.push(...tCoords[numbRemainder[5] - 1]);

                } else {
                    this.positionIndeces.push(...points[numbRemainder[0] - 1]);
                    this.positionIndeces.push(...points[numbRemainder[3] - 1]);
                    this.positionIndeces.push(...points[numbRemainder[6] - 1]);

                    this.texturePositionIndeces.push(...tCoords[numbRemainder[1] - 1]);
                    this.texturePositionIndeces.push(...tCoords[numbRemainder[4] - 1]);
                    this.texturePositionIndeces.push(...tCoords[numbRemainder[7] - 1]);

                    this.normalIndeces.push(...normals[numbRemainder[2] - 1]);
                    this.normalIndeces.push(...normals[numbRemainder[5] - 1]);
                    this.normalIndeces.push(...normals[numbRemainder[8] - 1]);

                    this.textureIndeces.push(
                        ...GLTexture.textureOffset(Object.keys(this.mats).indexOf(mat), Object.keys(this.mats).length)
                    );
                }

                this.indexIndeces.push(this.indexIndeces.length);
                this.indexIndeces.push(this.indexIndeces.length);
                this.indexIndeces.push(this.indexIndeces.length);
                this.matIndeces.push(mat);
                this.matIndeces.push(mat);
                this.matIndeces.push(mat);
            },
        } as Record<string, () => void>)[lineArray[0]] || (() => { }))();

        return mat;
    }

    private parseObj(str: string) {
        let mat = 'none';
        const lines = str.split(/\r\n|\r|\n/);
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
        return this.indexIndeces;
    }

    protected positionBuffer(size: Vector3) {
        return this.positionIndeces.map((n, i) => n * size.array[i % 3]);
    }

    protected normalBuffer() {
        return this.normalIndeces;
    }

    protected textureBuffer(size: Vector3) {

        this.texture = new GLTexture(this.game, {});

        if (Object.values(this.matsData).length) {

            const matArray = Object.values(this.matsData);
            const matImage = matArray.find((m) => m.map_Kd);

            if (matImage) {
                this.texture = new GLTexture(this.game, {
                    url: `obj/${this.path}${matImage.map_Kd.join(' ').trim()}`,
                });
            } else {
                this.texture = new GLTexture(this.game, {
                    color: matArray.map((m) => [
                        ...(m.Kd ? m.Kd.map(Number) : [0, 0, 0]),
                        m.d ? Number(m.d[0]) : 1] as Color)
                });
            }

        }

        return this.texturePositionIndeces;
    }
}