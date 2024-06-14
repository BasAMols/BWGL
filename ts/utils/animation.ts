import { Bone } from './skeleton_bone';
import { Util } from './utils';
import { v3 } from './vector3';

export type aniBoneTransform = [number?, number?, number?, number?, number?, number?];
export type aniBoneData = [number, ...aniBoneTransform];
export type aniBones = Record<string, Bone>;
export type aniData = Record<string, aniBoneData[]>;

export type AnimationAttributes = {
    time: number,
    loop: boolean,
    once: boolean,
    dynamic: boolean,
    bones: Record<string, Bone>,
    data: Record<string, aniBoneData[]>,
};

export class Animation {
    public interval: number = 0;
    public loop: boolean;
    public once: boolean;
    public dynamic: boolean;

    private bones: aniBones;
    private data: aniData = {};
    private time: number;
    
    private _active: boolean = false;
    public get active(): boolean {
        return this._active;
    }
    public set active(value: boolean) {
        this._active = value;
        if (!value) {
            this.interval = 0; //reset on turn off.
        }
    }

    public constructor(attr: AnimationAttributes) {
        this.bones = attr.bones || {};
        this.time = attr.time || 0;
        this.loop = attr.loop || false;
        this.once = attr.once || false;
        this.dynamic = attr.dynamic || false;

        Object.entries(attr.data).forEach(([key,d])=>{
            if (d.length === 0){
                d = [[0],[1]]
            }

            if (d[0][0] !== 0){
                d.unshift([0,...d[0].slice(1)] as aniBoneData);
            }

            if (d[d.length-1][0] !== 1){
                d.push([1,...d[d.length-1].slice(1)] as aniBoneData);
            }

            this.data[key] = d;
        });
        
    }

    private setBoneTransform(key: string, transform: aniBoneTransform) {
        // console.log(transform);
        const bone = this.bones[key];
        if (bone) {
            bone.setRotation(v3(transform[0] || 0, transform[1] || 0, transform[2] || 0), this.dynamic);
            bone.setPosition(v3(transform[3] || 0, transform[4] || 0, transform[5] || 0), this.dynamic);
        }
    }


    private setBoneToValue(key: string, value: number) {
        let before: aniBoneData = this.data[key][0];
        let after: aniBoneData = this.data[key][this.data[key].length - 1];

        this.data[key].forEach((d) => {
            if (d[0] >= before[0] && d[0] <= value) {
                before = Util.padArray(d, 0, 7) as typeof before;
            }
            if (d[0] <= after[0] && d[0] >= value) {
                after = Util.padArray(d, 0, 7) as typeof after;
            }
        });

        const [[startNumber, ...start], [endNumber, ...end]] = [before, after];

        const dis = endNumber - startNumber;
        const f = value - startNumber;
        const factor = f / dis;

        this.setBoneTransform(
            key,
            Util.addArrays(
                start,
                Util.scaleArrays(
                    Util.subtractArrays(end, start),
                    factor
                )
            ) as aniBoneTransform
        );
    }

    public setBonesToValue(n: number) {
        Object.keys(this.bones).forEach((b) => {
            this.setBoneToValue(b, n);
        });
    }

    public stop() {
        Object.values(this.bones).forEach((b) => {
            b.active = true;
        });
    }

    public tick(interval: number) {
        if (this.active) {
            this.interval = this.interval + interval;

            if (this.interval >= this.time) {
                if (this.loop) {
                    this.interval = this.interval % this.time;
                } else if (this.once) {
                    this.setBonesToValue(0.999);
                    return;
                } else {
                    this.active = false;
                    this.interval = 0;
                    return;
                }
            }
            this.setBonesToValue(this.interval / this.time);
        }
    }
}

export type AnimatorAttributes = {
    bones: Record<string, Bone>,
};

export class Animator {
    private animations: Record<string, Animation> = {};
    private bones: Record<string, Bone> = {};

    public constructor(attr: AnimatorAttributes) {
        this.bones = attr.bones || {};
    }

    public add(key: string, time: number, data: aniData, attr: { loop?: boolean, once?: boolean, dynamic?: boolean; } = {}) {

        this.animations[key] = new Animation({
            bones: this.bones,
            loop: attr.loop || false,
            once: attr.once || false,
            dynamic: attr.dynamic || false,
            time, data,
        });
        return this.get(key);
    }

    public get(key: string) {
        return this.animations[key];
    }

    public stop() {
        Object.values(this.animations).forEach((a) => {
            a.active = false;
        });
    }

    public play(key: string) {
        Object.entries(this.animations).forEach(([k, a]) => {
            a.active = (k === key);
        });
    }

    public replay(key: string) {
        this.stop();
        Object.entries(this.animations).find((k) => k[0] === key)[1].active = true;
    }

    public tick(interval: number) {
        Object.values(this.animations).forEach(a => a.tick(interval));
    }
}
