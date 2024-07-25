import { vec3 } from 'gl-matrix';
import { Vector2, v2 } from './vector2';
import { Util } from './utils';

export function v3(): Vector3;
export function v3(a?: [number?, number?, number?]): Vector3;
export function v3(a?: number, b?: number, c?: number): Vector3;
export function v3(a?: [number?, number?, number?] | number, b?: number, c?: number): Vector3 {
	if (typeof a === 'number') {
		return Vector3.f(a, b, c);
	} else if (typeof a === 'undefined') {
		return Vector3.f(0);
	} else {
		return Vector3.f(...a);
	}
}

export class Vector3 {
	public get pitch(): number { return this.x; }
	public set pitch(value: number) { this.x = value; }

	public get yaw(): number { return this.y; }
	public set yaw(value: number) { this.y = value; }

	public get roll(): number { return this.z; }
	public set roll(value: number) { this.z = value; }

	public get x(): number { return this.vec[0]; }
	public set x(value: number) { this.vec[0] = value; }

	public get y(): number { return this.vec[1]; }
	public set y(value: number) { this.vec[1] = value; }

	public get z(): number { return this.vec[2]; }
	public set z(value: number) { this.vec[2] = value; }

	public get xy() { return v2(this.x, this.y); }
	public set xy(v: Vector2) { this.x = v.x; this.y = v.y}

	public get xz() { return v2(this.x, this.z); }
	public set xz(v: Vector2) { this.x = v.x; this.z = v.y}

	public get yx() { return v2(this.y, this.x); }
	public set yx(v: Vector2) { this.y = v.x; this.x = v.y}

	public get yz() { return v2(this.y, this.z); }
	public set yz(v: Vector2) { this.y = v.x; this.z = v.y}

	public get zx() { return v2(this.z, this.x); }
	public set zx(v: Vector2) { this.z = v.x; this.x = v.y}

	public get zy() { return v2(this.z, this.y); }
	public set zy(v: Vector2) { this.z = v.x; this.y = v.y}


	public vec: vec3;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.vec = [x, y, z];
	}

	static from2(vector: Vector2, z: number = 0) {
		return new Vector3(vector.x, vector.y, z);
	}

	static f(x: number = 0, y: number = x, z: number = x) {
		return new Vector3(x, y, z);
	}

	static get forwards() {
		return new Vector3(0, 0, 1);
	}
	static get backwards() {
		return new Vector3(0, 0, -1);
	}
	static get up() {
		return new Vector3(0, 1, 0);
	}
	static get down() {
		return new Vector3(0, -1, 0);
	}
	static get left() {
		return new Vector3(-1, 0, 0);
	}
	static get right() {
		return new Vector3(1, 0, 0);
	}
	static get PI() {
		return new Vector3(Math.PI, Math.PI, Math.PI);
	}
	static get TAU() {
		return Vector3.PI.scale(0.5);
	}

	get array() {
		return [this.x, this.y, this.z];
	}

	set array(a: [number, number, number]) {
		[this.x, this.y, this.z] = a;
	}

	forEach(callbackfn: (value: number, index: number, array: number[]) => void): void {
		this.array.forEach(callbackfn);
	};

	get c(): Vector3 {
		return this.clone();
	}

	equals(vector: Vector3): boolean {
		return (
			this.x === vector.x &&
			this.y === vector.y &&
			this.z === vector.z
		);
	}

	clone(): Vector3 {
		return new Vector3(
			this.x,
			this.y,
			this.z
		);
	}

	add(vector: Vector3) {
		return new Vector3(
			this.x + vector.x,
			this.y + vector.y,
			this.z + vector.z,
		);
	}

	multiply(a: Vector3): Vector3;
	multiply(a: number, b: number, c: number): Vector3;
	multiply(a: Vector3 | number, b?: number, c?: number): Vector3 {
		const [x, y, z] = (typeof a === 'number') ? [a, b, c] : a.array;
		return new Vector3(
			this.x * x,
			this.y * y,
			this.z * z,
		);
	}

	subtract(vector: Vector3) {
		return new Vector3(
			this.x - vector.x,
			this.y - vector.y,
			this.z - vector.z,
		);
	}

	scale(scalar: number) {
		return new Vector3(
			this.x * scalar,
			this.y * scalar,
			this.z * scalar,
		);
	}

	divide(vector: Vector3) {
		return new Vector3(
			this.x / vector.x,
			this.y / vector.y,
			this.z / vector.z,
		);
	}

	rotateXY(rad: number) {
		const [a, b] = this.xy.rotate(rad).array;

		return new Vector3(
			a,
			this.y,
			b,
		);
	}
	rotateXZ(rad: number) {
		const [a, b] = this.xz.rotate(rad).array;

		return new Vector3(
			a,
			b,
			this.z,
		);
	}
	rotateYZ(rad: number) {
		const [a, b] = this.yz.rotate(rad).array;

		return new Vector3(
			this.x,
			a,
			b,
		);
	}

	magnitude() {
		return Math.sqrt(this.magnitudeSqr());
	}

	magnitudeSqr() {
		return (this.x * this.x + this.y * this.y + this.z * this.z);
	}

	mod(max: Vector3) {
		return new Vector3(
			this.x % max.x,
			this.y % max.y,
			this.z % max.z,
		);
	}
	clamp(min: Vector3, max: Vector3) {
		return new Vector3(
			Util.clamp(this.x, min.x, max.x),
			Util.clamp(this.y, min.y, max.y),
			Util.clamp(this.z, min.z, max.z),
		);
	}
	normalize() {
		let len = this.x * this.x + this.y * this.y + this.z * this.z;
		if (len > 0) {
			len = 1 / Math.sqrt(len);
		}
		return v3(
			this.x * len,
			this.y * len,
			this.z * len
		);
	}
}
