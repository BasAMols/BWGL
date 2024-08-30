import { Color } from '../util/colors';
import { GlElementType } from '../rendering/glRenderer';
import { Vector3 } from '../math/vector3';
import { GLRendable } from '../rendable';
import { GLTexture } from '../texture';
import * as FBXParser from 'fbx-parser';
import { FBXNode } from 'fbx-parser';
import { Util } from '../util/utils';

export type matData = Record<string, string[]>;

export type FBXObjectAttributes = {
    model: FBXNode,
    geometry: FBXNode,
    material: FBXNode,
    texture: FBXNode,
    globalSettings: Record<string, unknown>,
    path: string,
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
export class FBXObject extends GLRendable {
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
    private path: string;

    constructor(attr: FBXObjectAttributes) {
        super({ ...attr, ...{ autoReady: false } });

        this.path = attr.path;
        this.parsePBX(
            attr.model,
            attr.material,
            attr.geometry,
            attr.texture,
            attr.globalSettings
        ) 
    }


    private static byName(node: FBXParser.FBXNode, name: any): FBXParser.FBXNode {
        return node.nodes.find((o) => o.name === name);
    }

    private static byProp(node: FBXParser.FBXNode, name: any, index: number = 0): FBXParser.FBXNode {
        return node.nodes.find((o) => o.props[index] === name);
    }

    private parsePBX(model: FBXNode, material: FBXNode, geometry: FBXNode, texture: FBXNode, globalSettings: Record<string, unknown>) {
        const props = FBXObject.byName(material, 'Properties70');
        const out: matData = {
            ka: ['1.000000', '1.000000', '1.000000'],
            Kd: FBXObject.byProp(props, 'DiffuseColor').props.slice(4).map(String),
            Ke: ['0.000000', '0.000000', '0.000000'],
            Ks: ['0.500000', '0.500000', '0.500000'],
            Ni: ['1.450000'],
            Ns: ['250.000000'],
            d: ['1.000000'],
            illum: ['2'],
        };
        if (texture) {
            out.map_kd = FBXObject.byName(texture, 'RelativeFilename').props as [string];
        }

        this.matsData[(material.props[1] as string).split('::')[1]] = out;
        const matIndex = 0;


        // UV
        const uvBlob = FBXObject.byName(geometry, 'LayerElementUV');
        const uv = Util.chunk(FBXObject.byName(uvBlob, 'UV').props[0] as number[], 2) as [number, number][];

        (FBXObject.byName(uvBlob, 'UVIndex').props[0] as number[]).forEach((v) => {
            this.texturePositionIndeces.push(...uv[v]);
        });

        // Normals
        const normalBlob = FBXObject.byName(geometry, 'LayerElementNormal');
        const normals = Util.chunk(FBXObject.byName(normalBlob, 'Normals').props[0] as number[], 3) as [number, number, number][];

        (FBXObject.byName(normalBlob, 'NormalsIndex').props[0] as number[]).forEach((v) => {
            this.normalIndeces.push(normals[v][0], normals[v][2], normals[v][1],);
        });

        //Polygons
        const modelTScale = (FBXObject.byProp(model.nodes[1], 'Lcl Scaling')?.props.slice(4) || [1, 1, 1]) as [number, number, number];

        let modelTranslation = (FBXObject.byProp(model.nodes[1], 'Lcl Translation')?.props.slice(4) || [0, 0, 0]) as [number, number, number];
        modelTranslation = modelTranslation.map((v, i) => (v as number)) as [number, number, number];

        let verts = Util.chunk(FBXObject.byName(geometry, 'Vertices').props[0] as number[], 3) as [number, number, number][];
        verts = verts.map((v) => ([
            (((v[0] * modelTScale[0]) + modelTranslation[0]) / 100),
            (((v[2] * modelTScale[2]) + modelTranslation[2]) / 100),
            (((v[1] * modelTScale[1] * -1) + modelTranslation[1]) / 100),
        ] as [number, number, number]));


        (FBXObject.byName(geometry, 'PolygonVertexIndex').props[0] as number[]).forEach((vi) => {
            this.positionIndeces.push(...verts[vi < 0 ? Math.abs(vi) - 1 : vi]);
            this.indexIndeces.push(this.indexIndeces.length);
        });
        this.textureIndeces.push(
            ...GLTexture.textureOffset(matIndex, Object.keys(this.matsData).length)
        );

        this.verticesCount = this.indexIndeces.length;

        this.ready();
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
    }
}