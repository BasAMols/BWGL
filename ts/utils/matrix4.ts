import { mat4, vec3 } from 'gl-matrix';
import { Vector3 } from './vector3';

export class Matrix4 {
    public mat4: mat4;
    public constructor(source?: mat4) {
        this.mat4 = source?mat4.clone(source):mat4.create();
        return this
    }
    public translate(vector: Vector3) {
        mat4.translate(
            this.mat4,
            this.mat4,
            vector.vec
        );
        return this;
    }
    public invert(mat: Matrix4) {
        mat4.invert(
            this.mat4,
            mat.mat4,
        );
        return this;
    }
    public transpose(mat?: Matrix4) {
        mat4.transpose(
            this.mat4,
            mat?mat.mat4:this.mat4,
        );
        return this;
    }
    public rotateAxis(angle: number, axis: 0|1|2) {
        mat4.rotate(
            this.mat4,
            this.mat4,
            angle,
            [[1,0,0], [0,1,0],[0,0,1]][axis] as vec3
        );
        return this;
    }
    public rotate(rotation: Vector3) {
        rotation.forEach((r, i) => {
            this.rotateAxis(r, i as 0|1|2)
        });
        return this;
    }
    public perspective(fov: number, aspect: number, near: number = 1, far: number = 10000) {
        mat4.perspective(
            this.mat4,
            fov,
            aspect,
            near,
            far
        );
        return this;
    }
    public clone() {
        return new Matrix4(this.mat4);
    }
}
