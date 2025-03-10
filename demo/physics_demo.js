// ts/classes/math/vector2.ts
function v2(n, y) {
  if (typeof n === "number") {
    return Vector2.f(n, y);
  } else if (typeof n === "undefined") {
    return Vector2.f(0);
  } else {
    return Vector2.f(...n);
  }
}
var Vector2 = class _Vector2 {
  constructor(x, y) {
    this.x = x === void 0 ? 0 : x;
    this.y = y === void 0 ? 0 : y;
  }
  static f(x = 0, y = x) {
    return new _Vector2(x, y);
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  clone() {
    return new _Vector2(this.x, this.y);
  }
  add(vector) {
    return new _Vector2(this.x + vector.x, this.y + vector.y);
  }
  multiply(vector) {
    return new _Vector2(this.x * vector.x, this.y * vector.y);
  }
  subtract(vector) {
    return new _Vector2(this.x - vector.x, this.y - vector.y);
  }
  scale(scalar) {
    return new _Vector2(this.x * scalar, this.y * scalar);
  }
  dot(vector) {
    return this.x * vector.x + this.y + vector.y;
  }
  moveTowards(vector, t) {
    t = Math.min(t, 1);
    var diff = vector.subtract(this);
    return this.add(diff.scale(t));
  }
  magnitude() {
    return Math.sqrt(this.magnitudeSqr());
  }
  magnitudeSqr() {
    return this.x * this.x + this.y * this.y;
  }
  clampMagnitude(max = 1) {
    if (this.magnitude() === 0)
      return v2(0);
    return this.scale(1 / this.magnitude() || 1).scale(Math.min(max, this.magnitude()));
  }
  distance(vector) {
    return Math.sqrt(this.distanceSqr(vector));
  }
  distanceSqr(vector) {
    var deltaX = this.x - vector.x;
    var deltaY = this.y - vector.y;
    return deltaX * deltaX + deltaY * deltaY;
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
  angleDegrees() {
    return this.angle() * (180 / Math.PI);
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }
  rotate(rad) {
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    return new _Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }
  toPrecision(precision) {
    var vector = this.clone();
    vector.x = +vector.x.toFixed(precision);
    vector.y = +vector.y.toFixed(precision);
    return vector;
  }
  toString() {
    var vector = this.toPrecision(1);
    return "[" + vector.x + "; " + vector.y + "]";
  }
  clamp(min, max) {
    return _Vector2.clamp(this, min, max);
  }
  static min(a, b) {
    return new _Vector2(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y)
    );
  }
  static max(a, b) {
    return new _Vector2(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y)
    );
  }
  static clamp(value, min, max) {
    return _Vector2.max(_Vector2.min(value, min), max);
  }
  clampMagnitute(mag) {
    return _Vector2.clampMagnitute(this, mag);
  }
  get array() {
    return [this.x, this.y];
  }
  set array(a) {
    [this.x, this.y] = a;
  }
  get surfaceArea() {
    return this.x * this.y;
  }
  static clampMagnitute(value, mag) {
    var ratio = value.magnitude() / mag;
    return new _Vector2(value.x / ratio, value.y / ratio);
  }
  static get zero() {
    return new _Vector2(0, 0);
  }
  static get down() {
    return new _Vector2(0, -1);
  }
  static get up() {
    return new _Vector2(0, 1);
  }
  static get right() {
    return new _Vector2(1, 0);
  }
  static get left() {
    return new _Vector2(-1, 0);
  }
  static get fromDegree() {
    return new _Vector2(0, 0);
  }
};

// ts/classes/util/utils.ts
var Util = class {
  static clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
  }
  static to0(value, tolerance = 0.1) {
    return Math.abs(value) < tolerance ? 0 : value;
  }
  static chunk(array, size) {
    const output = [];
    for (let i = 0; i < array.length; i += size) {
      output.push(array.slice(i, i + size));
    }
    return output;
  }
  static padArray(ar, b, len) {
    return ar.concat(Array.from(Array(len).fill(b))).slice(0, len);
  }
  static addArrays(ar, br) {
    return ar.map((a, i) => a + br[i]);
  }
  static subtractArrays(ar, br) {
    return ar.map((a, i) => a - br[i]);
  }
  static multiplyArrays(ar, br) {
    return ar.map((a, i) => a * br[i]);
  }
  static scaleArrays(ar, b) {
    return ar.map((a, i) => a * b);
  }
  static radToDeg(r) {
    return r * 180 / Math.PI;
  }
  static degToRad(d) {
    return d * Math.PI / 180;
  }
  static closestVectorMagniture(vectors, target) {
    let current;
    vectors.forEach((v) => {
      if (current === void 0 || Math.abs(v.magnitude()) < Math.abs(current.magnitude()))
        current = v;
      else {
      }
    });
    return current;
  }
};

// ts/classes/math/vector3.ts
function v3(a, b, c) {
  if (typeof a === "number") {
    return Vector3.f(a, b, c);
  } else if (typeof a === "undefined") {
    return Vector3.f(0);
  } else {
    return Vector3.f(...a);
  }
}
var Vector3 = class _Vector3 {
  get pitch() {
    return this.x;
  }
  set pitch(value) {
    this.x = value;
  }
  get yaw() {
    return this.y;
  }
  set yaw(value) {
    this.y = value;
  }
  get roll() {
    return this.z;
  }
  set roll(value) {
    this.z = value;
  }
  get x() {
    return this.vec[0];
  }
  set x(value) {
    this.vec[0] = value;
  }
  get y() {
    return this.vec[1];
  }
  set y(value) {
    this.vec[1] = value;
  }
  get z() {
    return this.vec[2];
  }
  set z(value) {
    this.vec[2] = value;
  }
  get xy() {
    return v2(this.x, this.y);
  }
  set xy(v) {
    this.x = v.x;
    this.y = v.y;
  }
  get xz() {
    return v2(this.x, this.z);
  }
  set xz(v) {
    this.x = v.x;
    this.z = v.y;
  }
  get yx() {
    return v2(this.y, this.x);
  }
  set yx(v) {
    this.y = v.x;
    this.x = v.y;
  }
  get yz() {
    return v2(this.y, this.z);
  }
  set yz(v) {
    this.y = v.x;
    this.z = v.y;
  }
  get zx() {
    return v2(this.z, this.x);
  }
  set zx(v) {
    this.z = v.x;
    this.x = v.y;
  }
  get zy() {
    return v2(this.z, this.y);
  }
  set zy(v) {
    this.z = v.x;
    this.y = v.y;
  }
  get xzy() {
    return v3(this.x, this.z, this.y);
  }
  set xzy(v) {
    this.x = v.x;
    this.z = v.y;
    this.y = v.z;
  }
  get xyz() {
    return v3(this.x, this.y, this.z);
  }
  set xyz(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }
  get yxz() {
    return v3(this.y, this.x, this.z);
  }
  set yxz(v) {
    this.y = v.x;
    this.x = v.y;
    this.z = v.z;
  }
  get yzx() {
    return v3(this.y, this.z, this.x);
  }
  set yzx(v) {
    this.y = v.x;
    this.z = v.y;
    this.x = v.z;
  }
  get zxy() {
    return v3(this.z, this.x, this.y);
  }
  set zxy(v) {
    this.z = v.x;
    this.x = v.y;
    this.y = v.z;
  }
  get zyx() {
    return v3(this.z, this.y, this.x);
  }
  set zyx(v) {
    this.z = v.x;
    this.y = v.y;
    this.x = v.z;
  }
  get str() {
    return this.vec.toString();
  }
  get log() {
    console.log(this.str);
    return this.str;
  }
  constructor(x = 0, y = 0, z = 0) {
    this.vec = [x, y, z];
  }
  static from2(vector, z = 0) {
    return new _Vector3(vector.x, vector.y, z);
  }
  static f(x = 0, y = x, z = x) {
    return new _Vector3(x, y, z);
  }
  static get forwards() {
    return new _Vector3(0, 0, 1);
  }
  static get backwards() {
    return new _Vector3(0, 0, -1);
  }
  static get up() {
    return new _Vector3(0, 1, 0);
  }
  static get down() {
    return new _Vector3(0, -1, 0);
  }
  static get left() {
    return new _Vector3(-1, 0, 0);
  }
  static get right() {
    return new _Vector3(1, 0, 0);
  }
  static get PI() {
    return new _Vector3(Math.PI, Math.PI, Math.PI);
  }
  static get TAU() {
    return _Vector3.PI.scale(0.5);
  }
  get array() {
    return [this.x, this.y, this.z];
  }
  set array(a) {
    [this.x, this.y, this.z] = a;
  }
  forEach(callbackfn) {
    this.array.forEach(callbackfn);
  }
  get c() {
    return this.clone();
  }
  equals(vector) {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z;
  }
  clone() {
    return new _Vector3(
      this.x,
      this.y,
      this.z
    );
  }
  add(...vectors) {
    return new _Vector3(
      this.x + vectors.reduce((a, b) => a + b.x, 0),
      this.y + vectors.reduce((a, b) => a + b.y, 0),
      this.z + vectors.reduce((a, b) => a + b.z, 0)
    );
  }
  multiply(a, b, c) {
    const [x, y, z] = typeof a === "number" ? [a, b, c] : a.array;
    return new _Vector3(
      this.x * x,
      this.y * y,
      this.z * z
    );
  }
  subtract(...vectors) {
    return new _Vector3(
      this.x - vectors.reduce((a, b) => a + b.x, 0),
      this.y - vectors.reduce((a, b) => a + b.y, 0),
      this.z - vectors.reduce((a, b) => a + b.z, 0)
    );
  }
  scale(...scalars) {
    return new _Vector3(
      this.x * scalars.reduce((a, b) => a * b, 1),
      this.y * scalars.reduce((a, b) => a * b, 1),
      this.z * scalars.reduce((a, b) => a * b, 1)
    );
  }
  divide(...vectors) {
    return new _Vector3(
      this.x / vectors.reduce((a, b) => a * b.x, 1),
      this.y / vectors.reduce((a, b) => a * b.y, 1),
      this.z / vectors.reduce((a, b) => a * b.z, 1)
    );
  }
  rotateXY(rad) {
    const [a, b] = this.xy.rotate(rad).array;
    return new _Vector3(
      a,
      this.y,
      b
    );
  }
  rotateXZ(rad) {
    const [a, b] = this.xz.rotate(rad).array;
    return new _Vector3(
      a,
      b,
      this.z
    );
  }
  rotateYZ(rad) {
    const [a, b] = this.yz.rotate(rad).array;
    return new _Vector3(
      this.x,
      a,
      b
    );
  }
  magnitude() {
    return Math.sqrt(this.magnitudeSqr());
  }
  magnitudeSqr() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  mod(max) {
    return new _Vector3(
      this.x % max.x,
      this.y % max.y,
      this.z % max.z
    );
  }
  clamp(min, max) {
    return new _Vector3(
      Util.clamp(this.x, min.x, max.x),
      Util.clamp(this.y, min.y, max.y),
      Util.clamp(this.z, min.z, max.z)
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
  dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  cross(vector) {
    return new _Vector3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }
};

// ts/classes/math/quaternion.ts
var Quaternion = class _Quaternion {
  constructor(w, x, y, z) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * Create an identity quaternion (no rotation)
   */
  static identity() {
    return new _Quaternion(1, 0, 0, 0);
  }
  /**
   * Create a quaternion from an axis and angle
   * @param axis The axis to rotate around (must be normalized)
   * @param angle The angle in radians
   */
  static fromAxisAngle(axis, angle) {
    const halfAngle = angle * 0.5;
    const s = Math.sin(halfAngle);
    return new _Quaternion(
      Math.cos(halfAngle),
      axis.x * s,
      axis.y * s,
      axis.z * s
    );
  }
  /**
   * Create a quaternion from Euler angles (in radians)
   */
  static fromEuler(x, y, z) {
    const cx = Math.cos(x * 0.5);
    const cy = Math.cos(y * 0.5);
    const cz = Math.cos(z * 0.5);
    const sx = Math.sin(x * 0.5);
    const sy = Math.sin(y * 0.5);
    const sz = Math.sin(z * 0.5);
    return new _Quaternion(
      cx * cy * cz + sx * sy * sz,
      sx * cy * cz - cx * sy * sz,
      cx * sy * cz + sx * cy * sz,
      cx * cy * sz - sx * sy * cz
    );
  }
  /**
   * Multiply this quaternion by another (compose rotations)
   */
  multiply(other) {
    return new _Quaternion(
      this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
      this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
      this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
      this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w
    );
  }
  /**
   * Get the conjugate of this quaternion
   */
  conjugate() {
    return new _Quaternion(this.w, -this.x, -this.y, -this.z);
  }
  /**
   * Get the magnitude (length) of this quaternion
   */
  magnitude() {
    return Math.sqrt(
      this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z
    );
  }
  /**
   * Normalize this quaternion
   */
  normalize() {
    const mag = this.magnitude();
    if (mag === 0)
      return _Quaternion.identity();
    return new _Quaternion(
      this.w / mag,
      this.x / mag,
      this.y / mag,
      this.z / mag
    );
  }
  /**
   * Rotate a vector by this quaternion
   */
  rotate(v) {
    const vq = new _Quaternion(0, v.x, v.y, v.z);
    const result = this.multiply(vq).multiply(this.conjugate());
    return new Vector3(result.x, result.y, result.z);
  }
  /**
   * Spherical linear interpolation between two quaternions
   */
  static slerp(a, b, t) {
    let dot = a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;
    let bx = b.x;
    let by = b.y;
    let bz = b.z;
    let bw = b.w;
    if (dot < 0) {
      dot = -dot;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (dot > 0.9995) {
      return new _Quaternion(
        a.w + (bw - a.w) * t,
        a.x + (bx - a.x) * t,
        a.y + (by - a.y) * t,
        a.z + (bz - a.z) * t
      ).normalize();
    }
    const theta0 = Math.acos(dot);
    const theta = theta0 * t;
    const sinTheta = Math.sin(theta);
    const sinTheta0 = Math.sin(theta0);
    const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
    const s1 = sinTheta / sinTheta0;
    return new _Quaternion(
      a.w * s0 + bw * s1,
      a.x * s0 + bx * s1,
      a.y * s0 + by * s1,
      a.z * s0 + bz * s1
    );
  }
  /**
   * Convert to a string representation
   */
  toString() {
    return `Quaternion(${this.w}, ${this.x}, ${this.y}, ${this.z})`;
  }
};

// ts/physics/collision/CollisionBody.ts
var CollisionBody = class {
  constructor(position, size, options = {}) {
    this.position = position;
    this.rotation = options.rotation ?? Quaternion.identity();
    this.velocity = Vector3.f(0);
    this.angularVelocity = Vector3.f(0);
    this.size = size;
    this.isStatic = options.isStatic ?? false;
    this.restitution = options.restitution ?? 0.2;
    this.friction = options.friction ?? 0.2;
    this.inverseMass = this.isStatic ? 0 : 1 / (options.mass ?? 1);
    const mass = options.mass ?? 1;
    const w = size.x;
    const h = size.y;
    const d = size.z;
    this.inverseInertia = this.isStatic ? Vector3.f(0) : new Vector3(
      12 / (mass * (h * h + d * d)),
      12 / (mass * (w * w + d * d)),
      12 / (mass * (w * w + h * h))
    );
  }
  /**
   * Get the oriented bounding box for collision detection
   */
  getOBB() {
    return {
      center: this.position,
      halfSize: this.size.scale(0.5),
      rotation: this.rotation,
      axes: [
        this.rotation.rotate(new Vector3(1, 0, 0)),
        this.rotation.rotate(new Vector3(0, 1, 0)),
        this.rotation.rotate(new Vector3(0, 0, 1))
      ]
    };
  }
  /**
   * Get world space vertices of the box
   */
  getVertices() {
    const halfSize = this.size.scale(0.5);
    const vertices = [];
    for (let i = 0; i < 8; i++) {
      const x = (i & 1 ? 1 : -1) * halfSize.x;
      const y = (i & 2 ? 1 : -1) * halfSize.y;
      const z = (i & 4 ? 1 : -1) * halfSize.z;
      const local = new Vector3(x, y, z);
      const world = this.position.add(this.rotation.rotate(local));
      vertices.push(world);
    }
    return vertices;
  }
  /**
   * Update the body's position and rotation based on velocities
   */
  integrate(deltaTime) {
    if (this.isStatic)
      return;
    this.position = this.position.add(this.velocity.scale(deltaTime));
    if (this.angularVelocity.magnitude() > 0) {
      const angle = this.angularVelocity.magnitude() * deltaTime;
      const axis = this.angularVelocity.normalize();
      const rotation = Quaternion.fromAxisAngle(axis, angle);
      this.rotation = rotation.multiply(this.rotation).normalize();
    }
  }
  /**
   * Get axis-aligned bounding box that contains the rotated OBB
   */
  getAABB() {
    const vertices = this.getVertices();
    const min = new Vector3(Infinity, Infinity, Infinity);
    const max = new Vector3(-Infinity, -Infinity, -Infinity);
    for (const v of vertices) {
      min.x = Math.min(min.x, v.x);
      min.y = Math.min(min.y, v.y);
      min.z = Math.min(min.z, v.z);
      max.x = Math.max(max.x, v.x);
      max.y = Math.max(max.y, v.y);
      max.z = Math.max(max.z, v.z);
    }
    return { min, max };
  }
};

// ts/physics/collision/CollisionPair.ts
var CollisionPair = class {
  constructor(bodyA, bodyB) {
    this.bodyA = bodyA;
    this.bodyB = bodyB;
  }
  /**
   * Check if this pair contains the given bodies (in any order)
   */
  matches(bodyA, bodyB) {
    return this.bodyA === bodyA && this.bodyB === bodyB || this.bodyA === bodyB && this.bodyB === bodyA;
  }
  /**
   * Get a unique key for this pair
   * Used for quick lookup and deduplication
   */
  getKey() {
    const idA = this.bodyA.__id ?? "";
    const idB = this.bodyB.__id ?? "";
    return idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`;
  }
};

// ts/physics/collision/BroadPhase.ts
var BroadPhase = class {
  constructor() {
    this.bodies = [];
    this.cellSize = 10;
    // Size of each grid cell
    this.grid = /* @__PURE__ */ new Map();
  }
  /**
   * Add a body to the broad phase
   */
  addBody(body) {
    this.bodies.push(body);
  }
  /**
   * Remove a body from the broad phase
   */
  removeBody(body) {
    const index = this.bodies.indexOf(body);
    if (index !== -1) {
      this.bodies.splice(index, 1);
    }
  }
  /**
   * Update the spatial hash grid
   */
  update() {
    this.grid.clear();
    for (const body of this.bodies) {
      const aabb = body.getAABB();
      const cells = this.getCellsForAABB(aabb.min, aabb.max);
      for (const cell of cells) {
        if (!this.grid.has(cell)) {
          this.grid.set(cell, []);
        }
        this.grid.get(cell).push(body);
      }
    }
  }
  /**
   * Get all potential collision pairs
   */
  getPotentialPairs() {
    const pairs = /* @__PURE__ */ new Map();
    for (const [_, bodies] of this.grid) {
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const bodyA = bodies[i];
          const bodyB = bodies[j];
          if (bodyA.isStatic && bodyB.isStatic)
            continue;
          const pair = new CollisionPair(bodyA, bodyB);
          const key = pair.getKey();
          if (!pairs.has(key)) {
            pairs.set(key, pair);
          }
        }
      }
    }
    return Array.from(pairs.values());
  }
  /**
   * Get all grid cells that an AABB overlaps
   */
  getCellsForAABB(min, max) {
    const cells = [];
    const minCell = this.worldToCell(min);
    const maxCell = this.worldToCell(max);
    for (let x = minCell.x; x <= maxCell.x; x++) {
      for (let y = minCell.y; y <= maxCell.y; y++) {
        for (let z = minCell.z; z <= maxCell.z; z++) {
          cells.push(this.getCellKey(x, y, z));
        }
      }
    }
    return cells;
  }
  /**
   * Convert a world position to cell coordinates
   */
  worldToCell(position) {
    return {
      x: Math.floor(position.x / this.cellSize),
      y: Math.floor(position.y / this.cellSize),
      z: Math.floor(position.z / this.cellSize)
    };
  }
  /**
   * Get a unique key for a cell
   */
  getCellKey(x, y, z) {
    return `${x},${y},${z}`;
  }
};

// ts/physics/collision/CollisionManifold.ts
var CollisionManifold = class {
  constructor(bodyA, bodyB, normal, penetration, contactPoint) {
    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.normal = normal;
    this.penetration = penetration;
    this.contactPoint = contactPoint;
  }
  /**
   * Get the relative velocity at the contact point
   */
  getRelativeVelocity() {
    return this.bodyB.velocity.subtract(this.bodyA.velocity);
  }
  /**
   * Check if the bodies are moving apart (no collision resolution needed)
   */
  isMovingApart() {
    const relativeVelocity = this.getRelativeVelocity();
    return this.normal.dot(relativeVelocity) > 0;
  }
  /**
   * Get the collision basis (normal and tangent vectors)
   * Used for decomposing forces into normal and tangential components
   */
  getCollisionBasis() {
    const relativeVelocity = this.getRelativeVelocity();
    const normal = this.normal;
    const normalVelocity = normal.scale(normal.dot(relativeVelocity));
    const tangentVelocity = relativeVelocity.subtract(normalVelocity);
    const tangent = tangentVelocity.magnitude() > 1e-4 ? tangentVelocity.normalize() : this.getArbitraryTangent();
    return { normal, tangent };
  }
  /**
   * Get an arbitrary vector perpendicular to the normal
   */
  getArbitraryTangent() {
    const absX = Math.abs(this.normal.x);
    const absY = Math.abs(this.normal.y);
    const absZ = Math.abs(this.normal.z);
    let tangent;
    if (absX <= absY && absX <= absZ) {
      tangent = new Vector3(1, 0, 0);
    } else if (absY <= absX && absY <= absZ) {
      tangent = new Vector3(0, 1, 0);
    } else {
      tangent = new Vector3(0, 0, 1);
    }
    return tangent.subtract(
      this.normal.scale(this.normal.dot(tangent))
    ).normalize();
  }
};

// ts/physics/collision/CollisionSystem.ts
var CollisionSystem = class {
  constructor() {
    this.bodies = [];
    this.broadPhase = new BroadPhase();
  }
  /**
   * Add a collision body to the system
   */
  addBody(body) {
    this.bodies.push(body);
    this.broadPhase.addBody(body);
  }
  /**
   * Remove a collision body from the system
   */
  removeBody(body) {
    const index = this.bodies.indexOf(body);
    if (index !== -1) {
      this.bodies.splice(index, 1);
      this.broadPhase.removeBody(body);
    }
  }
  /**
   * Update the collision system for the current frame
   * @param deltaTime Time since last update in seconds
   */
  update(deltaTime) {
    this.broadPhase.update();
    const pairs = this.broadPhase.getPotentialPairs();
    const manifolds = [];
    for (const pair of pairs) {
      const manifold = this.detectCollision(pair);
      if (manifold) {
        manifolds.push(manifold);
      }
    }
    this.resolveCollisions(manifolds, deltaTime);
  }
  /**
   * Detect collision between two bodies
   * Returns null if no collision, or a CollisionManifold if collision detected
   */
  detectCollision(pair) {
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;
    const closestPoints = this.findClosestPoints(bodyA, bodyB);
    if (closestPoints.distance < 0) {
      return new CollisionManifold(
        bodyA,
        bodyB,
        closestPoints.normal,
        -closestPoints.distance,
        // Penetration depth
        closestPoints.contactPoint
      );
    }
    return null;
  }
  /**
   * Find the closest points between two collision bodies using SAT
   */
  findClosestPoints(bodyA, bodyB) {
    const obbA = bodyA.getOBB();
    const obbB = bodyB.getOBB();
    const axes = [
      ...obbA.axes,
      ...obbB.axes,
      // Cross products of edges
      ...this.getEdgeAxes(obbA.axes, obbB.axes)
    ];
    let minPenetration = Infinity;
    let minAxis = null;
    let flip = false;
    for (const axis of axes) {
      const projA = this.projectOBB(obbA, axis);
      const projB = this.projectOBB(obbB, axis);
      const overlap = Math.min(
        projA.max - projB.min,
        projB.max - projA.min
      );
      if (overlap <= 0) {
        return {
          distance: -overlap,
          normal: axis,
          contactPoint: Vector3.f(0)
        };
      }
      const penetration = Math.abs(overlap);
      if (penetration < minPenetration) {
        minPenetration = penetration;
        minAxis = axis;
        flip = projA.max + projA.min < projB.max + projB.min;
      }
    }
    if (!minAxis) {
      return {
        distance: 0,
        normal: new Vector3(1, 0, 0),
        contactPoint: bodyA.position
      };
    }
    const contactPoint = this.findContactPoint(bodyA, bodyB, minAxis, flip);
    return {
      distance: -minPenetration,
      normal: flip ? minAxis.scale(-1) : minAxis,
      contactPoint
    };
  }
  /**
   * Get edge-edge cross product axes for SAT
   */
  getEdgeAxes(axesA, axesB) {
    const axes = [];
    for (const a of axesA) {
      for (const b of axesB) {
        const cross = a.cross(b);
        if (cross.magnitude() > 1e-3) {
          axes.push(cross.normalize());
        }
      }
    }
    return axes;
  }
  /**
   * Project an OBB onto an axis
   */
  projectOBB(obb, axis) {
    const vertices = obb.rotation.rotate(new Vector3(obb.halfSize.x, 0, 0)).add(obb.rotation.rotate(new Vector3(0, obb.halfSize.y, 0))).add(obb.rotation.rotate(new Vector3(0, 0, obb.halfSize.z)));
    let min = axis.dot(obb.center.subtract(vertices));
    let max = axis.dot(obb.center.add(vertices));
    if (min > max) {
      [min, max] = [max, min];
    }
    return { min, max };
  }
  /**
   * Find the contact point between two intersecting OBBs
   */
  findContactPoint(bodyA, bodyB, normal, flip) {
    const verticesA = bodyA.getVertices();
    const verticesB = bodyB.getVertices();
    const referenceBody = flip ? bodyB : bodyA;
    const incidentBody = flip ? bodyA : bodyB;
    const referenceVertices = flip ? verticesB : verticesA;
    const incidentVertices = flip ? verticesA : verticesB;
    let deepestPoint = null;
    let maxPenetration = -Infinity;
    for (const vertex of incidentVertices) {
      const penetration = normal.dot(referenceBody.position.subtract(vertex));
      if (penetration > maxPenetration) {
        maxPenetration = penetration;
        deepestPoint = vertex;
      }
    }
    return deepestPoint ?? incidentBody.position;
  }
  /**
   * Resolve a set of collisions
   */
  resolveCollisions(manifolds, deltaTime) {
    for (const manifold of manifolds) {
      this.resolvePosition(manifold);
      this.resolveVelocity(manifold, deltaTime);
    }
  }
  /**
   * Resolve position penetration
   */
  resolvePosition(manifold) {
    const bodyA = manifold.bodyA;
    const bodyB = manifold.bodyB;
    const percent = 0.8;
    const slop = 0.01;
    const correction = Math.max(manifold.penetration - slop, 0) * percent;
    if (bodyA.isStatic) {
      bodyB.position = bodyB.position.add(manifold.normal.scale(correction));
    } else if (bodyB.isStatic) {
      bodyA.position = bodyA.position.add(manifold.normal.scale(-correction));
    } else {
      const totalMass = bodyA.inverseMass + bodyB.inverseMass;
      const ratioA = bodyA.inverseMass / totalMass;
      const ratioB = bodyB.inverseMass / totalMass;
      bodyA.position = bodyA.position.add(manifold.normal.scale(-correction * ratioA));
      bodyB.position = bodyB.position.add(manifold.normal.scale(correction * ratioB));
    }
  }
  /**
   * Resolve velocity collision
   */
  resolveVelocity(manifold, deltaTime) {
    const bodyA = manifold.bodyA;
    const bodyB = manifold.bodyB;
    if (bodyA.isStatic && bodyB.isStatic)
      return;
    const relativeVelocity = bodyB.velocity.subtract(bodyA.velocity);
    const normalVelocity = manifold.normal.dot(relativeVelocity);
    if (normalVelocity > 0)
      return;
    const restitution = Math.min(bodyA.restitution, bodyB.restitution);
    let j = -(1 + restitution) * normalVelocity;
    j /= bodyA.inverseMass + bodyB.inverseMass;
    const impulse = manifold.normal.scale(j);
    if (!bodyA.isStatic) {
      bodyA.velocity = bodyA.velocity.subtract(impulse.scale(bodyA.inverseMass));
    }
    if (!bodyB.isStatic) {
      bodyB.velocity = bodyB.velocity.add(impulse.scale(bodyB.inverseMass));
    }
    this.resolveFriction(manifold, j);
  }
  /**
   * Resolve friction forces
   */
  resolveFriction(manifold, normalImpulse) {
    const bodyA = manifold.bodyA;
    const bodyB = manifold.bodyB;
    const relativeVelocity = bodyB.velocity.subtract(bodyA.velocity);
    const tangent = relativeVelocity.subtract(
      manifold.normal.scale(relativeVelocity.dot(manifold.normal))
    ).normalize();
    const friction = Math.sqrt(bodyA.friction * bodyB.friction);
    let jt = -relativeVelocity.dot(tangent);
    jt /= bodyA.inverseMass + bodyB.inverseMass;
    const maxFriction = friction * normalImpulse;
    jt = Math.max(-maxFriction, Math.min(maxFriction, jt));
    const frictionImpulse = tangent.scale(jt);
    if (!bodyA.isStatic) {
      bodyA.velocity = bodyA.velocity.subtract(frictionImpulse.scale(bodyA.inverseMass));
    }
    if (!bodyB.isStatic) {
      bodyB.velocity = bodyB.velocity.add(frictionImpulse.scale(bodyB.inverseMass));
    }
  }
};
export {
  CollisionBody,
  CollisionSystem,
  Quaternion,
  Vector3
};
