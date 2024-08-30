import { Color } from '../util/colors';
import { GlElementType } from '../rendering/glRenderer';
import { Vector3 } from '../math/vector3';
import { GlElementAttributes } from '../elementBase';
import { GLRendable } from '../rendable';
import { GLTexture } from '../texture';
import { glob } from '../../game';
import * as FBXParser from 'fbx-parser';
import { FBXNode, FBXReader } from 'fbx-parser';
import { Util } from '../util/utils';

export type matData = Record<string, string[]>;

export type GLobjAttributes = GlElementAttributes & {
    url?: string;
    opacity?: number;
    colorIntensity?: number;
    overrideTextureURL?: string;
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
    private matsData: Record<string, matData> = {};
    private positionIndeces: number[] = [];
    private indexIndeces: number[] = [];
    private normalIndeces: number[] = [];
    private textureIndeces: number[] = [];
    private texturePositionIndeces: number[] = [];
    path: string;
    overrideTextureURL: string;

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
        this.overrideTextureURL = attr.overrideTextureURL;

        this.path = attr.url.split('/').slice(0, -1).join('/') + '/';

        if (attr.url.includes('fbx')) {
            if (glob.storage.register(attr.url, this)) {
                this.loadFBX(`${window.location.href}/obj/${attr.url}`, (reader) => {
                    this.ready();
                });
            }
        } else {
            if (glob.storage.register(attr.url, this)) {
                this.loadFile(`${window.location.href}/obj/${attr.url}`)
                    .then(this.parseMtl.bind(this))
                    .then(this.parseObj.bind(this))
                    .then(() => {
                        this.ready();
                        glob.storage.loaded(attr.url);
                    });
            }
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
                        ...GLTexture.textureOffset(Object.keys(this.matsData).indexOf(mat), Object.keys(this.matsData).length)
                    );
                }

                this.indexIndeces.push(this.indexIndeces.length);
                this.indexIndeces.push(this.indexIndeces.length);
                this.indexIndeces.push(this.indexIndeces.length);
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

    private async loadFBX(url: string, done?: (fbx: FBXReader) => void) {
        let reader = new FileReader();

        const response = await fetch(url);
        reader.readAsArrayBuffer(await response.blob());
        reader.addEventListener('load', () => {
            let fbx = new FBXParser.FBXReader(FBXParser.parseBinary(new Uint8Array(reader.result as ArrayBuffer)));
            this.parsePBX(fbx);
            if (done) done(fbx);
        });
    }

    private static byName(node: FBXParser.FBXNode, name: any): FBXParser.FBXNode {
        return node.nodes.find((o) => o.name === name);
    }
    private static byProp(node: FBXParser.FBXNode, name: any, index: number = 0): FBXParser.FBXNode {
        return node.nodes.find((o) => o.props[index] === name);
    }

    private parsePBX(reader: FBXReader) {
        const fbx = reader.fbx;
        console.log(fbx);

        const objs = GLobj.byName(reader.fbxNode, 'Objects');

        const globalSettings: Record<string, unknown> = Object.fromEntries(Object.values(GLobj.byName(reader.fbxNode, "GlobalSettings").nodes[1].nodes).map((n) => ([n.props[0], n.props[4]])));

        // Models and Geometry
        const linked: Record<number, {
            model?: FBXNode,
            material?: FBXNode,
            geometry?: FBXNode,
            texture?: FBXNode,
        }> = {};

        GLobj.byName(reader.fbxNode, "Connections").nodes.forEach((c) => {
            const a = c.props[1];
            const b = c.props[2];

            if (a && b) {
                const aNode = GLobj.byProp(objs, a);
                const bNode = GLobj.byProp(objs, b);

                console.log(aNode, bNode);


                if (bNode.name === 'Model') {
                    let obj = linked[bNode.props[0] as number];
                    if (!obj) {
                        obj = {
                            model: bNode
                        };
                        linked[bNode.props[0] as number] = obj;
                    }
                    if (aNode.name === 'Geometry') obj.geometry = aNode;
                    if (aNode.name === 'Material') {
                        obj.material = aNode;
                        obj.texture = GLobj.byProp(objs, GLobj.byProp(GLobj.byName(reader.fbxNode, "Connections"), a, 2)?.props[1] || 0);
                    }
                    if (aNode.name === 'Texture') obj.texture = aNode;



                }
            }
        });

        Object.values(linked).forEach((obj) => {
            const props = GLobj.byName(obj.material, 'Properties70');
            const out: matData = {
                ka: ['1.000000', '1.000000', '1.000000'],
                Kd: GLobj.byProp(props, 'DiffuseColor').props.slice(4).map(String),
                Ke: ['0.000000', '0.000000', '0.000000'],
                Ks: ['0.500000', '0.500000', '0.500000'],
                Ni: ['1.450000'],
                Ns: ['250.000000'],
                d: ['1.000000'],
                illum: ['2'],
            };
            if (obj.texture) {
                out.map_kd = GLobj.byName(obj.texture, 'RelativeFilename').props as [string];
            }

            this.matsData[(obj.material.props[1] as string).split('::')[1]] = out;
        });


        Object.values(linked).forEach(({ model, material, geometry, texture }) => {
            const matIndex = Object.keys(this.matsData).indexOf((material.props[1] as string).split('::')[1]);

            // UV
            const uvBlob = GLobj.byName(geometry, 'LayerElementUV');
            const uv = Util.chunk(GLobj.byName(uvBlob, 'UV').props[0] as number[], 2) as [number, number][];

            (GLobj.byName(uvBlob, 'UVIndex').props[0] as number[]).forEach((v) => {
                this.texturePositionIndeces.push(...uv[v]);
            });

            // Normals
            const normalBlob = GLobj.byName(geometry, 'LayerElementNormal');
            const normals = Util.chunk(GLobj.byName(normalBlob, 'Normals').props[0] as number[], 3) as [number, number, number][];

            (GLobj.byName(normalBlob, 'NormalsIndex').props[0] as number[]).forEach((v) => {
                this.normalIndeces.push(normals[v][0], normals[v][2], normals[v][1],);
            });

            //Polygons
            const modelTScale = (GLobj.byProp(model.nodes[1], 'Lcl Scaling')?.props.slice(4) || [1, 1, 1]) as [number, number, number];

            let modelTranslation = (GLobj.byProp(model.nodes[1], 'Lcl Translation')?.props.slice(4) || [0, 0, 0]) as [number, number, number];
            modelTranslation = modelTranslation.map((v, i) => (v as number)) as [number, number, number];

            let verts = Util.chunk(GLobj.byName(geometry, 'Vertices').props[0] as number[], 3) as [number, number, number][];
            verts = verts.map((v) => ([
                (((v[0] * modelTScale[0]) + modelTranslation[0]) / 100),
                (((v[2] * modelTScale[2]) + modelTranslation[2]) / 100),
                (((v[1] * modelTScale[1] * -1) + modelTranslation[1]) / 100),
            ] as [number, number, number]));

            (GLobj.byName(geometry, 'PolygonVertexIndex').props[0] as number[]).forEach((vi) => {
                this.positionIndeces.push(...verts[vi < 0 ? Math.abs(vi) - 1 : vi]);
                this.indexIndeces.push(this.indexIndeces.length);
            });
            this.textureIndeces.push(
                ...GLTexture.textureOffset(matIndex, Object.keys(this.matsData).length)
            );

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
            const matImage = matArray.find((m) => m.map_kd);



            if (this.overrideTextureURL) {
                this.texture = new GLTexture(this.game, {
                    url: `obj/${this.path}${this.overrideTextureURL}`,
                });
                return this.texturePositionIndeces;
            }
            if (matImage) {
                this.texture = new GLTexture(this.game, {
                    url: `obj/${this.path}${matImage.map_kd.join(' ').trim()}`,
                });
                return this.texturePositionIndeces;
            } else {
                this.texture = new GLTexture(this.game, {
                    color: matArray.map((m) => [
                        ...(m.Kd ? m.Kd.map(Number) : [0, 0, 0]),
                        m.d ? Number(m.d[0]) : 1] as Color)
                });
                return this.textureIndeces;

            }

        }

        // return this.texturePositionIndeces;
    }
}