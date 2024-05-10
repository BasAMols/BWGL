import { vec3 } from 'gl-matrix';
import { Vector2, v2 } from './vector2';

export function v3(n: [number, number?, number?] | number, y?: number, z?: number) {
	if (typeof n === 'number') {
		return Vector3.f(n, y, z);
	} else if (typeof n === 'undefined') {
		return Vector3.f(0);
	} else {
		return Vector3.f(...n);
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
	public get xz() { return v2(this.x, this.z); }

	public get yx() { return v2(this.y, this.x); }
	public get yz() { return v2(this.y, this.z); }

	public get zx() { return v2(this.z, this.x); }
	public get zy() { return v2(this.z, this.y); }

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

	// dot(vector: Vector2) {
	// 	return (this.x * vector.x + this.y + vector.y);
	// }

	// moveTowards(vector: Vector2, t: number) {
	// 	t = Math.min(t, 1); // still allow negative t
	// 	var diff = vector.subtract(this);
	// 	return this.add(diff.scale(t));
	// }

	// magnitude() {
	// 	return Math.sqrt(this.magnitudeSqr());
	// }

	// magnitudeSqr() {
	// 	return (this.x * this.x + this.y * this.y);
	// }

	// distance(vector: Vector2) {
	// 	return Math.sqrt(this.distanceSqr(vector));
	// }

	// distanceSqr(vector: Vector2) {
	// 	var deltaX = this.x - vector.x;
	// 	var deltaY = this.y - vector.y;
	// 	return (deltaX * deltaX + deltaY * deltaY);
	// }

	// normalize() {
	// 	var mag = this.magnitude();
	// 	var vector = this.clone();
	// 	if (Math.abs(mag) < 1e-9) {
	// 		vector.x = 0;
	// 		vector.y = 0;
	// 	} else {
	// 		vector.x /= mag;
	// 		vector.y /= mag;
	// 	}
	// 	return vector;
	// }

	// angleDegrees() {
	// 	return this.angle() * (180 / Math.PI);
	// }

	// angle() {
	// 	return Math.atan2(this.y, this.x);
	// }


	// rotate(rad: number) {
	// 	var cos = Math.cos(rad);
	// 	var sin = Math.sin(rad);
	// 	return new Vector2(
	// 		this.x * cos - this.y * sin,
	// 		this.x * sin + this.y * cos
	// 	);
	// }

	// toPrecision(precision: number) {
	// 	var vector = this.clone();
	// 	vector.x = +vector.x.toFixed(precision);
	// 	vector.y = +vector.y.toFixed(precision);
	// 	return vector;
	// }

	// toString() {
	// 	var vector = this.toPrecision(1);
	// 	return ("[" + vector.x + "; " + vector.y + "]");
	// }

	// public clamp(min: Vector2, max: Vector2) {
	// 	return Vector2.clamp(this, min, max);
	// }

	// public static min(a: Vector2, b: Vector2) {
	// 	return new Vector2(
	// 		Math.min(a.x, b.x),
	// 		Math.min(a.y, b.y),
	// 	);
	// }

	// public static max(a: Vector2, b: Vector2) {
	// 	return new Vector2(
	// 		Math.max(a.x, b.x),
	// 		Math.max(a.y, b.y),
	// 	);
	// }

	// public static clamp(value: Vector2, min: Vector2, max: Vector2) {
	// 	return Vector2.max(Vector2.min(value, min), max);
	// }

	// public clampMagnitute(mag: number) {
	// 	return Vector2.clampMagnitute(this, mag);
	// }

	// public static clampMagnitute(value: Vector2, mag: number) {
	// 	var ratio = value.magnitude() / mag;
	// 	return new Vector2(value.x / ratio, value.y / ratio);
	// }

	// static get zero() {
	// 	return new Vector2(0, 0);
	// }
	// static get down() {
	// 	return new Vector2(0, -1);
	// }
	// static get up() {
	// 	return new Vector2(0, 1);
	// }
	// static get right() {
	// 	return new Vector2(1, 0);
	// }
	// static get left() {
	// 	return new Vector2(-1, 0);
	// }
	// static get fromDegree() {
	// 	return new Vector2(0, 0);
	// }
}
