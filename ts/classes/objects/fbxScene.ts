import { GlElementType } from '../rendering/glRenderer';
import { GlElementAttributes } from '../elementBase';
import { GLRendable } from '../rendable';
import { GLTexture } from '../texture';
import * as FBXParser from 'fbx-parser';
import { FBXReader } from 'fbx-parser';
import { GLGroup } from '../group';
import { FBXObject, FBXObjectAttributes } from './fbxObject';

export type matData = Record<string, string[]>;

export type FBXSceneAttributes = GlElementAttributes & {
    url?: string;
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
export class FBXScene extends GLGroup {
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
    fbxChildren: GLRendable[];

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



    constructor(attr: FBXSceneAttributes = {}) {
        super({ ...attr, ...{ autoReady: true } });

        this.path = attr.url.split('/').slice(0, -1).join('/') + '/';

        this.loadFBX(`${window.location.href}/obj/${attr.url}`);
    }

    private async loadFBX(url: string, ) {
        let reader = new FileReader();

        const response = await fetch(url);
        reader.readAsArrayBuffer(await response.blob());
        reader.addEventListener('load', () => {
            let fbx = new FBXParser.FBXReader(FBXParser.parseBinary(new Uint8Array(reader.result as ArrayBuffer)));
            this.parsePBX(fbx);
            this.ready();
        });
    }

    private static byName(node: FBXParser.FBXNode, name: any): FBXParser.FBXNode {
        return node.nodes.find((o) => o.name === name);
    }

    private static byProp(node: FBXParser.FBXNode, name: any, index: number = 0): FBXParser.FBXNode {
        return node.nodes.find((o) => o.props[index] === name);
    }

    private parsePBX(reader: FBXReader) {
        const objs = FBXScene.byName(reader.fbxNode, 'Objects');
        const globalSettings: Record<string, unknown> = Object.fromEntries(Object.values(FBXScene.byName(reader.fbxNode, "GlobalSettings").nodes[1].nodes).map((n) => ([n.props[0], n.props[4]])));
        const linked: Record<number, FBXObjectAttributes> = {};


        FBXScene.byName(reader.fbxNode, "Connections").nodes.forEach((c) => {
            const a = c.props[1];
            const b = c.props[2];

            if (a && b) {
                const aNode = FBXScene.byProp(objs, a);
                const bNode = FBXScene.byProp(objs, b);

                if (bNode.name === 'Model') {
                    let obj = linked[bNode.props[0] as number];
                    if (!obj) {
                        obj = {
                            model: bNode,
                            globalSettings: globalSettings,
                            texture: undefined,
                            material: undefined,
                            geometry: undefined,
                            path: this.path
                        };
                        linked[bNode.props[0] as number] = obj;
                    }
                    if (aNode.name === 'Geometry') obj.geometry = aNode;
                    if (aNode.name === 'Material') {
                        obj.material = aNode;
                        obj.texture = FBXScene.byProp(objs, FBXScene.byProp(FBXScene.byName(reader.fbxNode, "Connections"), a, 2)?.props[1] || 0);
                    }
                    if (aNode.name === 'Texture') obj.texture = aNode;
                }
            }
        });
        
        this.fbxChildren = [];
        
        Object.values(linked).forEach((obj) => {
            
            const fb = new FBXObject(obj);
            console.log(obj);
            this.fbxChildren.push(fb);
            this.addChild(fb); 
        });

    }
}