var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ts/utils/element.ts
var Element = class {
  constructor() {
    this.events = [];
  }
  get t() {
    return this.game.t;
  }
  get mode() {
    return this.game.mode;
  }
  get level() {
    return this.game.level;
  }
  get GLT() {
    return this.game.GLR.glt;
  }
  get GLR() {
    return this.game.GLR;
  }
  get gl() {
    return this.game.gl;
  }
  build() {
  }
  addEvent(e) {
    this.events.push(e);
  }
  getEvent(id) {
    return this.events.find((e) => id === e.id);
  }
};

// ts/utils/vector2.ts
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

// ts/dom/domElement.ts
var DomElement = class extends Element {
  constructor(type, attr = {}) {
    super();
    this.children = [];
    this.rendererType = "dom";
    this.position = v2(0);
    this.size = v2(0);
    this.dom = document.createElement(type);
    this.dom.style.position = "absolute";
    this.dom.style.transformOrigin = "bottom left";
    this.dom.style.pointerEvents = "none";
    this.dom.style.bottom = "0px";
    this.id = attr.id || "";
    this.background = attr.background || "";
    this.size = attr.size || Vector2.zero;
    this.position = attr.position || Vector2.zero;
  }
  get id() {
    return this.dom.id;
  }
  set id(value) {
    if (value) {
      this.dom.id = value;
    }
  }
  get x() {
    return Math.round(Number(this.dom.style.left.replace(/\D/g, "")));
  }
  set x(n) {
    if (this.dom) {
      this.dom.style.left = "".concat(n, "px");
    }
  }
  get y() {
    return Math.round(Number(this.dom.style.bottom.replace(/\D/g, "")));
  }
  set y(n) {
    if (this.dom) {
      this.dom.style.bottom = "".concat(n, "px");
    }
  }
  set visible(value) {
    this.dom ? this.dom.style.display = value ? "block" : "none" : null;
  }
  set background(v) {
    this.dom.style.background = v;
  }
  get width() {
    return Math.round(Number(this.dom.style.width.replace(/\D/g, "")));
  }
  set width(value) {
    if (this.dom) {
      this.dom.style.width = "".concat(value, "px");
      this.dom.setAttribute("width", String(value));
    }
  }
  get height() {
    return Math.round(Number(this.dom.style.height.replace(/\D/g, "")));
  }
  set height(value) {
    if (this.dom) {
      this.dom.style.height = "".concat(value, "px");
      this.dom.setAttribute("height", String(value));
    }
  }
  ready() {
    this.build();
  }
  tick(obj) {
    this.children.forEach((c) => {
      c.tick(obj);
    });
  }
  appendChild(e) {
    this.dom.appendChild(e.dom);
  }
  addChild(child) {
    this.children.push(child);
    this.dom.appendChild(child.dom);
  }
  addEventListener(type, listener, options) {
    this.dom.addEventListener(type, listener, options);
  }
  removeEventListener(type, listener, options) {
    this.dom.removeEventListener(type, listener, options);
  }
};

// ts/dom/domText.ts
var DomText = class extends DomElement {
  set color(v) {
    this.dom.style.color = v;
  }
  set fontSize(v) {
    this.dom.style.fontSize = String(v) + "px";
  }
  set fontWeight(v) {
    this.dom.style.fontWeight = String(v);
  }
  set fontFamily(v) {
    this.dom.style.fontFamily = v;
  }
  get text() {
    return this.dom.innerHTML;
  }
  set text(v) {
    this.dom.innerHTML = v ? v : "";
  }
  set padding(v) {
    this.dom.style.padding = v.join("px ") + "px";
  }
  constructor(attr = {}) {
    super("div", attr);
    this.color = attr.color;
    this.text = attr.text;
    this.fontSize = attr.fontSize;
    this.fontWeight = attr.fontWeight;
    this.fontFamily = attr.fontFamily;
    this.padding = attr.padding || [0, 0, 0, 0];
    this.dom.style.pointerEvents = "none";
    this.dom.style.userSelect = "none";
    this.dom.style.zIndex = "1";
  }
};

// ts/utils/debug/fps.ts
var FPS = class _FPS extends DomText {
  constructor() {
    super({
      text: _FPS.getString(""),
      fontSize: 35,
      fontWeight: 900,
      color: "white",
      position: new Vector2(5, 5),
      size: new Vector2(100, 50),
      background: "#ff0000aa",
      fontFamily: "monospace",
      padding: [0, 10, 0, 10]
    });
    this.fCount = 0;
    this.tCount = 0;
  }
  tick({ frameRate, frame }) {
    if (frame % 100 === 1) {
      this.text = _FPS.getString(frameRate.toFixed(0));
    }
  }
  static getString(v) {
    return "".concat(String(v), '<sub style="font-size:25px; top: -7px; position: relative">FPS</sub>');
  }
};

// ts/utils/ticker.ts
var Ticker = class {
  constructor() {
    this._running = false;
    this.started = false;
    this.pauzedTime = 0;
    this.callbacks = [];
    this.frameN = 0;
    document.addEventListener("visibilitychange", () => {
      if (this.started) {
        this.running = !document.hidden;
      }
    });
  }
  get running() {
    return this._running;
  }
  set running(value) {
    this._running = value;
    if (value) {
      this.pTime = performance.now() - this.pauzedTime;
      this.id = window.requestAnimationFrame(this.frame.bind(this));
    } else {
      window.cancelAnimationFrame(this.id);
      this.pauzedTime = performance.now() - this.pTime;
    }
  }
  get startTime() {
    return this.sTime;
  }
  frame(timeStamp) {
    if (this.running) {
      const interval = timeStamp - this.pTime;
      this.pTime = timeStamp;
      this.frameN++;
      const o = {
        interval,
        total: this.eTime,
        frameRate: 1e3 / interval,
        frame: this.frameN
      };
      this.callbacks.forEach((c) => {
        c(o);
      });
      this.id = window.requestAnimationFrame(this.frame.bind(this));
    }
  }
  start() {
    this.started = true;
    this._running = true;
    this.sTime = performance.now();
    this.pTime = performance.now();
    this.id = window.requestAnimationFrame(this.frame.bind(this));
  }
  add(callback) {
    this.callbacks.push(callback);
  }
};

// ts/utils/input.ts
var Input = class {
  get locked() {
    return this._locked;
  }
  set locked(value) {
    this._locked = value;
    this.overlay.dom.style.display = !value ? "block" : "none";
  }
  constructor(game) {
    this.game = game;
    this.canvas = game.renderer;
    this.canvas.dom.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvas.dom.addEventListener("keydown", this.keyDown.bind(this));
    this.canvas.dom.addEventListener("keyup", this.keyUp.bind(this));
    this.canvas.dom.addEventListener("click", this.mouseClick.bind(this));
    this.canvas.dom.addEventListener("wheel", this.scroll.bind(this));
    this.overlay = new DomText({
      text: "Pauzed"
    });
    this.overlay.dom.setAttribute(
      "style",
      "\n            transform-origin: left bottom;\n            pointer-events: none;\n            bottom: 0px;\n            left: 0px;\n            user-select: none;\n            z-index: 999;\n            position: absolute;\n            height: 100vh;\n            width: 100vw;\n            color: white !important;\n            font-family: monospace;\n            font-weight: bold;\n            font-size: 40px;\n            padding-left: 50px;\n            padding-top: 20px;\n            box-sizing: border-box;\n            text-transform: uppercase;"
    );
    document.body.appendChild(this.overlay.dom);
    document.addEventListener("pointerlockchange", () => {
      this.locked = document.pointerLockElement === this.canvas.dom;
    });
    document.addEventListener("startstart", (e) => {
      this.lastTouch = v2(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
    });
    document.addEventListener("touchmove", (e) => {
      const t = v2(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
      if (this.lastTouch) {
        this.sendTouchMove(t.subtract(this.lastTouch));
      }
      this.lastTouch = v2(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
    });
    document.addEventListener("touchend", (e) => {
      this.lastTouch = void 0;
    });
  }
  mouseClick(e) {
    if (this.locked) {
      this.send("click", e);
    } else {
      this.canvas.dom.requestPointerLock();
    }
  }
  mouseMove(e) {
    if (this.locked) {
      this.send("mouseMove", e);
    }
  }
  scroll(e) {
    if (this.locked) {
      this.send("scroll", e);
    }
  }
  keyDown(e) {
    if (this.locked) {
      this.send("keyDown", e);
    }
  }
  keyUp(e) {
    if (this.locked) {
      this.send("keyUp", e);
    }
  }
  sendTouchMove(d) {
    this.recursiveTouchMove(this.game.mode, d);
  }
  recursiveTouchMove(element, d) {
    if (element.active) {
      if (element.drag) {
        element.drag(d);
      }
      element.controllers.forEach((child) => this.recursiveTouchMove(child, d));
      element.children.forEach((child) => this.recursiveTouchMove(child, d));
    }
  }
  send(event, e) {
    this.recursive(event, this.game.mode, e);
  }
  recursive(event, element, e) {
    if (element.active) {
      if (element[event]) {
        if (event === "mouseMove" || event === "click") {
          element[event](e);
        } else if (event === "scroll") {
          element[event](e);
        } else {
          element[event](e);
        }
      }
      element.controllers.forEach((child) => this.recursive(event, child, e));
      element.children.forEach((child) => this.recursive(event, child, e));
    }
  }
};

// ts/utils/event.ts
var Event = class {
  constructor(id) {
    this.subscribers = {};
    this.id = id;
  }
  subscribe(key, func) {
    this.subscribers[key] = func;
  }
  alert(v) {
    Object.values(this.subscribers).forEach((s) => {
      s(v);
    });
  }
};

// ts/dom/renderer.ts
var Renderer = class extends DomElement {
  constructor(game) {
    super("canvas");
    this.game = game;
    this.dom.style.position = "absolute";
    this.dom.style.pointerEvents = "all";
    this.dom.style.bottom = "0px";
    this.dom.tabIndex = 1;
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.addEvent(new Event("resize"));
    this.resize();
  }
  resize() {
    this.size = v2(document.body.clientWidth, document.body.clientHeight);
    this.dom.style.width = "".concat(this.size.x, "px");
    this.dom.setAttribute("width", String(this.size.x));
    this.dom.style.height = "".concat(this.size.y, "px");
    this.dom.setAttribute("height", String(this.size.y));
    this.getEvent("resize").alert(this.size);
  }
  get width() {
    return Math.round(Number(this.dom.style.width.replace(/\D/g, "")));
  }
  set width(value) {
    this.dom.style.width = "".concat(value, "px");
    this.dom.setAttribute("width", String(value));
  }
  get height() {
    return Math.round(Number(this.dom.style.height.replace(/\D/g, "")));
  }
  set height(value) {
    this.dom.style.height = "".concat(value, "px");
    this.dom.setAttribute("height", String(value));
  }
  addMode(child) {
    var _a;
    (_a = child.game) != null ? _a : child.game = this.game;
    child.build();
  }
  get context() {
    return this._context;
  }
  set context(value) {
    this._context = value;
  }
  tick(obj) {
    super.tick(obj);
    this.tickerData = obj;
    this.game.GLR.draw();
    this.game.mode.tick(obj);
  }
};

// ts/utils/debug/loader.ts
var Loader = class extends DomElement {
  constructor() {
    super("div", {
      position: new Vector2(5, 5),
      size: new Vector2(600, 70),
      background: "#272727"
    });
    this.bar = new DomElement("div", {
      size: new Vector2(600, 70),
      background: "#80808070"
    });
    this.dom.appendChild(this.bar.dom);
    this.text = new DomText({
      text: "",
      fontSize: 35,
      fontWeight: 900,
      color: "white",
      size: new Vector2(600, 70),
      position: new Vector2(30, -10),
      fontFamily: "monospace"
    });
    this.dom.appendChild(this.text.dom);
  }
  update(value, total) {
    this.text.text = "loaded ".concat(total - value, " out of ").concat(total, " assets");
    this.bar.width = 600 * (total - value) / total;
  }
};

// ts/utils/utils.ts
var Util = class {
  static clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
  }
  static to0(value, tolerance = 0.1) {
    return Math.abs(value) < tolerance ? 0 : value;
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
};

// ts/utils/vector3.ts
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
  get xz() {
    return v2(this.x, this.z);
  }
  get yx() {
    return v2(this.y, this.x);
  }
  get yz() {
    return v2(this.y, this.z);
  }
  get zx() {
    return v2(this.z, this.x);
  }
  get zy() {
    return v2(this.z, this.y);
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
  add(vector) {
    return new _Vector3(
      this.x + vector.x,
      this.y + vector.y,
      this.z + vector.z
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
  subtract(vector) {
    return new _Vector3(
      this.x - vector.x,
      this.y - vector.y,
      this.z - vector.z
    );
  }
  scale(scalar) {
    return new _Vector3(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar
    );
  }
  divide(vector) {
    return new _Vector3(
      this.x / vector.x,
      this.y / vector.y,
      this.z / vector.z
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
};

// ts/gl/shaders/vertexShader.ts
var vertexShader_default = "\nattribute vec4 aVertexPosition;\nattribute vec3 aVertexNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat4 uNormalMatrix;\n\nvarying highp vec2 vTextureCoord;\nvarying highp vec3 vLighting;\nvarying highp vec3 vCloudLighting;\n\nvoid main(void) {\n  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n  vTextureCoord = aTextureCoord;\n\n  highp vec3 ambientLight = vec3(0.8, 0.8, 1) *0.5;\n  highp vec3 directionalLightColor = vec3(1, 1, 1);\n  highp vec3 directionalVector = normalize(vec3(-0.7, .7, 0.3));\n\n  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n  lowp vec3 vCloudLighting = vec3(1, 1, 1)*0.9 + (vec3(1, 1, 1) * max(dot(transformedNormal.xyz, normalize(vec3(0, -1, 0))), 0.0)*0.0)*0.6;\n\n  if ((uModelViewMatrix * aVertexPosition).y > 600.0) {\n    vLighting = vCloudLighting * 0.9;\n  } else {\n    vLighting = ambientLight + (directionalLightColor * directional);\n  }\n}";

// ts/gl/shaders/fragmentShader.ts
var fragmentShader_default = "\nvarying highp vec2 vTextureCoord;\nvarying highp vec3 vLighting;\n\nuniform sampler2D uSampler;\nuniform lowp float uOpacity;\nuniform lowp float uIntensity;\n\nvoid main(void) {\n    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = vec4((texelColor.rgb+texelColor.rgb * (uIntensity-1.0)) * vLighting, texelColor.a*uOpacity);\n}\n";

// ts/gl/glrInit.ts
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("An error occurred compiling the shaders: ".concat(gl.getShaderInfoLog(shader)));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
function initShaderProgram(gl) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShader_default);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShader_default);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: ".concat(gl.getProgramInfoLog(
        shaderProgram
      ))
    );
    return;
  }
  return [
    shaderProgram,
    {
      "uProjectionMatrix": {
        pointer: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        type: "matrix4"
      },
      "uModelViewMatrix": {
        pointer: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        type: "matrix4"
      },
      "uNormalMatrix": {
        pointer: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
        type: "matrix4"
      },
      "uOpacity": {
        pointer: gl.getUniformLocation(shaderProgram, "uOpacity"),
        type: "float"
      },
      "uIntensity": {
        pointer: gl.getUniformLocation(shaderProgram, "uIntensity"),
        type: "float"
      },
      "uSampler": {
        pointer: gl.getUniformLocation(shaderProgram, "uSampler"),
        type: "int"
      }
    },
    {
      "aVertexPosition": {
        pointer: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        count: 3
      },
      "aVertexNormal": {
        pointer: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
        count: 3
      },
      "aTextureCoord": {
        pointer: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        count: 2
      }
    }
  ];
}

// ts/gl/glTranslator.ts
var GLTranslator = class {
  constructor(game, glr) {
    this.game = game;
    this.glr = glr;
    this.gl = this.glr.gl;
    [this.program, this.uniforms, this.attributes] = initShaderProgram(this.gl);
  }
  createBuffer(data, type = "normal", dataType = Float32Array) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(type === "element" ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      type === "element" ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER,
      new dataType(data),
      this.gl.STATIC_DRAW
    );
    return buffer;
  }
  sendAttribute(pointer, buffer) {
    const at = this.attributes[pointer];
    if (at) {
      this.sendBuffer(buffer);
      this.gl.vertexAttribPointer(
        at.pointer,
        at.count,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      this.gl.enableVertexAttribArray(at.pointer);
    } else {
      throw new Error("".concat(pointer, " attribute doesnt exist"));
    }
  }
  sendTexture(texture) {
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  }
  sendBuffer(buffer, type = "normal") {
    this.gl.bindBuffer(type === "element" ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER, buffer);
  }
  sendUniform(pointer, data) {
    const un = this.uniforms[pointer];
    if (un) {
      if (un.type === "matrix4")
        this.sendMat4(un.pointer, data);
      if (un.type === "float")
        this.sendFloat(un.pointer, data);
      if (un.type === "int")
        this.sendInt(un.pointer, data);
    } else {
      throw new Error("unform doesnt exist");
    }
  }
  drawElements(n) {
    this.gl.drawElements(
      this.gl.TRIANGLES,
      n,
      this.gl.UNSIGNED_INT,
      0
    );
  }
  sendMat4(pointer, data) {
    this.gl.uniformMatrix4fv(
      pointer,
      false,
      data
    );
  }
  sendFloat(pointer, data) {
    this.gl.uniform1f(
      pointer,
      data
    );
  }
  sendInt(pointer, data) {
    this.gl.uniform1i(
      pointer,
      data
    );
  }
};

// node_modules/gl-matrix/esm/common.js
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var degree = Math.PI / 180;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };

// node_modules/gl-matrix/esm/mat4.js
var mat4_exports = {};
__export(mat4_exports, {
  add: () => add,
  adjoint: () => adjoint,
  clone: () => clone,
  copy: () => copy,
  create: () => create,
  determinant: () => determinant,
  equals: () => equals,
  exactEquals: () => exactEquals,
  frob: () => frob,
  fromQuat: () => fromQuat,
  fromQuat2: () => fromQuat2,
  fromRotation: () => fromRotation,
  fromRotationTranslation: () => fromRotationTranslation,
  fromRotationTranslationScale: () => fromRotationTranslationScale,
  fromRotationTranslationScaleOrigin: () => fromRotationTranslationScaleOrigin,
  fromScaling: () => fromScaling,
  fromTranslation: () => fromTranslation,
  fromValues: () => fromValues,
  fromXRotation: () => fromXRotation,
  fromYRotation: () => fromYRotation,
  fromZRotation: () => fromZRotation,
  frustum: () => frustum,
  getRotation: () => getRotation,
  getScaling: () => getScaling,
  getTranslation: () => getTranslation,
  identity: () => identity,
  invert: () => invert,
  lookAt: () => lookAt,
  mul: () => mul,
  multiply: () => multiply,
  multiplyScalar: () => multiplyScalar,
  multiplyScalarAndAdd: () => multiplyScalarAndAdd,
  ortho: () => ortho,
  orthoNO: () => orthoNO,
  orthoZO: () => orthoZO,
  perspective: () => perspective,
  perspectiveFromFieldOfView: () => perspectiveFromFieldOfView,
  perspectiveNO: () => perspectiveNO,
  perspectiveZO: () => perspectiveZO,
  rotate: () => rotate,
  rotateX: () => rotateX,
  rotateY: () => rotateY,
  rotateZ: () => rotateZ,
  scale: () => scale,
  set: () => set,
  str: () => str,
  sub: () => sub,
  subtract: () => subtract,
  targetTo: () => targetTo,
  translate: () => translate,
  transpose: () => transpose
});
function create() {
  var out = new ARRAY_TYPE(16);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
function clone(a) {
  var out = new ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function transpose(out, a) {
  if (out === a) {
    var a01 = a[1], a02 = a[2], a03 = a[3];
    var a12 = a[6], a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
  return out;
}
function invert(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
function adjoint(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
function determinant(a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
function multiply(out, a, b) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
function translate(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
}
function scale(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function rotate(out, a, rad, axis) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;
  if (len < EPSILON) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;
  if (a !== out) {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}
function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  if (a !== out) {
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromRotation(out, rad, axis) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  if (len < EPSILON) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromRotationTranslation(out, q, v) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromQuat2(out, a) {
  var translation = new ARRAY_TYPE(3);
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw;
  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }
  fromRotationTranslation(out, a, translation);
  return out;
}
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
function getRotation(out, mat) {
  var scaling = new ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }
  return out;
}
function fromRotationTranslationScale(out, q, v, s) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
function fromQuat(out, q) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}
var perspective = perspectiveNO;
function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }
  return out;
}
function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
  var xScale = 2 / (leftTan + rightTan);
  var yScale = 2 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = yScale;
  out[6] = 0;
  out[7] = 0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near / (near - far);
  out[15] = 0;
  return out;
}
function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
var ortho = orthoNO;
function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];
  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity(out);
  }
  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }
  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }
  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
function targetTo(out, eye, target, up) {
  var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
  var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }
  var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
function str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
function multiplyScalarAndAdd(out, a, b, scale2) {
  out[0] = a[0] + b[0] * scale2;
  out[1] = a[1] + b[1] * scale2;
  out[2] = a[2] + b[2] * scale2;
  out[3] = a[3] + b[3] * scale2;
  out[4] = a[4] + b[4] * scale2;
  out[5] = a[5] + b[5] * scale2;
  out[6] = a[6] + b[6] * scale2;
  out[7] = a[7] + b[7] * scale2;
  out[8] = a[8] + b[8] * scale2;
  out[9] = a[9] + b[9] * scale2;
  out[10] = a[10] + b[10] * scale2;
  out[11] = a[11] + b[11] * scale2;
  out[12] = a[12] + b[12] * scale2;
  out[13] = a[13] + b[13] * scale2;
  out[14] = a[14] + b[14] * scale2;
  out[15] = a[15] + b[15] * scale2;
  return out;
}
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
function equals(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
  var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
  var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
  var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
  var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
}
var mul = multiply;
var sub = subtract;

// ts/utils/matrix4.ts
var Matrix4 = class _Matrix4 {
  constructor(source) {
    this.mat4 = source ? mat4_exports.clone(source) : mat4_exports.create();
    return this;
  }
  translate(vector) {
    mat4_exports.translate(
      this.mat4,
      this.mat4,
      vector.vec
    );
    return this;
  }
  invert(mat) {
    mat4_exports.invert(
      this.mat4,
      mat.mat4
    );
    return this;
  }
  transpose(mat) {
    mat4_exports.transpose(
      this.mat4,
      mat ? mat.mat4 : this.mat4
    );
    return this;
  }
  rotateAxis(angle, axis) {
    mat4_exports.rotate(
      this.mat4,
      this.mat4,
      angle,
      [[1, 0, 0], [0, 1, 0], [0, 0, 1]][axis]
    );
    return this;
  }
  rotate(rotation) {
    rotation.forEach((r, i) => {
      this.rotateAxis(r, i);
    });
    return this;
  }
  perspective(fov, near = 1, far = Infinity) {
    mat4_exports.perspective(
      this.mat4,
      fov,
      document.body.clientWidth / document.body.clientHeight,
      near,
      far
    );
    return this;
  }
  clone() {
    return new _Matrix4(this.mat4);
  }
};

// ts/gl/glRenderer.ts
var GLRenderer = class {
  constructor(game) {
    this.game = game;
    this.objects = [];
    this.gl = this.game.renderer.dom.getContext("webgl");
    this.gl.getExtension("OES_element_index_uint");
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.glt = new GLTranslator(this.game, this);
    this.game.renderer.getEvent("resize").subscribe("glr", (size) => {
      this.gl.viewport(0, 0, size.x, size.y);
    });
  }
  get t() {
    return this.game.t;
  }
  initGlElement(mesh) {
    this.objects.push(mesh);
  }
  clear() {
    this.gl.clearColor(...this.game.level.background);
    this.gl.clearDepth(1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  draw() {
    this.clear();
    this.gl.useProgram(this.glt.program);
    this.glt.sendUniform("uSampler", 0);
    this.glt.sendUniform(
      "uProjectionMatrix",
      new Matrix4().perspective(
        this.game.mode.camera.fov * Math.PI / 180,
        1,
        2e4
      ).translate(this.game.mode.camera.offset.multiply(1, 1, -1)).rotate(this.game.mode.camera.rotation).mat4
    );
    this.drawChildren(this.game.level, new Matrix4().translate(this.game.mode.camera.target.multiply(-1, 1, 1)));
  }
  drawChildren(element, currentModelview) {
    element.children.forEach((o) => {
      this.drawObject(o, currentModelview.clone());
    });
  }
  drawObject(mesh, currentModelview) {
    currentModelview.translate(mesh.position.multiply(new Vector3(1, 1, -1)));
    currentModelview.translate(mesh.anchorPoint.multiply(1, 1, -1));
    currentModelview.rotate(mesh.rotation.multiply(new Vector3(1, -1, -1)));
    currentModelview.translate(mesh.anchorPoint.multiply(-1, -1, 1));
    if (mesh.buffer) {
      this.renderMesh(mesh, currentModelview);
    }
    this.drawChildren(mesh, currentModelview);
  }
  renderMesh(mesh, currentModelview) {
    this.glt.sendBuffer(mesh.buffer.indices, "element");
    this.glt.sendAttribute("aVertexPosition", mesh.buffer.positionBuffer);
    this.glt.sendAttribute("aVertexNormal", mesh.buffer.normalBuffer);
    this.glt.sendAttribute("aTextureCoord", mesh.buffer.textureCoord);
    this.glt.sendUniform("uModelViewMatrix", currentModelview.mat4);
    this.glt.sendUniform("uOpacity", mesh.opacity);
    this.glt.sendUniform("uIntensity", mesh.colorIntensity);
    this.glt.sendUniform(
      "uNormalMatrix",
      new Matrix4().invert(currentModelview).transpose().mat4
    );
    this.glt.sendTexture(mesh.texture.texture);
    this.glt.drawElements(mesh.verticesCount);
  }
};

// ts/gl/elementBase.ts
var GlElement = class _GlElement extends Element {
  constructor(attr = {}) {
    var _a;
    super();
    this.rendererType = "gl";
    this.position = v3(0);
    this.size = v3(0);
    this.rotation = v3(0);
    this._active = true;
    this.readyState = false;
    this.children = [];
    this.controllers = [];
    this.anchoredPosition = Vector2.zero;
    this.autoReady = attr.autoReady !== void 0 ? attr.autoReady : true;
    this.addControllers(attr.controllers || []);
    this.size = attr.size || ((_a = this.parent) == null ? void 0 : _a.size) || v3(0);
    this.position = attr.position || v3(0);
    this.rotation = attr.rotation || v3(0);
    this.anchorPoint = attr.anchorPoint || v3(0);
  }
  get active() {
    return this._active;
  }
  set active(value) {
    this._active = value;
  }
  get camera() {
    return this.mode.camera;
  }
  set camera(c) {
    this.mode.camera = c;
  }
  get absolutePosition() {
    var _a;
    return (((_a = this.parent) == null ? void 0 : _a.absolutePosition) || v3(0)).add(this.position);
  }
  set absolutePosition(v) {
    this.position = v.subtract(this.parent.absolutePosition);
  }
  ready() {
    this.build();
    if (this.game.waitCount) {
      this.game.waitCount--;
    }
  }
  addChild(child) {
    var _a, _b;
    (_a = child.parent) != null ? _a : child.parent = this;
    (_b = child.game) != null ? _b : child.game = this.game;
    if (this.game.waitCount) {
      this.game.waitCount++;
    }
    this.children.push(child);
    if (child.autoReady) {
      child.ready();
    }
    _GlElement.registerControllers(child);
    if (child.type === "collider" && this.level) {
      this.level.colliders.push(child);
    }
    child.readyState = true;
    return child;
  }
  removeChild(child) {
    if (this.children.includes(child)) {
      this.children.splice(this.children.indexOf(child), 1);
    }
  }
  addControllers(c) {
    if (c.length > 0) {
      this.controllers.push(...c);
    }
  }
  static registerControllers(child) {
    child.controllers.forEach((controller) => {
      var _a, _b;
      if (controller.parent === void 0) {
        (_a = controller.parent) != null ? _a : controller.parent = child;
        (_b = controller.game) != null ? _b : controller.game = child.game;
        controller.build();
      }
    });
  }
  tick(obj) {
    this.controllers.filter((child) => child.active && child.order === "before").forEach((c) => c.tick(obj));
    this.children.filter((child) => child.active).forEach((c) => c.tick(obj));
    this.children.filter((child) => child.active).forEach((c) => c.afterTick(obj));
  }
  afterTick(obj) {
    this.controllers.filter((child) => child.active && child.order === "after").forEach((c) => c.tick(obj));
  }
};

// ts/gl/group.ts
var GLGroup = class extends GlElement {
  constructor() {
    super(...arguments);
    this.type = "group";
  }
};

// ts/gl/objStorage.ts
var ObjStorage = class {
  constructor() {
    this.registered = {};
  }
  check(url) {
    const item = Object.entries(this.registered).find(([u]) => u === url);
    return item ? item[1] : false;
  }
  register(url, user) {
    const o = this.check(url);
    if (o) {
      o.using.push(user);
      if (o.ready) {
        this.callBack(user, o.origin);
      }
      return false;
    } else {
      this.registered[url] = {
        ready: false,
        origin: user,
        using: []
      };
      return true;
    }
  }
  callBack(user, origin) {
    user.giveData(origin.getData());
    if (user.readyState) {
      user.build();
    } else {
      user.autoReady = true;
    }
  }
  loaded(url) {
    const o = this.check(url);
    if (o && !o.ready) {
      o.ready = true;
      o.using.forEach((user) => this.callBack(user, o.origin));
    }
  }
};

// ts/utils/mode.ts
var Mode = class extends GLGroup {
  constructor(attr = {}) {
    super(attr);
    this.levels = {};
    this.keyAliases = {
      "w": "up",
      "a": "left",
      "s": "down",
      "d": "right",
      " ": "space",
      "ArrowUp": "up",
      "ArrowLeft": "left",
      "ArrowDown": "down",
      "ArrowRight": "right"
    };
    this.input = {
      "up": false,
      "left": false,
      "down": false,
      "right": false,
      "space": false
    };
  }
  get camera() {
    return this.level.camera;
  }
  set camera(value) {
    this.level.camera = value;
  }
  build() {
    this.game.active.mode = this;
    this.storage = new ObjStorage();
    this.switchLevel(Object.keys(this.levels)[0]);
  }
  addLevel(s, level) {
    this.levels[s] = level;
    this.addChild(level);
  }
  switchLevel(s) {
    Object.entries(this.levels).forEach(([key, level]) => {
      level.active = key === s;
    });
  }
  keyDown(e) {
    if (Object.keys(this.keyAliases).includes(e.key)) {
      this.input[this.keyAliases[e.key]] = true;
    }
  }
  keyUp(e) {
    if (Object.keys(this.keyAliases).includes(e.key)) {
      this.input[this.keyAliases[e.key]] = false;
    }
  }
  tick(obj) {
    super.tick(obj);
    this.controllers.filter((child) => child.active).forEach((c) => c.tick(obj));
    this.children.filter((child) => child.active).forEach((c) => c.tick(obj));
  }
};

// ts/utils/level.ts
var Level = class extends GlElement {
  constructor(attr = {}) {
    super(attr);
    this.type = "group";
    this.colliders = [];
    this._camera = {
      target: Vector3.f(0),
      rotation: Vector3.f(0),
      offset: Vector3.f(0),
      fov: 60
    };
    this.size = this.size;
  }
  get camera() {
    return this._camera;
  }
  set camera(value) {
    this._camera = value;
  }
  build() {
    this.game.active.level = this;
  }
};

// ts/gl/character.ts
var Character = class extends GlElement {
  constructor(attr) {
    super(attr);
    this.type = "group";
    this.stat = {};
  }
};

// ts/gl/rendable.ts
var GLRendable = class extends GlElement {
  constructor(attr = {}) {
    super(attr);
    this.colorIntensity = 1;
    this.opacity = 1;
    this.colors = [];
    this.opacity = attr.opacity !== void 0 ? attr.opacity : 1;
    this.colorIntensity = attr.colorIntensity !== void 0 ? attr.colorIntensity : 1;
  }
  build() {
    this.buffer = {
      positionBuffer: this.GLT.createBuffer(this.positionBuffer(this.size)),
      indices: this.GLT.createBuffer(this.indexBuffer(), "element", Uint32Array),
      textureCoord: this.GLT.createBuffer(this.textureBuffer(this.size)),
      normalBuffer: this.GLT.createBuffer(this.normalBuffer())
    };
    this.GLR.initGlElement(this);
  }
  ready() {
    this.build();
    if (this.game.waitCount) {
      this.game.waitCount--;
    }
  }
};

// ts/gl/texture.ts
var GLTexture = class {
  constructor(game, attr) {
    this.game = game;
    if (attr.image) {
      this.loadTexture(attr.image);
    } else if (attr.url) {
      this.game.waitCount++;
      this.image = new Image();
      this.image.onload = () => {
        this.game.waitCount--;
        this.loadTexture(this.image);
      };
      this.image.src = "".concat(window.location.href, "/").concat(attr.url);
    } else {
      this.loadColor(attr.color || [[0.8, 0.8, 0.7, 1]]);
    }
  }
  static textureOffset(index, total) {
    const inc = 1 / total;
    return [
      index * inc + inc / 3,
      0,
      index * inc + inc / 3,
      1,
      (index + 1) * inc - inc / 3,
      0
    ];
  }
  loadColor(colors) {
    const ss = document.createElement("canvas");
    ss.width = colors.length;
    ss.height = 1;
    const ssCTX = ss.getContext("2d");
    for (let x = 0; x < colors.length; x++) {
      const color = colors[x];
      ssCTX.fillStyle = "rgba(".concat(color[0] * 255, ", ").concat(color[1] * 255, ", ").concat(color[2] * 255, ", ").concat(color[3], ")");
      ssCTX.fillRect(
        x,
        0,
        1,
        1
      );
    }
    this.loadTexture(ss);
  }
  loadTexture(img) {
    const gl = this.game.gl;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      img
    );
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    if (this.isPowerOf2(img.width) && this.isPowerOf2(img.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    this.texture = texture;
  }
  isPowerOf2(value) {
    return (value & value - 1) === 0;
  }
};

// ts/gl/obj.ts
var GLobj = class extends GLRendable {
  constructor(attr = {}) {
    super(__spreadValues(__spreadValues({}, attr), { autoReady: false }));
    this.type = "mesh";
    this.verticesCount = 0;
    this.matIndeces = [];
    this.mats = {};
    this.matsData = {};
    this.positionIndeces = [];
    this.indexIndeces = [];
    this.normalIndeces = [];
    this.textureIndeces = [];
    this.texturePositionIndeces = [];
    this.opacity = attr.opacity !== void 0 ? attr.opacity : 1;
    this.colorIntensity = attr.colorIntensity !== void 0 ? attr.colorIntensity : 1;
    this.path = attr.url.split("/").slice(0, -1).join("/") + "/";
    if (attr.storage) {
      if (attr.storage.register(attr.url, this)) {
        this.loadFile("".concat(window.location.href, "/obj/").concat(attr.url)).then(this.parseMtl.bind(this)).then(this.parseObj.bind(this)).then(() => {
          this.ready();
          attr.storage.loaded(attr.url);
        });
      }
    } else {
      this.loadFile("".concat(window.location.href, "/obj/").concat(attr.url)).then(this.parseMtl.bind(this)).then(this.parseObj.bind(this)).then(() => {
        this.ready();
      });
    }
  }
  getData() {
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
  giveData(data) {
    this.verticesCount = data.verticesCount;
    this.matIndeces = data.matIndeces;
    this.matsData = data.matsData;
    this.positionIndeces = data.positionIndeces;
    this.indexIndeces = data.indexIndeces;
    this.normalIndeces = data.normalIndeces;
    this.texturePositionIndeces = data.texturePositionIndeces;
  }
  async parseMtl(str2) {
    if (/mtllib/.test(str2)) {
      await this.loadFile("".concat(window.location.href, "obj/").concat(this.path).concat(str2.split(/mtllib/)[1].split(/\n/)[0].trim())).then((v) => {
        v.split("newmtl ").slice(1).forEach((s) => {
          const lines = s.split(/\r\n|\r|\n/).filter((n) => n);
          this.matsData[lines.shift()] = Object.fromEntries(lines.map((line) => {
            const a = line.split(" ");
            return [a.shift(), a];
          }));
        });
      });
      return str2;
    } else {
      return str2;
    }
  }
  parseFaces(lineArray, mat, points, normals, tCoords) {
    const textRemainder = lineArray.slice(1);
    const numbRemainder = textRemainder.map(Number);
    ({
      usemtl: () => {
        mat = textRemainder[0];
      },
      f: () => {
        if (numbRemainder.length === 3) {
          this.positionIndeces.push(...points[numbRemainder[0] - 1]);
          this.positionIndeces.push(...points[numbRemainder[1] - 1]);
          this.positionIndeces.push(...points[numbRemainder[2] - 1]);
        } else if (numbRemainder.length === 6) {
          this.positionIndeces.push(...points[numbRemainder[0] - 1]);
          this.positionIndeces.push(...points[numbRemainder[2] - 1]);
          this.positionIndeces.push(...points[numbRemainder[4] - 1]);
          this.texturePositionIndeces.push(...tCoords[numbRemainder[1] - 1]);
          this.texturePositionIndeces.push(...tCoords[numbRemainder[3] - 1]);
          this.texturePositionIndeces.push(...tCoords[numbRemainder[5] - 1]);
        } else {
          this.positionIndeces.push(...points[numbRemainder[0] - 1]);
          this.positionIndeces.push(...points[numbRemainder[3] - 1]);
          this.positionIndeces.push(...points[numbRemainder[6] - 1]);
          this.texturePositionIndeces.push(...tCoords[numbRemainder[1] - 1]);
          this.texturePositionIndeces.push(...tCoords[numbRemainder[4] - 1]);
          this.texturePositionIndeces.push(...tCoords[numbRemainder[7] - 1]);
          this.normalIndeces.push(...normals[numbRemainder[2] - 1]);
          this.normalIndeces.push(...normals[numbRemainder[5] - 1]);
          this.normalIndeces.push(...normals[numbRemainder[8] - 1]);
          this.textureIndeces.push(
            ...GLTexture.textureOffset(Object.keys(this.mats).indexOf(mat), Object.keys(this.mats).length)
          );
        }
        this.indexIndeces.push(this.indexIndeces.length);
        this.indexIndeces.push(this.indexIndeces.length);
        this.indexIndeces.push(this.indexIndeces.length);
        this.matIndeces.push(mat);
        this.matIndeces.push(mat);
        this.matIndeces.push(mat);
      }
    }[lineArray[0]] || (() => {
    }))();
    return mat;
  }
  parseObj(str2) {
    let mat = "none";
    const lines = str2.split(/\r\n|\r|\n/);
    const nonVertex = [];
    const points = [];
    const normals = [];
    const tCoords = [];
    lines.forEach(async (line) => {
      const words = line.split(/(?: |\/)/);
      const command = words[0];
      const numbers = words.slice(1).map(Number);
      if (command === "v") {
        points.push([numbers[0], numbers[1], numbers[2]]);
      } else if (command === "vn") {
        normals.push([numbers[0], numbers[1], numbers[2]]);
      } else if (command === "vt") {
        tCoords.push([numbers[0], numbers[1]]);
      } else {
        nonVertex.push(words);
      }
    });
    nonVertex.forEach((words) => {
      mat = this.parseFaces(words, mat, points, normals, tCoords);
    });
    this.verticesCount = this.indexIndeces.length;
  }
  async loadFile(url) {
    const response = await fetch(url);
    const data = await response.text();
    return data;
  }
  indexBuffer() {
    return this.indexIndeces;
  }
  positionBuffer(size) {
    return this.positionIndeces.map((n, i) => n * size.array[i % 3]);
  }
  normalBuffer() {
    return this.normalIndeces;
  }
  textureBuffer(size) {
    this.texture = new GLTexture(this.game, {});
    if (Object.values(this.matsData).length) {
      const matArray = Object.values(this.matsData);
      const matImage = matArray.find((m) => m.map_Kd);
      if (matImage) {
        this.texture = new GLTexture(this.game, {
          url: "obj/".concat(this.path).concat(matImage.map_Kd.join(" ").trim())
        });
      } else {
        this.texture = new GLTexture(this.game, {
          color: matArray.map((m) => [
            ...m.Kd ? m.Kd.map(Number) : [0, 0, 0],
            m.d ? Number(m.d[0]) : 1
          ])
        });
      }
    }
    return this.texturePositionIndeces;
  }
};

// ts/utils/colors.ts
var Colors = class {
};
Colors.k = [0, 0, 0, 1];
Colors.r = [1, 0, 0, 1];
Colors.g = [0, 1, 0, 1];
Colors.b = [0, 0, 1, 1];
Colors.y = [1, 1, 0, 1];
Colors.c = [0, 1, 1, 1];
Colors.m = [1, 0, 1, 1];
Colors.w = [1, 1, 1, 1];

// ts/gl/cuboid.ts
var GLCuboid = class _GLCuboid extends GLRendable {
  constructor(attr) {
    super(attr);
    this.type = "mesh";
    this.colors = [];
    this.verticesCount = 36;
    this.dimensions = 0 | 1 | 2 | 3;
    this.dimensions = attr.size.array.filter((v) => v !== 0).length;
    if (this.dimensions < 2) {
      return;
    }
    this.verticesCount = this.dimensions === 3 ? 36 : 6;
    this.faceCount = this.dimensions === 3 ? 6 : 1;
    this.textureUrl = attr.textureUrl;
    if (attr.colors)
      this.colors = attr.colors;
    else
      this.colors = [
        Colors.r,
        Colors.g,
        Colors.b,
        Colors.c,
        Colors.m,
        Colors.y
      ].slice(0, this.faceCount);
  }
  build() {
    super.build();
    this.texture = new GLTexture(this.game, this.textureUrl ? { url: this.textureUrl } : { color: this.colors });
  }
  indexBuffer() {
    let b = this.getBufferData().index.slice(0, this.faceCount * 6);
    return b;
  }
  positionBuffer(size) {
    return _GLCuboid.scale(
      _GLCuboid.sliceToDimension(
        this.getBufferData().position,
        this.size,
        72
      ),
      size
    );
  }
  normalBuffer() {
    return _GLCuboid.sliceToDimension(
      this.getBufferData().normal,
      this.size,
      72
    );
  }
  textureBuffer() {
    let b = [];
    if (this.textureUrl) {
      return _GLCuboid.sliceToDimension(
        this.getBufferData().texture,
        this.size,
        48
      );
    } else {
      const inc = 1 / this.faceCount;
      for (let index = 0; index < this.faceCount; index++) {
        b.push(
          index * inc + inc / 3,
          0,
          index * inc + inc / 3,
          1,
          (index + 1) * inc - inc / 3,
          0,
          (index + 1) * inc - inc / 3,
          0
        );
      }
    }
    return b;
  }
  getIndexBufferData() {
    return [
      0,
      1,
      2,
      0,
      2,
      3,
      4,
      5,
      6,
      4,
      6,
      7,
      8,
      9,
      10,
      8,
      10,
      11,
      12,
      13,
      14,
      12,
      14,
      15,
      16,
      17,
      18,
      16,
      18,
      19,
      20,
      21,
      22,
      20,
      22,
      23
    ];
  }
  getPositionBufferData() {
    return [
      0,
      0,
      -1,
      1,
      0,
      -1,
      1,
      1,
      -1,
      0,
      1,
      -1,
      0,
      0,
      -0,
      0,
      1,
      -0,
      1,
      1,
      -0,
      1,
      0,
      -0,
      0,
      1,
      -0,
      0,
      1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      -0,
      0,
      0,
      -0,
      1,
      0,
      -0,
      1,
      0,
      -1,
      0,
      0,
      -1,
      1,
      0,
      -0,
      1,
      1,
      -0,
      1,
      1,
      -1,
      1,
      0,
      -1,
      0,
      0,
      -0,
      0,
      0,
      -1,
      0,
      1,
      -1,
      0,
      1,
      -0
    ];
  }
  getNormalBufferData() {
    return [
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0
    ];
  }
  getTextureBufferData() {
    return [
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ];
  }
  getBufferData() {
    return {
      index: this.getIndexBufferData(),
      position: this.getPositionBufferData(),
      normal: this.getNormalBufferData(),
      texture: this.getTextureBufferData()
    };
  }
  static sliceToDimension(array, size, total) {
    const s = total / 6;
    if (size.z === 0)
      array = array.slice(0, s * 1);
    else if (size.x === 0)
      array = array.slice(s * 5, s * 6);
    else if (size.y === 0)
      array = array.slice(s * 3, s * 4);
    return array;
  }
  static scale(array, size) {
    return size ? array.map((n, i) => n * size.array[i % 3]) : array;
  }
};

// ts/utils/skeleton_bone.ts
var Bone = class extends GLGroup {
  constructor(attr = {}) {
    super(attr);
    this.mesh = attr.mesh === void 0 ? false : attr.mesh;
    this.length = attr.length === void 0 ? 10 : attr.length;
    this.profile = attr.profile || v2(0);
    this.speed = attr.speed === void 0 ? 0.02 : attr.speed;
    this.baseRotation = attr.baseRotation || v3(0);
    this.basePosition = this.position || v3(0);
    this.size = v3(this.profile.x, this.length, this.profile.y);
    if (!attr.anchorPoint) {
      this.anchorPoint = v3(
        this.profile.x / 2,
        this.length,
        this.profile.y / 2
      );
    }
    this.rotation = this.baseRotation;
  }
  setRotation(r, dynamically = false) {
    this.target = this.baseRotation.add(r.clone());
    if (!dynamically) {
      this.rotation = this.target.clone();
    }
  }
  setPosition(r, dynamically = false) {
    this.position = this.basePosition.add(r.clone());
  }
  tick(obj) {
    super.tick(obj);
    if (!this.target)
      return;
    const dif = this.rotation.subtract(this.target);
    if (dif.magnitude() === 0)
      return;
    const movement = v3(
      this.target.x > this.rotation.x ? Math.abs(dif.x) : -Math.abs(dif.x),
      this.target.y > this.rotation.y ? Math.abs(dif.y) : -Math.abs(dif.y),
      this.target.z > this.rotation.z ? Math.abs(dif.z) : -Math.abs(dif.z)
    ).clamp(
      v3(-this.speed, -this.speed, -this.speed).scale(obj.interval / 6),
      v3(this.speed, this.speed, this.speed).scale(obj.interval / 6)
    );
    this.rotation = this.rotation.add(movement);
  }
  build() {
    super.build();
    if (this.mesh) {
      this.addChild(new GLCuboid({
        colors: [[0.8, 0.8, 0.8, 1], [0.8, 0.8, 0.8, 1], [0.8, 0.8, 0.8, 1], [0.8, 0.8, 0.8, 1], [0.8, 0.8, 0.8, 1], [0.8, 0.8, 0.8, 1]],
        size: this.size
      }));
    }
  }
};

// ts/utils/animation.ts
var Animation = class {
  constructor(attr) {
    this.interval = 0;
    this._active = false;
    this.bones = attr.bones || {};
    this.data = attr.data || {};
    this.time = attr.time || 0;
    this.loop = attr.loop || false;
    this.once = attr.once || false;
    this.dynamic = attr.dynamic || false;
  }
  get active() {
    return this._active;
  }
  set active(value) {
    this._active = value;
    if (!value) {
      this.interval = 0;
    }
  }
  setBoneTransform(key, transform) {
    const bone = this.bones[key];
    if (bone) {
      bone.setRotation(v3(transform[0] || 0, transform[1] || 0, transform[2] || 0), this.dynamic);
      bone.setPosition(v3(transform[3] || 0, transform[4] || 0, transform[5] || 0), this.dynamic);
    }
  }
  setBoneToValue(key, value) {
    let before = this.data[key][0];
    let after = this.data[key][this.data[key].length - 1];
    this.data[key].forEach((d) => {
      if (d[0] >= before[0] && d[0] <= value) {
        before = Util.padArray(d, 0, 7);
      }
      if (d[0] <= after[0] && d[0] >= value) {
        after = Util.padArray(d, 0, 7);
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
      )
    );
  }
  setBonesToValue(n) {
    Object.keys(this.bones).forEach((b) => {
      this.setBoneToValue(b, n);
    });
  }
  stop() {
    Object.values(this.bones).forEach((b) => {
      b.active = true;
    });
  }
  tick(interval) {
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
};
var Animator = class {
  constructor(attr) {
    this.animations = {};
    this.bones = {};
    this.bones = attr.bones || {};
  }
  add(key, time, data, attr = {}) {
    this.animations[key] = new Animation({
      bones: this.bones,
      loop: attr.loop || false,
      once: attr.once || false,
      dynamic: attr.dynamic || false,
      time,
      data
    });
    return this.get(key);
  }
  get(key) {
    return this.animations[key];
  }
  stop() {
    Object.values(this.animations).forEach((a) => {
      a.active = false;
    });
  }
  play(key) {
    Object.entries(this.animations).forEach(([k, a]) => {
      a.active = k === key;
    });
  }
  replay(key) {
    this.stop();
    Object.entries(this.animations).find((k) => k[0] === key)[1].active = true;
  }
  tick(interval) {
    Object.values(this.animations).forEach((a) => a.tick(interval));
  }
};

// ts/utils/skeleton.ts
var Skeleton = class extends GLGroup {
  constructor(attr = {}) {
    super(attr);
    this.bones = {};
    this.parentage = {};
    attr.bones.forEach((o) => {
      this.bones[o[0]] = o[1];
      if (o[2]) {
        this.parentage[o[0]] = o[2];
      }
    });
  }
  build() {
    super.build();
    Object.entries(this.bones).forEach(([key, b]) => {
      if (this.parentage[key]) {
        this.bones[this.parentage[key]].addChild(b);
      } else {
        this.addChild(b);
      }
    });
    this.animator = new Animator({ bones: this.bones });
  }
  tick(obj) {
    super.tick(obj);
    this.animator.tick(obj.interval);
  }
};

// ts/utils/skeleton_human.ts
var HumanSkeleton = class extends Skeleton {
  constructor(attr) {
    super({
      bones: [
        ["hips", new Bone({ profile: v2(attr.hipsWidth, 1), length: attr.hips, position: v3(0, attr.legUpper + attr.legLower + attr.foot, 2) }), ""],
        ["torso", new Bone({ anchorPoint: v3(attr.shoulderWidth / 2, 0, 0), baseRotation: v3(0, 0, 0), profile: v2(attr.shoulderWidth, 1), length: attr.torso, position: v3(-(attr.shoulderWidth - attr.hipsWidth) / 2, attr.hips, 0) }), "hips"],
        ["head", new Bone({ profile: v2(4, 3), length: attr.head, anchorPoint: v3(2, 0, 1), position: v3((attr.shoulderWidth - 4) / 2, attr.torso + 1, -1) }), "torso"],
        ["lArmUpper", new Bone({ profile: v2(1), baseRotation: v3(-0.1, 0, 0.4), length: attr.armUpper, position: v3(0, attr.torso - attr.armUpper, 0) }), "torso"],
        ["rArmUpper", new Bone({ profile: v2(1), baseRotation: v3(-0.1, 0, -0.4), length: attr.armUpper, position: v3(attr.shoulderWidth - 1, attr.torso - attr.armUpper, 0) }), "torso"],
        ["lArmLower", new Bone({ baseRotation: v3(0.2, 0, -0.3), profile: v2(1), length: attr.armLower, position: v3(0, -attr.armLower, 0) }), "lArmUpper"],
        ["rArmLower", new Bone({ baseRotation: v3(0.2, 0, 0.3), profile: v2(1), length: attr.armLower, position: v3(0, -attr.armLower, 0) }), "rArmUpper"],
        ["lHand", new Bone({ profile: v2(1), length: attr.hand, position: v3(0, -attr.hand, 0) }), "lArmLower"],
        ["rHand", new Bone({ profile: v2(1), length: attr.hand, position: v3(0, -attr.hand, 0) }), "rArmLower"],
        ["lLegUpper", new Bone({ profile: v2(1), length: attr.legUpper, position: v3(0, -attr.legUpper, 0) }), "hips"],
        ["rLegUpper", new Bone({ profile: v2(1), length: attr.legUpper, position: v3(attr.hipsWidth - 1, -attr.legUpper, 0) }), "hips"],
        ["lLegLower", new Bone({ profile: v2(1), length: attr.legLower, position: v3(0, -attr.legLower, 0) }), "lLegUpper"],
        ["rLegLower", new Bone({ profile: v2(1), length: attr.legLower, position: v3(0, -attr.legLower, 0) }), "rLegUpper"],
        ["lFoot", new Bone({ profile: v2(1, 3), length: attr.foot, position: v3(-0, -attr.foot, -0) }), "lLegLower"],
        ["rFoot", new Bone({ profile: v2(1, 3), length: attr.foot, position: v3(-0, -attr.foot, -0) }), "rLegLower"]
      ]
    });
    this.sizes = attr;
  }
};

// ts/modes/side/player_skeleton.ts
var PlayerSkel = class extends HumanSkeleton {
  constructor() {
    super({
      "head": 6,
      "armUpper": 5,
      "armLower": 9,
      "hand": 0,
      "legUpper": 9,
      "legLower": 5,
      "foot": 1,
      "torso": 5.5,
      "hips": 3,
      "hipsWidth": 6,
      "shoulderWidth": 8
    });
  }
  build() {
    super.build();
    this.bones["head"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-10-Head.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(2, -9.5, 2) }));
    this.bones["torso"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-8-TorsoUpper.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(this.sizes.shoulderWidth / 2, -3, 1) }));
    this.bones["hips"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-9-TorsoLower.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(3, 0, 1) }));
    this.bones["lLegUpper"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-0-lLegUpper.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(3, 9, 1) }));
    this.bones["rLegUpper"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-1-rLegUpper.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(-2, 9, 1) }));
    this.bones["lLegLower"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-2-lLegLower.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(3, 14.4, 1.5) }));
    this.bones["rLegLower"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-3-rLegLower.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(-2, 14.4, 1.5) }));
    this.bones["lArmUpper"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-4-lArmUpper.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(8.5, 7, 1) }));
    this.bones["rArmUpper"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-5-rArmUpper.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, -Math.PI / 2), position: v3(-7.5, 7, 1) }));
    this.bones["lArmLower"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-6-lArmLower.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(8.5, 16, 1) }));
    this.bones["rArmLower"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-7-rArmLower.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, -Math.PI / 2), position: v3(-7.5, 16, 1) }));
    this.animator.add("running", 2e3, {
      torso: [
        [0, -0.3, -0.3, 0],
        [0.5, -0.3, 0.3, 0],
        [1, -0.3, -0.3, 0]
      ],
      hips: [
        [0, -0.3, 0, 0],
        [0.5, -0.3, 0, 0],
        [1, -0.3, 0, 0]
      ],
      head: [
        [0, 0.2, 0.2, 0],
        [0.5, 0.2, -0.2, 0],
        [1, 0.2, 0.2, 0]
      ],
      lArmUpper: [
        [0, -0.8, 0, 0.1],
        [0.5, 1.2, 0, 0.1],
        [1, -0.8, 0, 0.1]
      ],
      lArmLower: [
        [0, 0.3, 0, 0],
        [0.5, 1.2, 0, -1.2],
        [1, 0.3, 0, 0]
      ],
      lHand: [
        [0],
        [0.5],
        [1]
      ],
      rArmUpper: [
        [0, 1.2, 0, -0.1],
        [0.5, -0.8, 0, -0.1],
        [1, 1.2, 0, -0.1]
      ],
      rArmLower: [
        [0, 1.2, 0, 1.2],
        [0.5, 0.3, 0, 0],
        [1, 1.2, 0, 1.2]
      ],
      rHand: [
        [0],
        [0.5],
        [1]
      ],
      lLegUpper: [
        [0, 1.2, 0, 0],
        [0.5],
        [1, 1.2, 0, 0]
      ],
      lLegLower: [
        [0, -0.3, 0, 0],
        [0.5, -2, 0, 0],
        [1, -0.3, 0, 0]
      ],
      lFoot: [
        [0, -0.2, 0, 0],
        [0.5, -0.2, 0, 0],
        [1, -0.2, 0, 0]
      ],
      rLegUpper: [
        [0],
        [0.5, 1.2, 0, 0],
        [1]
      ],
      rLegLower: [
        [0, -2, 0, 0],
        [0.5, -0.3, 0, 0],
        [1, -2, 0, 0]
      ],
      rFoot: [
        [0, -0.2, 0, 0],
        [0.5, -0.2, 0, 0],
        [1, -0.2, 0, 0]
      ]
    }, { loop: true });
    this.animator.add("jumping", 500, {
      torso: [[0], [1]],
      hips: [[0], [1, -0.1, -0.1, 0.15]],
      head: [[0], [1, 0.3, 0, 0]],
      lArmUpper: [[0], [1, -0.2, 0, 0.1]],
      lArmLower: [[0], [1, 0, 0, 0.2]],
      lHand: [[0], [1]],
      rArmUpper: [[0], [1, -0.1, 0, -0.3]],
      rArmLower: [[0], [1, 0, 0, 0.2]],
      rHand: [[0], [1]],
      lLegUpper: [[0], [1, 2, 0, 0]],
      lLegLower: [[0], [1, -2.4, 0, 0]],
      lFoot: [[0], [1]],
      rLegUpper: [[0], [1, -0.2, 0, 0]],
      rLegLower: [[0], [1, -0.3, 0, 0]],
      rFoot: [[0], [1, -0.6, 0, 0]]
    }, { once: true });
    this.animator.add("idle", 15e3, {
      torso: [[0]],
      hips: [[0]],
      head: [[0, 0, 0.5], [0.4, 0, 0.5], [0.5, 0, -0.5], [0.9, 0, -0.5], [1, 0, 0.5]],
      lArmUpper: [[0]],
      lArmLower: [[0]],
      lHand: [[0]],
      rArmUpper: [[0]],
      rArmLower: [[0]],
      rHand: [[0]],
      lLegUpper: [[0]],
      lLegLower: [[0]],
      lFoot: [[0]],
      rLegUpper: [[0]],
      rLegLower: [[0]],
      rFoot: [[0]]
    }, { loop: true, dynamic: true });
    this.animator.play("running");
  }
  tick(obj) {
    super.tick(obj);
    if (!this.parent.stat.ground) {
      this.animator.play("jumping");
    } else {
      if (this.parent.stat.running) {
        this.animator.play("running");
      } else {
        this.animator.play("idle");
      }
    }
  }
};

// ts/gl/controller.ts
var GlController = class extends GlElement {
  constructor() {
    super(...arguments);
    this.type = "controller";
    this.order = "before";
  }
};

// ts/utils/collisions.ts
var Collisions = class _Collisions {
  static boxesOverlap(aP, aS, bP, bS) {
    return aP.x < bP.x + bS.x && aP.x + aS.x > bP.x && aP.y < bP.y + bS.y && aP.y + aS.y > bP.y && aP.z < bP.z + bS.z && aP.z + aS.z > bP.z;
  }
  static pointInBox(p, bP, bS) {
    return p.x < bP.x + bS.x && p.x > bP.x && p.y < bP.y + bS.y && p.y > bP.y && p.z < bP.z + bS.z && p.z > bP.z;
  }
  static edgeCrossesBox(p1, p2, boxPosition, boxSize) {
    return p1.x < boxPosition.x + boxSize.x && p1.x > boxPosition.x && p1.y < boxPosition.y + boxSize.y && p1.y > boxPosition.y && p1.z < boxPosition.z + boxSize.z && p1.z > boxPosition.z;
  }
  static overlapDirection(aP, aS, bP, bS, v) {
    let result = [];
    if (_Collisions.boxesOverlap(aP, aS, new Vector3(bP.x, bP.y + v.y), bS)) {
      result.push(v.y > 0 ? ["y", aP.y - bP.y - bS.y] : ["y", aP.y + aS.y - bP.y]);
    }
    if (_Collisions.boxesOverlap(aP, aS, new Vector3(bP.x + v.x, bP.y), bS)) {
      result.push(v.x < 0 ? ["x", aP.x + aS.x - bP.x] : ["x", aP.x - bP.x - bS.x]);
    }
    return result;
  }
  static check(statics, dynamic, velocity) {
    return statics.filter(
      (s) => _Collisions.boxesOverlap(s.position, s.size, dynamic.position.add(velocity), dynamic.size)
      // r.push(...Collisions.overlapDirection(s.position.add(s.parent instanceof Level ? v3(0) : s.parent.position), s.size, dynamic[0], dynamic[1], velocity));
      // if (!s.condition || s.condition()){
      // }
    );
  }
};

// ts/modes/side/player_controller.ts
var MovementController = class extends GlController {
  constructor() {
    super(...arguments);
    this.intr = { fall: 0, jump: 0, landDelay: 0 };
    this.stat = { jumping: false, falling: false, running: false };
    this.cnst = { runTime: 250, runSlowDownFactor: 0.7, runSpeed: 0.5, minJumpTime: 200, jumpTime: 300, jumpSpeed: 0.6 };
    this.velocity = Vector3.f(0);
  }
  setMovementVelocity(interval) {
    const setter = (key, cond, interval2) => {
      this.intr[key] = Util.clamp((this.intr[key] || 0) + (cond ? interval2 : -(interval2 * this.cnst.runSlowDownFactor)), 0, this.cnst.runTime);
    };
    setter("right", this.mode.input.right && !this.mode.input.left, interval);
    setter("left", this.mode.input.left && !this.mode.input.right, interval);
    setter("up", this.mode.input.up && !this.mode.input.down, interval);
    setter("down", this.mode.input.down && !this.mode.input.up, interval);
    const plane = v2(
      (this.intr.right - this.intr.left) / this.cnst.runTime,
      (this.intr.up - this.intr.down) / this.cnst.runTime
    ).clampMagnitude(1).scale(this.cnst.runSpeed);
    this.velocity = v3(
      plane.x,
      0,
      plane.y
    );
  }
  determineStates(interval) {
    if (this.parent.stat.falling) {
      this.parent.stat.jumping = false;
    } else {
      if (this.parent.stat.jumping) {
        if (this.intr.jump < this.cnst.minJumpTime) {
          this.parent.stat.jumping = true;
          this.parent.stat.falling = false;
        } else if (this.intr.jump < this.cnst.jumpTime) {
          this.parent.stat.jumping = this.mode.input.space;
        } else {
          this.parent.stat.jumping = false;
          this.parent.stat.falling = true;
          this.intr.jump = this.cnst.jumpTime;
        }
      } else {
        this.parent.stat.jumping = this.mode.input.space;
      }
    }
  }
  setJumpVelocity(interval) {
    this.determineStates(interval);
    if (this.parent.stat.jumping) {
      this.intr.jump = Math.min(this.intr.jump + interval, this.cnst.jumpTime);
      this.intr.fall = -this.intr.jump;
    } else if (this.parent.stat.falling) {
      this.intr.jump = this.cnst.jumpTime;
      this.intr.fall += interval;
    } else {
      this.velocity.y = 0;
      return;
    }
    const y = (this.cnst.jumpTime - this.intr.jump - this.intr.fall) / this.cnst.jumpTime * this.cnst.jumpSpeed;
    this.velocity.y = y;
  }
  setVelocity(obj) {
    this.setMovementVelocity(obj.interval);
    this.setJumpVelocity(obj.interval);
    const sc = this.velocity.scale(obj.interval / 6);
    if (sc.xz.magnitude() > 0) {
      const [x, z] = sc.xz.rotate(-this.camera.rotation.y).array;
      this.newPosition = this.parent.absolutePosition.add(v3(x, sc.y, z));
      if (this.mode.input.right || this.mode.input.left || this.mode.input.up || this.mode.input.down) {
        this.parent.rotation = this.camera.rotation.multiply(0, 1, 0).add(v3(0, Math.PI / 2, 0)).add(v3(0, -sc.xz.angle(), 0));
      }
      this.parent.stat.running = true;
    } else {
      this.newPosition = this.parent.absolutePosition.add(v3(0, sc.y, 0));
      this.parent.stat.running = false;
    }
  }
  colliders(obj) {
    this.parent.stat.ground = false;
    this.level.colliders.forEach((col) => {
      if (Collisions.boxesOverlap(col.absolutePosition, col.size, this.newPosition, this.parent.size)) {
        if (col.direction.equals(Vector3.up) && this.velocity.y <= 0) {
          this.velocity.y = Math.max(this.velocity.y, 0);
          this.parent.stat.falling = false;
          this.intr.fall = 0;
          this.intr.jump = 0;
          this.newPosition.y = col.absolutePosition.y + col.size.y - 1;
          this.parent.stat.ground = true;
        }
      }
    });
    if (!this.parent.stat.jumping) {
      this.parent.stat.falling = !this.parent.stat.ground;
    }
  }
  tick(obj) {
    super.tick(obj);
    this.setVelocity(obj);
    this.colliders(obj);
    this.parent.absolutePosition = this.newPosition.clone();
  }
};

// ts/modes/side/player_camera.ts
var FreeCamera = class extends GlController {
  constructor(target) {
    super({ autoReady: false });
    this.target = target;
    this.type = "controller";
    this.order = "after";
    this.lagList = [];
    this.lagCount = 8;
  }
  get active() {
    return super.active;
  }
  set active(value) {
    super.active = value;
    if (value) {
      this.camera.offset = v3(0, -15, 60);
      this.camera.rotation = v3(0.3, Math.PI / 8, 0);
      this.camera.fov = 60;
    }
  }
  mouseMove(e) {
    const r = v2(e.movementX, e.movementY).scale(5e-3);
    this.camera.rotation = v3(
      Util.clamp(this.camera.rotation.x + r.y, -1, Math.PI / 2),
      this.camera.rotation.y + r.x,
      this.camera.rotation.z
    );
  }
  drag(d) {
    const r = d.scale(0.01);
    this.camera.rotation = v3(
      Util.clamp(this.camera.rotation.x + r.y, -1, Math.PI / 2),
      this.camera.rotation.y + r.x,
      this.camera.rotation.z
    );
  }
  scroll(e) {
    this.camera.offset.z = Util.clamp(this.camera.offset.z + e.deltaY * 0.1, 10, 300);
  }
  build() {
    super.build();
    this.active = true;
  }
  tick(o) {
    super.tick(o);
    const nP = this.target.position.add(this.target.size.multiply(0.5, 0.5, 0.5)).multiply(1, -1, 1);
    while (this.lagList.length < this.lagCount) {
      this.lagList.push(nP);
    }
    this.camera.target = this.lagList.shift();
  }
};

// ts/modes/side/player_actor.ts
var Player = class extends Character {
  constructor({
    position = Vector3.f(0),
    size = Vector3.f(0),
    rotation = Vector3.f(0)
  } = {}) {
    super({
      position,
      size,
      rotation,
      anchorPoint: size.multiply(0.5, 0, 0.5)
    });
    this.stat = { jumping: false, falling: false, running: false, fallAnimation: false };
    this.addControllers([new FreeCamera(this), new MovementController(this)]);
  }
  build() {
    GlElement.registerControllers(this);
    this.skeleton = new PlayerSkel();
    this.addChild(this.skeleton);
  }
};

// ts/gl/pyramid.ts
var GLPyramid = class _GLPyramid extends GLRendable {
  constructor(attr) {
    super(attr);
    this.type = "mesh";
    this.colors = [];
    this.verticesCount = 30;
    this.dimensions = 0 | 1 | 2 | 3;
    this.faceCount = 5;
    this.dimensions = attr.size.array.filter((v) => v !== 0).length;
    if (this.dimensions < 2) {
      return;
    }
    this.textureUrl = attr.textureUrl;
    if (attr.colors)
      this.colors = attr.colors;
    else
      this.colors = [
        Colors.r,
        Colors.g,
        Colors.b,
        Colors.c,
        Colors.m,
        Colors.y
      ].slice(0, this.faceCount);
  }
  build() {
    super.build();
    this.texture = new GLTexture(this.game, this.textureUrl ? { url: this.textureUrl } : { color: this.colors });
  }
  indexBuffer() {
    let b = this.getBufferData().index.slice(0, this.faceCount * 6);
    return b;
  }
  positionBuffer(size) {
    return _GLPyramid.scale(
      this.getBufferData().position,
      size
    );
  }
  normalBuffer() {
    return this.getBufferData().normal;
  }
  textureBuffer() {
    let b = [];
    if (this.textureUrl) {
      return this.getBufferData().texture;
    } else {
      const inc = 1 / this.faceCount;
      for (let index = 0; index < this.faceCount; index++) {
        b.push(
          index * inc + inc / 3,
          0,
          index * inc + inc / 3,
          1,
          (index + 1) * inc - inc / 3,
          0,
          (index + 1) * inc - inc / 3,
          0
        );
      }
    }
    return b;
  }
  getIndexBufferData() {
    return [
      0,
      1,
      2,
      0,
      2,
      3,
      4,
      5,
      6,
      4,
      6,
      7,
      8,
      9,
      10,
      8,
      10,
      11,
      12,
      13,
      14,
      12,
      14,
      15,
      16,
      17,
      18,
      16,
      18,
      19
    ];
  }
  getPositionBufferData() {
    return [
      0,
      0,
      -1,
      1,
      0,
      -1,
      0.5,
      1,
      -0.5,
      0.5,
      1,
      -0.5,
      0,
      0,
      -0,
      0.5,
      1,
      -0.5,
      0.5,
      1,
      -0.5,
      1,
      0,
      -0,
      0,
      0,
      -0,
      1,
      0,
      -0,
      1,
      0,
      -1,
      0,
      0,
      -1,
      1,
      0,
      -0,
      0.5,
      1,
      -0.5,
      0.5,
      1,
      -0.5,
      1,
      0,
      -1,
      0,
      0,
      -0,
      0,
      0,
      -1,
      0.5,
      1,
      -0.5,
      0.5,
      1,
      -0.5
    ];
  }
  getNormalBufferData() {
    return [
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0
    ];
  }
  getTextureBufferData() {
    return [
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ];
  }
  getBufferData() {
    return {
      index: this.getIndexBufferData(),
      position: this.getPositionBufferData(),
      normal: this.getNormalBufferData(),
      texture: this.getTextureBufferData()
    };
  }
  static scale(array, size) {
    return size ? array.map((n, i) => n * size.array[i % 3]) : array;
  }
};

// ts/utils/arrow.ts
var Arrow = class extends GLGroup {
  constructor(attr) {
    super(attr);
    this.direction = attr.direction = v3(1, 0, 0);
    this.width = attr.width || 2;
    this.length = attr.length || 4;
    this.colors = attr.colors || [Colors.r];
  }
  build() {
    const s = new GLCuboid({
      position: v3(-this.width / 4, 0, -this.width / 4),
      size: v3(this.width / 2, this.length / 2, this.width / 2),
      colors: this.colors
    });
    this.addChild(s);
    const p = new GLPyramid({
      position: v3(-this.width / 2, this.length / 2, -this.width / 2),
      size: v3(this.width, this.length / 2, this.width),
      colors: [Colors.r]
    });
    this.addChild(p);
  }
};

// ts/utils/collider.ts
var Collider = class extends GlElement {
  constructor(attr) {
    super(attr);
    this.type = "collider";
    this.colliderType = "static";
    this.direction = attr.direction;
    this.showMesh = attr.showMesh || false;
    this.showArrows = attr.showArrows || false;
  }
  build() {
    if (this.showMesh) {
      this.debugObject = this.addChild(new GLCuboid({
        size: this.size,
        colors: [Colors.c]
      }));
      if (this.showArrows) {
        this.debugObject.addChild(new Arrow({
          position: this.size.multiply(v3(1, 1, 1)),
          rotation: Vector3.up.multiply(this.direction)
        }));
        this.debugObject.addChild(new Arrow({
          position: this.size.multiply(v3(1, 1, 0)),
          rotation: Vector3.up.multiply(this.direction)
        }));
        this.debugObject.addChild(new Arrow({
          position: this.size.multiply(v3(0, 1, 1)),
          rotation: Vector3.up.multiply(this.direction)
        }));
        this.debugObject.addChild(new Arrow({
          position: this.size.multiply(v3(1, 0, 1)),
          rotation: Vector3.up.multiply(this.direction)
        }));
        this.debugObject.addChild(new Arrow({
          position: this.size.multiply(v3(1, 0, 0)),
          rotation: Vector3.up.multiply(this.direction)
        }));
        this.debugObject.addChild(new Arrow({
          position: this.size.multiply(v3(0, 1, 0)),
          rotation: Vector3.up.multiply(this.direction)
        }));
        this.debugObject.addChild(new Arrow({
          position: this.size.multiply(v3(0, 0, 1)),
          rotation: Vector3.up.multiply(this.direction)
        }));
        this.debugObject.addChild(new Arrow({
          position: this.size.multiply(v3(0, 0, 0)),
          rotation: Vector3.up.multiply(this.direction)
        }));
      }
    }
  }
};

// ts/modes/side/car_controller.ts
var CarController = class extends GlController {
  constructor() {
    super(...arguments);
    this.intr = { fall: 0, jump: 0, landDelay: 0 };
    this.cnst = { runTime: 5e3, runSlowDownFactor: 0.1, runSpeed: 2 };
    this.velocity = Vector3.f(0);
    this.direction = 0;
  }
  setMovementVelocity(interval) {
    if (this.mode.input.space) {
      this.intr.acc = 0;
    } else if (this.mode.input.up) {
      this.intr.acc = Util.clamp((this.intr.acc | 0) + interval, -(this.cnst.runTime / 3), this.cnst.runTime);
    }
    {
      if (this.mode.input.down) {
        this.intr.acc = Util.clamp((this.intr.acc | 0) - interval * 0.8, -(this.cnst.runTime / 3), this.cnst.runTime);
      } else {
        if (this.intr.acc >= 0) {
          this.intr.acc = Util.clamp((this.intr.acc | 0) - interval * this.cnst.runSlowDownFactor, 0, this.cnst.runTime);
        } else {
          this.intr.acc = Util.clamp((this.intr.acc | 0) + interval * this.cnst.runSlowDownFactor, -(this.cnst.runTime / 3), 0);
        }
      }
    }
    this.direction = this.direction - 1e-3 * interval * (+this.mode.input.left - +this.mode.input.right) * (1.5 - this.intr.acc / this.cnst.runTime) * (this.intr.acc / this.cnst.runTime);
    this.parent.rotation = v3(0, this.direction, 0);
    const plane = Vector2.up.clampMagnitude(1).scale(this.intr.acc / this.cnst.runTime).scale(this.cnst.runSpeed).rotate(-this.direction);
    this.velocity = v3(
      plane.x,
      0,
      plane.y
    );
  }
  setJumpVelocity(interval) {
    if (this.parent.stat.falling) {
      this.intr.fall += interval;
    } else {
      this.velocity.y = 0;
      return;
    }
    this.velocity.y = 0;
  }
  setVelocity(obj) {
    this.setMovementVelocity(obj.interval);
    this.setJumpVelocity(obj.interval);
    const sc = this.velocity.scale(obj.interval / 6);
    if (sc.xz.magnitude() > 0) {
      const [x, z] = sc.xz.array;
      this.newPosition = this.parent.absolutePosition.add(v3(x, sc.y, z));
    } else {
      this.newPosition = this.parent.absolutePosition.add(v3(0, sc.y, 0));
    }
  }
  colliders(obj) {
    this.parent.stat.ground = false;
    if (!this.parent.stat.jumping) {
      this.parent.stat.falling = !this.parent.stat.ground;
    }
  }
  build() {
    super.build();
    this.direction = this.parent.rotation.y;
  }
  tick(obj) {
    super.tick(obj);
    this.setVelocity(obj);
    this.colliders(obj);
    this.parent.absolutePosition = this.newPosition.clone();
  }
};

// ts/modes/side/car_camera.ts
var CarCamera = class extends GlController {
  constructor(target) {
    super({ autoReady: false });
    this.target = target;
    this.type = "controller";
    this.order = "after";
    this.lagList = [];
    this.lagCount = 8;
  }
  get active() {
    return super.active;
  }
  set active(value) {
    super.active = value;
    if (value) {
      this.camera.offset = v3(0, -15, 200);
      this.camera.rotation = v3(0.15, 0, 0);
      this.camera.fov = 70;
    }
  }
  mouseMove(e) {
    const r = v2(e.movementX, e.movementY).scale(5e-3);
    this.camera.rotation = v3(
      Util.clamp(this.camera.rotation.x + r.y, -0.1, Math.PI / 2),
      this.camera.rotation.y + r.x,
      this.camera.rotation.z
    );
  }
  build() {
  }
  scroll(e) {
    this.camera.offset.z = Util.clamp(this.camera.offset.z + e.deltaY * 0.1, 100, 200);
  }
  tick(o) {
    super.tick(o);
    const nP = this.target.position.add(this.target.size.multiply(0.5, 0.5, 0.5)).multiply(1, -1, 1);
    while (this.lagList.length < this.lagCount) {
      this.lagList.push(nP);
    }
    this.camera.target = this.lagList.shift();
  }
};

// ts/modes/side/car_actor.ts
var Driver = class extends Character {
  constructor({
    position = Vector3.f(0),
    size = Vector3.f(0),
    rotation = Vector3.f(0)
  } = {}) {
    super({
      position,
      size,
      rotation,
      anchorPoint: size.multiply(0.5, 0, 0.5)
    });
    this.stat = { jumping: false, falling: false, running: false, fallAnimation: false };
    this.addControllers([new CarController(this), new CarCamera(this)]);
  }
  build() {
    GlElement.registerControllers(this);
    this.addChild(new GLobj({ storage: this.mode.storage, url: "Shop-3-Car.obj", size: v3(18, 18, 18), position: v3(18, 12, 47), rotation: v3(0, -Math.PI / 2, 0) }));
  }
  tick(obj) {
    super.tick(obj);
  }
};

// ts/modes/side/npc_skeleton.ts
var npcSkeleton = class extends HumanSkeleton {
  constructor() {
    super({
      "head": 6,
      "armUpper": 5,
      "armLower": 9,
      "hand": 0,
      "legUpper": 9,
      "legLower": 5,
      "foot": 1,
      "torso": 5.5,
      "hips": 3,
      "hipsWidth": 6,
      "shoulderWidth": 8
    });
  }
  build() {
    super.build();
    this.bones["head"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-10-Head.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(2, -9.5, 2) }));
    this.bones["torso"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-8-TorsoUpper.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(this.sizes.shoulderWidth / 2, -3, 1) }));
    this.bones["hips"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-9-TorsoLower.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(3, 0, 1) }));
    this.bones["lLegUpper"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-0-lLegUpper.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(3, 9, 1) }));
    this.bones["rLegUpper"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-1-rLegUpper.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(-2, 9, 1) }));
    this.bones["lLegLower"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-2-lLegLower.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(3, 14.4, 1.5) }));
    this.bones["rLegLower"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-3-rLegLower.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(-2, 14.4, 1.5) }));
    this.bones["lArmUpper"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-4-lArmUpper.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(8.5, 7, 1) }));
    this.bones["rArmUpper"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-5-rArmUpper.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, -Math.PI / 2), position: v3(-7.5, 7, 1) }));
    this.bones["lArmLower"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-6-lArmLower.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(8.5, 16, 1) }));
    this.bones["rArmLower"].addChild(new GLobj({ colorIntensity: 0.7, url: "worker/worker-7-rArmLower.obj", size: v3(6, 6, 6), rotation: v3(0, Math.PI, -Math.PI / 2), position: v3(-7.5, 16, 1) }));
    this.animator.add("idle", 15e3, {
      torso: [[0]],
      hips: [[0]],
      head: [[0, 0, 0.5], [0.4, 0, 0.5], [0.5, 0, -0.5], [0.9, 0, -0.5], [1, 0, 0.5]],
      lArmUpper: [[0]],
      lArmLower: [[0]],
      lHand: [[0]],
      rArmUpper: [[0]],
      rArmLower: [[0]],
      rHand: [[0]],
      lLegUpper: [[0]],
      lLegLower: [[0]],
      lFoot: [[0]],
      rLegUpper: [[0]],
      rLegLower: [[0]],
      rFoot: [[0]]
    }, { loop: true, dynamic: true });
    this.animator.play("idle");
  }
};

// ts/modes/side/npc_actor.ts
var NPC = class extends Character {
  constructor({
    position = Vector3.f(0),
    size = Vector3.f(0),
    rotation = Vector3.f(0)
  } = {}) {
    super({
      position,
      size,
      rotation,
      anchorPoint: size.multiply(0.5, 0, 0.5)
    });
    this.stat = { jumping: false, falling: false, running: false, fallAnimation: false };
  }
  build() {
    GlElement.registerControllers(this);
    this.skeleton = new npcSkeleton();
    this.addChild(this.skeleton);
  }
};

// ts/modes/side/level.ts
var World = class extends Level {
  constructor() {
    super(...arguments);
    this.start = Vector2.zero;
    this.background = [0.67451 * 0.6, 0.603922 * 0.6, 0.968627 * 0.9, 1];
  }
  keyDown(e) {
    if (e.key === "Enter") {
      this.drive();
    }
  }
  drive(b = !this.driving) {
    this.driving = b;
    this.player.active = !this.driving;
    this.car.active = this.driving;
    if (this.driving) {
      this.player.position = v3(0, -100, 0);
    } else {
      this.player.position = this.car.position.add(v3(10, 0, 0).rotateXZ(-this.car.rotation.xz.angle())).clone();
    }
  }
  spawnTile(x, y) {
    const p = v3(
      200 * x - 2e3,
      -3,
      200 * y - 100
    );
    if (Math.random() < 0.5) {
      this.addChild(new GLobj({ colorIntensity: 1.2, storage: this.mode.storage, url: "CountrySide-3-GroundTile1.obj", size: v3(20, 20, 20), position: p }));
    } else {
      this.addChild(new GLobj({ colorIntensity: 1.2, storage: this.mode.storage, url: "CountrySide-2-GroundTile2.obj", size: v3(20, 20, 20), position: p }));
    }
    if (![9, 10, 11].includes(x) || ![3, 4].includes(y)) {
      for (let rx = 0; rx < 5; rx++) {
        for (let ry = 0; ry < 5; ry++) {
          if (Math.random() < 0.1) {
            this.addChild(new GLobj({
              storage: this.mode.storage,
              url: ["CountrySide-6-Vegetation5.obj", "CountrySide-0-Vegetation3.obj", "CountrySide-6-Vegetation5.obj", "CountrySide-8-Rock.obj"][Math.floor(Math.random() * 4)],
              size: v3(
                10,
                10,
                10
              ).scale(Math.ceil(Math.random() * 3)),
              position: p.add(v3(
                40 * rx + Math.random() * 6,
                3,
                40 * ry + Math.random() * 6 - 80
              )),
              rotation: v3(
                0,
                Math.floor(Math.random() * 4) * Math.PI,
                0
              )
            }));
          }
        }
      }
    }
  }
  spawnRoad(x, y) {
    if (Math.random() < 0.5) {
      this.addChild(new GLobj({ storage: this.mode.storage, url: "apoc/VoxelNuke-18-RoadTile-1.obj", size: v3(100, 100, 100), position: v3(x * 200 - 2200, -6, y * 200 - 100) }));
    } else {
      this.addChild(new GLobj({ storage: this.mode.storage, url: "apoc/VoxelNuke-17-RoadTile-0.obj", size: v3(100, 100, 100), position: v3(x * 200 - 2e3, -6, y * 200 - 100) }));
    }
    for (let i = 0; i < 6; i++) {
      if (Math.random() < 0.2) {
        this.addChild(new GLobj({ storage: this.mode.storage, url: "apoc/VoxelNuke-0-Overgrowth-0.obj", size: v3(50, 50, 50), position: v3(x * 200 - 2e3 + i * 33, -4, y * 200 - 55) }));
      }
      if (Math.random() < 0.2) {
        this.addChild(new GLobj({ storage: this.mode.storage, url: "apoc/VoxelNuke-0-Overgrowth-0.obj", size: v3(50, 50, 50), position: v3(x * 200 - 2e3 + i * 33, -4, y * 200 - 145), rotation: v3(0, Math.PI, 0) }));
      }
    }
  }
  build() {
    super.build();
    this.addChild(new NPC({
      size: v3(6, 33, 8),
      position: v3(220, 11, 736),
      rotation: v3(0, Math.PI, 0)
    }));
    this.player = new Player({
      size: v3(6, 33, 8),
      position: v3(150, 1, 500),
      rotation: v3(0, -2.3, 0)
    });
    this.addChild(this.player);
    this.car = new Driver({
      size: v3(36, 26, 93),
      position: v3(130, 1, 600),
      rotation: v3(0, 2.3, 0)
    });
    this.addChild(this.car);
    this.car.active = false;
    this.addChild(new GLCuboid({ size: v3(3500, 1, 5e3), position: v3(-5600, -2, -2e3), colors: [[0.476378 * 0.96, 0.547244 * 0.96, 0.492126 * 0.96, 1]] }));
    this.addChild(new GLCuboid({ size: v3(4e3, 1, 5e3), position: v3(1900, -2, -2e3), colors: [[0.476378 * 0.96, 0.547244 * 0.96, 0.492126 * 0.96, 1]] }));
    this.addChild(new GLCuboid({ size: v3(4e3, 1, 1800), position: v3(-2100, -2, -2e3), colors: [[0.476378 * 0.96, 0.547244 * 0.96, 0.492126 * 0.96, 1]] }));
    this.addChild(new GLCuboid({ size: v3(4e3, 1, 800), position: v3(-2100, -2, 2200), colors: [[0.476378 * 0.96, 0.547244 * 0.96, 0.492126 * 0.96, 1]] }));
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 12; y++) {
        if (y === 3) {
          this.spawnRoad(x, y);
        } else {
          this.spawnTile(x, y);
        }
      }
    }
    this.addChild(new GLobj({ storage: this.mode.storage, url: "CountrySide-5-House.obj", size: v3(18, 18, 18), position: v3(200, 43, 800), rotation: v3(0, -Math.PI / 2, 0) }));
    this.addChild(new GLobj({ storage: this.mode.storage, url: "CountrySide-4-Vegetation1.obj", size: v3(20, 20, 20), rotation: v3(0, Math.PI, 0), position: v3(-100 - 20, 5, 670) }));
    this.addChild(new GLobj({ storage: this.mode.storage, url: "CountrySide-4-Vegetation1.obj", size: v3(25, 25, 25), rotation: v3(0, 0, 0), position: v3(-20 - 20, 6, 760) }));
    this.addChild(new GLobj({ storage: this.mode.storage, url: "CountrySide-4-Vegetation1.obj", size: v3(25, 25, 25), rotation: v3(0, Math.PI / 2, 0), position: v3(0 - 20, 3, 670) }));
    this.addChild(new GLobj({ storage: this.mode.storage, url: "Plane01.obj", size: v3(30, 30, 30), position: v3(420, 16, 720), rotation: v3(0, Math.PI / 4 + Math.PI / 2, -0.12) }));
    this.addChild(new GLobj({ storage: this.mode.storage, url: "Medieval Town - Pack 1-0.obj", size: v3(10, 10, 10), position: v3(0, -1, 500) }));
    this.addChild(new GLobj({ storage: this.mode.storage, url: "Medieval Town - Pack 1-1.obj", size: v3(10, 10, 10), position: v3(0, -1, 500) }));
    this.addChild(new GLobj({ storage: this.mode.storage, url: "Medieval Town - Pack 1-2.obj", size: v3(10, 10, 10), position: v3(0, -1, 500) }));
    this.addChild(new GLobj({ storage: this.mode.storage, url: "Nuclear Survival - Pack 6 - m.obj", size: v3(10, 10, 10), position: v3(0, -6, 300), rotation: v3(0, -Math.PI / 2, 0) }));
    [
      [v3(-5e3, -1e3, -2e3), v3(1e4, 1e3, 4e3), Vector3.up, false],
      // floor
      [v3(150, -3, 727), v3(100, 15, 168), Vector3.up, false]
      // floor
    ].forEach(([position, size, direction, show]) => {
      this.addChild(new Collider({ position, size, direction, showMesh: show === void 0 ? false : show, showArrows: false }));
    });
  }
};

// ts/modes/side/mode.ts
var OpenWorldMode = class extends Mode {
  build() {
    super.build();
    this.addLevel("openWorld", new World());
    this.switchLevel("openWorld");
  }
};

// ts/game.ts
var Game = class {
  constructor() {
    this.modes = {};
    this.readyToStart = false;
    this._waitCount = 0;
    this.started = false;
    this.total = 0;
    this.active = {
      mode: void 0,
      level: void 0
    };
    this.build();
  }
  get t() {
    return this.renderer.tickerData;
  }
  get waitCount() {
    return this._waitCount;
  }
  set waitCount(value) {
    if (value > this._waitCount) {
      this.total++;
    }
    if (!this.started) {
      if (value === 0 && this.readyToStart) {
        this.start();
      } else {
        this.loader.update(value, this.total);
      }
    }
    this._waitCount = value;
  }
  build() {
    this.renderer = new Renderer(this);
    this.loader = new Loader();
    this.renderer.addChild(this.loader);
    this.GLR = new GLRenderer(this);
    this.setupModes();
    this.ticker = new Ticker();
    this.ticker.add(this.tick.bind(this));
    this.input = new Input(this);
    this.debug();
    this.fps.visible = false;
    if (this.waitCount === 0) {
      this.start();
    } else {
      this.readyToStart = true;
    }
  }
  tick(obj) {
    this.renderer.tick(obj);
  }
  setupModes() {
    this.addMode("side", new OpenWorldMode());
    this.switchMode("side");
  }
  debug() {
    this.fps = new FPS();
    this.renderer.appendChild(this.fps);
    this.ticker.add(this.fps.tick.bind(this.fps));
  }
  addMode(s, mode) {
    this.modes[s] = mode;
    this.renderer.addMode(mode);
  }
  switchMode(s) {
    document.title = s;
    this.active.mode = this.modes[s];
    Object.entries(this.modes).forEach(([key, mode]) => {
      mode.active = key === s;
    });
  }
  get mode() {
    return this.active.mode;
  }
  get level() {
    return this.active.level;
  }
  get gl() {
    return this.GLR.gl;
  }
  start() {
    this.started = true;
    this.loader.visible = false;
    this.fps.visible = true;
    this.ticker.start();
  }
};

// ts/index.ts
document.addEventListener("DOMContentLoaded", () => {
  const g = new Game();
  document.body.appendChild(g.renderer.dom);
});
//# sourceMappingURL=index.js.map
