export class Vector2 {
	x: number;
	y: number;
	static Vector2: {};
	constructor(x: number, y: number) {
		this.x = (x === undefined) ? 0 : x;
		this.y = (y === undefined) ? 0 : y;
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	add(vector: Vector2) {
		return new Vector2(this.x + vector.x, this.y + vector.y);
	}

	multiply(vector: Vector2) {
		return new Vector2(this.x * vector.x, this.y * vector.y);
	}

	subtract(vector: Vector2) {
		return new Vector2(this.x - vector.x, this.y - vector.y);
	}

	scale(scalar: number) {
		return new Vector2(this.x * scalar, this.y * scalar);
	}

	dot(vector: Vector2) {
		return (this.x * vector.x + this.y + vector.y);
	}

	moveTowards(vector: Vector2, t: number) {
		t = Math.min(t, 1); // still allow negative t
		var diff = vector.subtract(this);
		return this.add(diff.scale(t));
	}

	magnitude() {
		return Math.sqrt(this.magnitudeSqr());
	}

	magnitudeSqr() {
		return (this.x * this.x + this.y * this.y);
	}

	distance(vector: Vector2) {
		return Math.sqrt(this.distanceSqr(vector));
	}

	distanceSqr(vector: Vector2) {
		var deltaX = this.x - vector.x;
		var deltaY = this.y - vector.y;
		return (deltaX * deltaX + deltaY * deltaY);
	}

	normalize() {
		var mag = this.magnitude();
		var vector = this.clone();
		if (Math.abs(mag) < 1e-9) {
			vector.x = 0;
			vector.y = 0;
		} else {
			vector.x /= mag;
			vector.y /= mag;
		}
		return vector;
	}

	angle() {
		return Math.atan2(this.y, this.x);
	}

	rotate(rad: number) {
		var cos = Math.cos(rad);
		var sin = Math.sin(rad);
		return new Vector2(
			this.x * cos - this.y * sin,
			this.x * sin + this.y * cos
		);
	}

	toPrecision(precision: number) {
		var vector = this.clone();
		vector.x = +vector.x.toFixed(precision);
		vector.y = +vector.y.toFixed(precision);
		return vector;
	}

	toString() {
		var vector = this.toPrecision(1);
		return ("[" + vector.x + "; " + vector.y + "]");
	}

	static get zero() {
		return new Vector2(0, 0);
	}
	static get down() {
		return new Vector2(0, 1);
	}
	static get up() {
		return new Vector2(0, -1);
	}
	static get right() {
		return new Vector2(1, 0);
	}
	static get left() {
		return new Vector2(-1, 0);
	}
	static get fromDegree() {
		return new Vector2(0, 0);
	}
}
