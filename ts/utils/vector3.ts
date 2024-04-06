import { Vector2 } from './vector2';

export class Vector3 extends Vector2 {
	z: number;
	static Vector3: {};
	constructor(x: number, y: number, z: number) {
		super(x, y);
		this.z = (y === undefined) ? 0 : z;
	}

	static from2(vector: Vector2, z: number) {
		return new Vector3(vector.x, vector.y, z);
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

	multiply(vector: Vector3) {
		return new Vector3(
			this.x * vector.x,
			this.y * vector.y,
			this.z * vector.z,
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
