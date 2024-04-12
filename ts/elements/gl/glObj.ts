import { Color } from '../../utils/colors';
import { GlElementType } from '../../utils/gl';
import { Vector3 } from '../../utils/vector3';
import { GlElementAttributes } from './glElement';
import { GLRendable } from './glRendable';
import { GLTexture } from './glTexture';

export type GLobjAttributes = GlElementAttributes & {
    url?: string;
};

export class GLobj extends GLRendable {
    public texture: GLTexture;
    public type: GlElementType = 'mesh';
    public verticesCount: number = 0;
    private points: number[] = [];
    private faces: number[] = [];
    private faceColors: number[] = [];
    private matIndex: string[] = [];
    private mats: Record<string, string[]> = {};

    constructor(attr: GLobjAttributes = {}) {
        super({ ...attr, ...{ autoReady: false } });

        this.loadFile(`${window.location.href}/obj/${attr.url}`)
            .then(this.parseMat.bind(this))
            .then(this.parse.bind(this))
            .then(() => {
                this.ready();
            });

    }

    public build(): void {
        super.build();
    }

    private async parseMat(str: string) {
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

    private async parse(str: string) {
        let mI: string;

        str.split("\n").forEach(async (line) => {
            let command: string;

            line.split(/(?: |\/)/).forEach(async (word, i, ar) => {
                word = word.trim();

                if (/mtllib/.test(word)) {
                    await this.loadFile(`${window.location.href}/obj/${ar[i + 1]}`)
                        .then(this.parseMat.bind(this));
                } else if (/usemtl/.test(word)) {
                    mI = ar[i + 1];
                } else if (/(?:v|f)/.test(word)) {
                    command = word;
                    if (mI && command === 'f') {
                        this.matIndex.push(mI);
                    }
                } else if (/([0-9-])/.test(word)) {
                    if (command === 'v') {
                        this.points.push(Number(word));
                        return;
                    }
                    if (command === 'f') {
                        this.faces.push(Number(word) - 1);
                        return;
                    }
                }
            });
        });

        const counts: Record<string, number> = {};
        this.matIndex.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

        this.faces = this.faces.filter((v, i) => i % 3 === 0);
        this.verticesCount = this.faces.length;

    }

    public async loadFile(url: string): Promise<any> {
        const response = await fetch(url);
        const data = await response.text();
        return data;
    }

    protected indexBuffer() {
        return this.getIndexBuffer(this.faces);
    }

    protected positionBuffer(size: Vector3) {
        return this.getPositionBuffer(this.points.map((n, i) => n * size.array[i % 3]));
    }

    protected textureBuffer(size: Vector3) {
        if (Object.values(this.mats).length) {
            this.texture = new GLTexture(this.game, {color: Object.values(this.mats)[0][2].slice(3).split(' ').map(Number) as Color});
        } else {
            this.texture = new GLTexture(this.game, {});
        }
        
        return this.getTextureBuffer(this.points.map((n, i) => n * size.array[i % 3]));
    }
}