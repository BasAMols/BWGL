var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// ts/utils/vector2.ts
var Vector2 = class _Vector2 {
  constructor(x, y) {
    this.x = x === void 0 ? 0 : x;
    this.y = y === void 0 ? 0 : y;
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

// ts/utils/elementPosition.ts
var ElementPosition = class {
  constructor(attr = {}) {
    this.active = true;
    this.relativity = "relative";
    this.lastPosition = Vector2.zero;
    this.movedAmount = Vector2.zero;
    this._x = 0;
    this._y = 0;
    this.relativity = attr.relativity;
    if (attr.position) {
      this.position = attr.position;
      this._x = attr.position.x;
      this._y = attr.position.y;
    }
  }
  get x() {
    return this._x;
  }
  set x(n) {
    this._x = n;
  }
  get y() {
    return this._y;
  }
  set y(n) {
    this._y = n;
  }
  get position() {
    return new Vector2(this.x, this.y);
  }
  set position(value) {
    this.x = value.x;
    this.y = value.y;
  }
  tick(obj) {
    if (this.active) {
      this.movedAmount = this.lastPosition.subtract(this.position);
      this.lastPosition = this.position;
    }
  }
};

// ts/utils/elementZoom.ts
var ElementScale = class extends ElementPosition {
  // protected _scaleX: number = 1;
  // protected _scaleY: number = 1;
  // public get scaleX() {
  //     return this._scaleX;
  // };
  // public set scaleX(n) {
  //     this._scaleX = n;
  // };
  // public get scaleY() {
  //     return this._scaleY;
  // };
  // public set scaleY(n) {
  //     this._scaleY = n;
  // };
  // public get scale() {
  //     return new Vector2(this.scaleX, this.scaleY);
  // }
  // public set scale(value: Vector2) {
  //     this.scaleX = value.x;
  //     this.scaleY = value.y;
  // };
  constructor(attr = {}) {
    super(attr);
  }
};

// ts/utils/elementSize.ts
var ElementSize = class extends ElementScale {
  constructor(attr = {}) {
    super(attr);
    this._width = 0;
    this._height = 0;
    if (attr.size) {
      this._width = attr.size.x;
      this._height = attr.size.y;
    }
  }
  get width() {
    return this._width;
  }
  set width(n) {
    this._width = n;
  }
  get height() {
    return this._height;
  }
  set height(n) {
    this._height = n;
  }
  get size() {
    return new Vector2(this.width, this.height);
  }
  set size(value) {
    this.width = value.x;
    this.height = value.y;
  }
};

// ts/utils/elementVisible.ts
var ElementVisible = class extends ElementSize {
  constructor(attr = {}) {
    super(attr);
    this._visible = true;
    if (attr.visible !== void 0) {
      this.visible = attr.visible;
    }
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
  }
};

// ts/utils/element.ts
var Element = class extends ElementVisible {
  constructor() {
    super(...arguments);
    this.events = [];
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

// ts/dom/domElement.ts
var DomElement = class extends Element {
  constructor(type, attr = {}) {
    super(attr);
    this.children = [];
    this.rendererType = "dom";
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
    super.visible = value;
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
  tick(obj) {
    super.tick(obj);
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

// ts/canvas/canvasElement.ts
var CanvasElement = class extends Element {
  constructor(attr = {}) {
    super(attr);
    this.rendererType = "canvas";
    this.lowerChildren = [];
    this.higherChildren = [];
    this.controllers = [];
    this.anchoredPosition = Vector2.zero;
    this.hasDom = attr.hasDom || false;
    if (this.hasDom) {
      this.dom = new DomElement("div");
    }
    this.autoReady = attr.autoReady || false;
    this.addControllers(attr.controllers || []);
  }
  get x() {
    return super.x;
  }
  set x(n) {
    super.x = n;
    if (this.dom) {
      this.dom.x = n;
    }
  }
  get y() {
    return super.y;
  }
  set y(n) {
    super.y = n;
    if (this.dom) {
      this.dom.y = n;
    }
  }
  get width() {
    return super.width;
  }
  set width(n) {
    super.width = n;
    if (this.dom) {
      this.dom.width = n;
    }
  }
  get height() {
    return super.height;
  }
  set height(n) {
    super.height = n;
    if (this.dom) {
      this.dom.height = n;
    }
  }
  get renderPosition() {
    return this.position.add(this.anchoredPosition);
  }
  get renderX() {
    return this.renderPosition.x;
  }
  get renderY() {
    return this.renderPosition.y;
  }
  addChild(child, above = false) {
    var _a, _b, _c, _d;
    (_a = child.parent) != null ? _a : child.parent = this;
    (_b = child.game) != null ? _b : child.game = this.game;
    (_c = child.mode) != null ? _c : child.mode = this.mode;
    (_d = child.level) != null ? _d : child.level = this.level;
    this.game.waitCount++;
    if (child.rendererType === "canvas") {
      this[above ? "higherChildren" : "lowerChildren"].push(child);
      child.registerControllers(child);
      if (child.dom && this.hasDom) {
        this.dom.addChild(child.dom);
      }
    } else {
      if (this.hasDom) {
        this.dom.addChild(child);
      } else {
        console.log("The CanvasElement class does not have a dom element to add children to. Child:", child.constructor.name);
      }
    }
    if (!this.autoReady) {
      child.build();
      this.game.waitCount--;
    }
    if (child.rendererType === "canvas" && child.type === "collider" && child.colliderType === "static" && this.level) {
      this.level.colliders.push(child);
    }
  }
  addControllers(c) {
    if (c.length > 0) {
      this.controllers.push(...c);
    }
  }
  registerControllers(child) {
    child.controllers.forEach((controller) => {
      var _a, _b, _c, _d;
      if (controller.parent === void 0) {
        (_a = controller.parent) != null ? _a : controller.parent = child;
        (_b = controller.game) != null ? _b : controller.game = child.game;
        (_c = controller.mode) != null ? _c : controller.mode = child.mode;
        (_d = controller.level) != null ? _d : controller.level = child.level;
        controller.build();
      }
    });
  }
  tick(obj) {
    super.tick(obj);
    this.controllers.filter((child) => child.active).forEach((c) => c.tick(obj));
    this.lowerChildren.filter((child) => child.active).forEach((c) => c.tick(obj));
    this.higherChildren.filter((child) => child.active).forEach((c) => c.tick(obj));
    if (this.dom) {
      this.dom.tick(obj);
    }
  }
  preRender(c) {
    if (this.relativity === "anchor") {
      c.save();
      c.translate(this.x, this.y);
    }
    this.lowerChildren.filter((child) => child.visible && child.active).forEach((child) => {
      child.preRender(c);
      child.postRender(c);
    });
    this.render(c);
  }
  render(c) {
  }
  postRender(c) {
    this.higherChildren.filter((child) => child.visible && child.active).forEach((child) => {
      child.preRender(c);
      child.postRender(c);
    });
    if (this.relativity === "anchor") {
      c.restore();
    }
  }
};

// ts/canvas/canvasWrapper.ts
var CanvasWrapper = class extends CanvasElement {
  constructor() {
    super(...arguments);
    this.type = "wrapper";
    this.relativity = "anchor";
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
  }
};

// ts/utils/debug/fps.ts
var FPS = class _FPS extends DomText {
  constructor() {
    super({
      text: _FPS.getString(0),
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
  tick({ interval }) {
    this.fCount++;
    this.tCount += interval;
    if (this.tCount > 1e3) {
      this.text = _FPS.getString(this.fCount);
      this.fCount = 0;
      this.tCount = 0;
    }
  }
  static getString(v) {
    return "".concat(String(v), '<sub style="font-size:25px; top: -7px; position: relative">FPS</sub>');
  }
};

// ts/dom/domButton.ts
var DomButton = class extends DomText {
  constructor(attr) {
    super(attr);
    this.onClick = attr.onClick;
    this.dom.style.pointerEvents = "auto";
    this.dom.style.cursor = "pointer";
    this.dom.onclick = this.onClick;
  }
};

// ts/utils/mode.ts
var Mode = class extends CanvasWrapper {
  constructor() {
    super(...arguments);
    this.levels = {};
    this.relativity = "anchor";
    this.keyAliases = {
      "w": "up",
      "a": "left",
      "s": "down",
      "d": "right",
      "ArrowUp": "up",
      "ArrowLeft": "left",
      "ArrowDown": "down",
      "ArrowRight": "right"
    };
    this.input = {
      "up": false,
      "left": false,
      "down": false,
      "right": false
    };
  }
  build() {
    super.build();
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      this.size = size;
    });
  }
  addLevel(s, level) {
    this.levels[s] = level;
    this.addChild(level);
  }
  switchLevel(s) {
    Object.entries(this.levels).forEach(([key, level]) => {
      level.active = key === s;
      level.visible = key === s;
      level.dom ? level.dom.visible = key === s : null;
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
};

// ts/canvas/canvasColor.ts
var CanvasColor = class extends CanvasElement {
  constructor(attr = {}) {
    super(attr);
    this.type = "color";
    this.colorType = "color";
    this.strokeWidth = 0;
    this.color = attr.color;
    this.stroke = attr.stroke;
    this.strokeWidth = attr.strokeWidth | 0;
    this.linearGradient = attr.linearGradient;
    this.radialGradient = attr.radialGradient;
  }
  getColor() {
    if (this.colorType === "color") {
      return this.color;
    }
    if (this.colorType === "linearGradient") {
      return this.getLiniarGradient();
    }
    if (this.colorType === "radialGradient") {
      return this.getRadialGradient();
    }
  }
};

// ts/canvas/canvasSquare.ts
var CanvasSquare = class extends CanvasColor {
  constructor(attr = {}) {
    super(attr);
    this.shape = "square";
    this.color = attr.color;
    this.rounded = attr.rounded || 3;
    this.condition = attr.condition;
    this.opacity = attr.opacity || 1;
  }
  render(ctx) {
    if (!this.condition || this.condition(this.position.add(this.parent.position), this.size)) {
      ctx.fillStyle = this.getColor();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.roundRect(this.position.x, this.position.y, this.width, this.height, this.rounded);
      ctx.fill();
      if (this.strokeWidth) {
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.stroke || "black";
        ctx.stroke();
      }
      ctx.closePath();
    }
  }
  getLiniarGradient() {
    if (this.linearGradient) {
      const grd = this.game.renderer.ctx.createLinearGradient(
        this.position.x + this.anchoredPosition.x,
        this.position.y + this.anchoredPosition.y,
        this.position.x + this.anchoredPosition.x + this.width,
        this.position.y + this.anchoredPosition.y + this.height
      );
      this.linearGradient.stops.forEach(([number, color]) => {
        grd.addColorStop(number, color);
      });
      return grd;
    }
    return "";
  }
  getRadialGradient() {
    if (this.radialGradient) {
      const grd = this.game.renderer.ctx.createRadialGradient(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2,
        0,
        this.position.x + this.width / 2,
        this.position.y + this.height / 2,
        this.width
      );
      this.radialGradient.stops.forEach(([number, color]) => {
        grd.addColorStop(number, color);
      });
      return grd;
    }
    return "";
  }
};

// ts/canvas/canvasBackground.ts
var CanvasColorBackground = class extends CanvasSquare {
  constructor(color) {
    super({
      position: Vector2.zero,
      color
    });
  }
  build() {
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      this.size = this.parent.size;
    });
  }
};

// ts/utils/level.ts
var Level = class extends CanvasWrapper {
  constructor(attr = {}) {
    super(attr);
    this.relativity = "anchor";
    this.ready = false;
    this.colliders = [];
    this.level = this;
    this.mode = this.mode;
    this.size = this.size;
  }
};

// ts/canvas/canvasCircle.ts
var CanvasCircle = class extends CanvasColor {
  constructor(attr) {
    super(attr);
    this.shape = "circle";
    this.radius = attr.radius;
    this.radiusY = attr.radiusY || attr.radius;
    this.center = attr.center;
    this.angle = attr.angle || 0;
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    this._radius = value;
  }
  get radiusY() {
    return this._radiusY;
  }
  set radiusY(value) {
    this._radiusY = value;
  }
  get width() {
    return this.radius * 2;
  }
  set width(value) {
    this.radius = value / 2;
  }
  get height() {
    return this.radiusY * 2;
  }
  set height(value) {
    this.radiusY = value / 2;
  }
  render(ctx) {
    ctx.fillStyle = this.getColor();
    ctx.beginPath();
    ctx.ellipse(
      this.position.x,
      this.position.y,
      this.radius,
      this.radiusY,
      this.angle,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    if (this.strokeWidth) {
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.stroke || "black";
      ctx.stroke();
    }
    ctx.closePath();
  }
  getLiniarGradient() {
    if (this.linearGradient) {
      const grd = this.game.renderer.ctx.createLinearGradient(
        this.position.x + this.anchoredPosition.x - this.radius,
        this.position.y + this.anchoredPosition.y - this.radiusY,
        this.position.x + this.anchoredPosition.x + this.radius,
        this.position.y + this.anchoredPosition.y + this.radiusY
      );
      this.linearGradient.stops.forEach(([number, color]) => {
        grd.addColorStop(number, color);
      });
      return grd;
    }
    return "";
  }
  getRadialGradient() {
    if (this.radialGradient) {
      if (!this.radialGradient.offset) {
        this.radialGradient.offset = Vector2.zero;
      }
      const grd = this.game.renderer.ctx.createRadialGradient(
        this.position.x + this.anchoredPosition.x + this.radialGradient.offset.x,
        this.position.y + this.anchoredPosition.y + this.radialGradient.offset.y,
        0,
        this.position.x + this.anchoredPosition.x,
        this.position.y + this.anchoredPosition.y,
        Math.max(this.radius, this.radiusY)
      );
      this.radialGradient.stops.forEach(([number, color]) => {
        grd.addColorStop(number, color);
      });
      return grd;
    }
    return "";
  }
};

// ts/modes/snakeMode/parts/eye.ts
var Eye = class extends CanvasCircle {
  constructor(offset, size = 65) {
    super({
      radialGradient: {
        stops: [[0, "#666"], [0.5, "black"], [0.5, "white"], [1, "grey"]]
      },
      strokeWidth: 0.08 * size,
      radius: size,
      radiusY: size * 1.1,
      stroke: "black"
    });
    this.colorType = "radialGradient";
    this.offset = offset;
  }
  tick(obj) {
    super.tick(obj);
    this.radialGradient.offset = new Vector2(
      -this.radius * this.movedAmount.x * 0.2,
      -this.radiusY * this.movedAmount.y * 0.2
    );
    this.radialGradient.offset.x = Math.min(this.radialGradient.offset.x, this.radius * 0.6);
    this.radialGradient.offset.x = Math.max(this.radialGradient.offset.x, -this.radius * 0.6);
    this.radialGradient.offset.y = Math.min(this.radialGradient.offset.y, this.radiusY * 0.6);
    this.radialGradient.offset.y = Math.max(this.radialGradient.offset.y, -this.radiusY * 0.6);
    this.position = this.parent.position.subtract(this.offset);
  }
};

// ts/modes/snakeMode/parts/tail.ts
var Tail = class _Tail extends CanvasCircle {
  constructor({
    number,
    distance,
    total,
    topRadius = 120,
    bottomRadius = 20,
    controllers = []
  }) {
    super({
      position: new Vector2(200, 200),
      radius: (1 - number / total) * (topRadius - bottomRadius) + bottomRadius,
      color: "transparant",
      center: true,
      controllers
    });
    this.trace = [];
    this.moving = false;
    this.colorType = "radialGradient";
    this.number = number;
    this.distance = distance;
    this.total = total;
    this.visible = false;
    this.topRadius = topRadius;
    this.bottomRadius = bottomRadius;
  }
  add(total) {
    if (this.next) {
      this.next.add(total);
    } else {
      this.next = new _Tail({ number: this.number + 1, distance: this.distance, total, topRadius: this.topRadius, bottomRadius: this.bottomRadius, controllers: [] });
      this.next.colors = this.colors;
      this.addChild(this.next);
    }
  }
  follow(p) {
    this.trace.push(p);
    if (this.moving) {
      this.position = this.trace.shift().clone();
      if (this.next) {
        this.next.follow(this.position.clone());
      }
    } else if (this.trace.length === Math.max(3, Math.round(this.distance - this.number / this.total * this.distance))) {
      this.moving = true;
      this.position = this.trace[0].clone();
      this.visible = true;
      this.getColorGradient();
    } else {
      this.visible = false;
    }
  }
  getColorGradient() {
    const lin = 1 - this.number / this.total;
    const siz = (this.radius - this.topRadius) / this.topRadius;
    const h = lin * 360;
    const s = {
      rainbow: [
        [0.1, "hsla(".concat(h, ",0%,0%,").concat(70 * lin, "%)")],
        [0.68, "hsla(".concat(h, ",100%,50%,").concat(70 * lin, "%)")]
      ],
      green: [
        [0.1, "hsla(140,0%,0%,".concat(100, "%)")],
        [0.68, "hsla(140,45%,40%,".concat(100, "%)")]
      ],
      dark: [
        [0.1, "black"],
        [0.68, "black"]
      ]
    }[this.colors];
    if (1 - siz < 1) {
      s.push(
        [0.68, "black"],
        [0.68 + (1 - siz) * 0.03, "#00000011"],
        [0.68 + (1 - siz) * 0.03, "#00000005"],
        [1, "#00000000"]
      );
    } else {
      s.push(
        [0.68, "black"],
        [0.68 + (1 - siz) * 0.03, "black"],
        [0.68 + (1 - siz) * 0.03, "#00000011"],
        [1, "#00000000"]
      );
    }
    this.radialGradient = {
      stops: s,
      offset: new Vector2(10 * siz, 10 * siz)
    };
  }
};

// ts/modes/snakeMode/snake.ts
var Snake = class extends Tail {
  constructor({
    position = Vector2.zero,
    totals = 10,
    distance = 10,
    topRadius = 120,
    bottomRadius = 5,
    colors = "rainbow",
    controllers = []
  } = {}) {
    super({ number: 0, distance, total: totals, controllers, topRadius: topRadius + 25, bottomRadius });
    this.faceSize = topRadius;
    this.position = position;
    this.colors = colors;
  }
  build() {
    this.moving = true;
    this.visible = true;
    this.radius = this.faceSize * 1.2;
    this.radiusY = this.faceSize;
    this.strokeWidth = this.faceSize * 0.05;
    this.setcolor();
    for (let index = 0; index < this.total; index++) {
      this.add(this.total);
    }
    this.addChild(new Eye(new Vector2(-this.faceSize * 0.62, -this.faceSize * 0.4), this.faceSize * 0.6), true);
    this.addChild(new Eye(new Vector2(this.faceSize * 0.62, -this.faceSize * 0.4), this.faceSize * 0.6), true);
  }
  tick(obj) {
    super.tick(obj);
    if (this.next) {
      this.next.follow(this.position.clone());
    }
  }
  setcolor() {
    if (this.colors === "rainbow") {
      this.colorType = "linearGradient";
      this.linearGradient = {
        stops: [
          [0, "rgba(255,0,0,1)"],
          [0.1, "rgba(255,154,0,1)"],
          [0.2, "rgba(208,222,33,1)"],
          [0.3, "rgba(79,220,74,1)"],
          [0.4, "rgba(63,218,216,1)"],
          [0.5, "rgba(47,201,226,1)"],
          [0.6, "rgba(28,127,238,1)"],
          [0.7, "rgba(95,21,242,1)"],
          [0.8, "rgba(186,12,248,1)"],
          [0.9, "rgba(251,7,217,1)"],
          [1, "rgba(255,0,0,1)"]
        ],
        angle: 0
      };
    } else if (this.colors === "dark") {
      this.colorType = "radialGradient";
      this.radialGradient = {
        stops: [
          [0, "rgba(255,0,0,1)"],
          [0.1, "rgba(255,154,0,1)"],
          [0.2, "rgba(208,222,33,1)"],
          [0.3, "rgba(79,220,74,1)"],
          [0.4, "rgba(63,218,216,1)"],
          [0.5, "rgba(47,201,226,1)"],
          [0.6, "rgba(28,127,238,1)"],
          [0.7, "rgba(95,21,242,1)"],
          [0.8, "rgba(186,12,248,1)"],
          [0.9, "rgba(251,7,217,1)"],
          [1, "rgba(255,0,0,1)"]
        ]
      };
    } else if (this.colors === "green") {
      this.colorType = "radialGradient";
      this.radialGradient = {
        stops: [
          [0, "hsla(140,100%,20%,".concat(100, "%)")],
          [1, "hsla(140,45%,40%,".concat(100, "%)")]
        ]
      };
    }
  }
};

// ts/utils/controller.ts
var CanvasController = class extends CanvasElement {
  constructor() {
    super(...arguments);
    this.type = "logic";
  }
};

// ts/modes/snakeMode/controllers/bouncyController.ts
var BouncyController = class extends CanvasController {
  constructor(radius) {
    super();
    this.velocity = new Vector2(10, 0);
    this.bouncing = true;
    this.radius = radius;
  }
  tick(obj) {
    super.tick(obj);
    this.bounceGround();
    this.bounceWall();
  }
  bounceWall() {
    if (this.parent.position.add(this.velocity).x > this.level.width - this.radius) {
      this.velocity.x = -this.velocity.x * 0.8;
    } else if (this.parent.position.add(this.velocity).x < this.radius) {
      this.velocity.x = -this.velocity.x * 0.8;
    }
    if (this.bouncing) {
      this.parent.position.x += this.velocity.x;
    } else {
      this.velocity.x *= 0.98;
      this.parent.position.x += this.velocity.x;
    }
  }
  bounceGround() {
    if (this.bouncing) {
      if (this.parent.position.add(this.velocity).y > this.level.height - this.radius) {
        if (this.velocity.y > 5) {
          this.velocity.y = -this.velocity.y + 3;
        } else {
          this.land();
          return;
        }
      }
      this.velocity.y += 1;
      this.parent.position.y += this.velocity.y;
    }
  }
  land() {
    this.parent.position.y = this.level.height - this.radius;
    this.bouncing = false;
  }
};

// ts/modes/snakeMode/levels/bouncerLevel.ts
var BouncerLevel = class extends Level {
  constructor() {
    super();
    this.start = new Vector2(300, 400);
    this.background = new CanvasColorBackground("black");
    this.size = new Vector2(1145, 2e3);
  }
  build() {
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      this.size = size;
    });
    this.addChild(this.background);
    this.addChild(new Snake({ position: this.start, totals: 50, distance: 6, colors: "rainbow", controllers: [new BouncyController(120)] }));
  }
};

// ts/canvas/canvasRadialGradientBackground.ts
var CanvasRadialGradientBackground = class extends CanvasSquare {
  constructor(radialGradient) {
    super({
      position: Vector2.zero,
      radialGradient
    });
    this.colorType = "radialGradient";
  }
  build() {
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      this.size = this.level.size;
    });
  }
};

// ts/modes/snakeMode/controllers/randomController.ts
var RandomController = class extends CanvasController {
  constructor(radius, speed = 7, direction = Vector2.up) {
    super();
    this.speed = 7;
    this.direction = Vector2.up;
    this.steering = Math.random();
    this.maxSteering = 5;
    this.radius = radius;
    this.speed = speed;
    this.direction = direction;
  }
  tick(obj) {
    super.tick(obj);
    this.steering = Math.max(Math.min(this.steering + (Math.random() * 2 - 1) / 5, this.maxSteering), -this.maxSteering);
    this.direction = this.direction.rotate(this.steering / 200);
    this.parent.position = this.parent.position.add(this.direction.scale(this.speed).scale(obj.interval / 10));
    if (this.parent.position.x > this.level.width + this.radius) {
      this.parent.position.x = -this.radius;
    }
    if (this.parent.position.y > this.level.height + this.radius) {
      this.parent.position.y = -this.radius;
    }
    if (this.parent.position.x < -this.radius) {
      this.parent.position.x = this.level.width + this.radius;
    }
    if (this.parent.position.y < -this.radius) {
      this.parent.position.y = this.level.height + this.radius;
    }
  }
};

// ts/utils/collisions.ts
var Collisions = class _Collisions {
  static overlap(aP, aS, bP, bS) {
    return aP.x < bP.x + bS.x && aP.x + aS.x > bP.x && aP.y < bP.y + bS.y && aP.y + aS.y > bP.y;
  }
  static overlapDirection(aP, aS, bP, bS, v) {
    let result = [];
    if (_Collisions.overlap(aP, aS, new Vector2(bP.x, bP.y + v.y), bS)) {
      result.push(v.y > 0 ? ["y", aP.y - bP.y - bS.y] : ["y", aP.y + aS.y - bP.y]);
    }
    if (_Collisions.overlap(aP, aS, new Vector2(bP.x + v.x, bP.y), bS)) {
      result.push(v.x < 0 ? ["x", aP.x + aS.x - bP.x] : ["x", aP.x - bP.x - bS.x]);
    }
    return result;
  }
  static check(statics, dynamic, velocity) {
    const r = [];
    statics.forEach((s) => {
      r.push(..._Collisions.overlapDirection(s.position.add(s.parent instanceof Level ? Vector2.zero : s.parent.position), s.size, dynamic.position, dynamic.size, velocity));
    });
    return r;
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
};

// ts/modes/rpg/flatController.ts
var FlatContoller = class extends CanvasController {
  constructor() {
    super(...arguments);
    this.speed = 4;
    this.velocity = Vector2.zero;
  }
  tick(obj) {
    super.tick(obj);
    const angle = new Vector2(
      this.mode.input.right ? 1 : this.mode.input.left ? -1 : 0,
      this.mode.input.down ? -1 : this.mode.input.up ? 1 : 0
    );
    this.velocity.x = Util.to0(this.velocity.x * 0.9, 0.1);
    this.velocity.y = Util.to0(this.velocity.y * 0.9, 0.1);
    if (angle.x !== 0 || angle.y !== 0) {
      this.velocity = this.velocity.add(Vector2.right.scale(this.speed).rotate(angle.angle())).clampMagnitute(this.speed).toPrecision(2);
    }
    const r = Collisions.check(this.level.colliders, this.parent, this.velocity.scale(obj.interval / 10));
    if (r.length !== 0) {
      r.sort(function(a, b) {
        return Math.abs(a[1]) - Math.abs(b[1]);
      });
      if (r.find((a) => a[0] === "x")) {
        this.velocity.x = r.find((a) => a[0] === "x")[1] / (obj.interval / 10);
      }
      if (r.find((a) => a[0] === "y")) {
        this.velocity.y = r.find((a) => a[0] === "y")[1] / (obj.interval / 10);
      }
    }
    this.parent.position = Vector2.clamp(
      this.parent.position.add(this.velocity.scale(obj.interval / 10)),
      this.level.size.subtract(this.parent.size),
      Vector2.zero
    );
  }
};

// ts/modes/snakeMode/levels/discoLevel.ts
var DiscoLevel = class extends Level {
  constructor() {
    super({ hasDom: true });
    this.start = new Vector2(300, 400);
    this.background = new CanvasRadialGradientBackground({
      stops: [[0, "red"], [1, "blue"]]
    });
    this.size = new Vector2(1145, 2e3);
  }
  build() {
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      this.size = size;
    });
    this.addChild(this.background);
    this.dom.appendChild(new DomButton({
      text: "ADD",
      fontSize: 39,
      fontWeight: 1e3,
      color: "black",
      position: new Vector2(5, 120),
      size: new Vector2(70, 50),
      background: "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%)",
      fontFamily: "monospace",
      padding: [0, 10, 0, 10],
      onClick: () => {
        this.addSnake();
      }
    }));
    this.addChild(new Snake({
      totals: 30,
      distance: 1,
      topRadius: 50,
      bottomRadius: 1,
      colors: "rainbow",
      position: new Vector2(150, 200),
      controllers: [new FlatContoller()]
    }));
    this.addSnake();
  }
  addSnake() {
    const topSize = 15 + Math.random() * 170;
    const bottomSize = 2;
    this.addChild(new Snake({
      totals: Math.ceil(Math.random() * 40 + 10),
      distance: Math.ceil(topSize / 17),
      topRadius: topSize,
      bottomRadius: bottomSize,
      position: new Vector2(-topSize, -topSize),
      colors: Math.random() < 0.2 ? "green" : "rainbow",
      controllers: [new RandomController(topSize, 3 + (185 - topSize) / 17, Vector2.right)]
    }));
  }
};

// ts/modes/snakeMode/snakeMode.ts
var SnakeMode = class extends Mode {
  constructor() {
    super({ hasDom: true });
    this.dom.appendChild(new DomButton({
      text: "DISCO",
      fontSize: 39,
      fontWeight: 1e3,
      color: "black",
      position: new Vector2(5, 60),
      size: new Vector2(105, 50),
      background: "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%)",
      fontFamily: "monospace",
      padding: [0, 10, 0, 10],
      onClick: () => {
        this.mode.switchLevel("disco");
      }
    }));
    this.dom.appendChild(new DomButton({
      text: "BOUNCE",
      fontSize: 39,
      fontWeight: 1e3,
      color: "white",
      position: new Vector2(135, 60),
      size: new Vector2(130, 50),
      background: "#ff00ffaa",
      fontFamily: "monospace",
      padding: [0, 10, 0, 10],
      onClick: () => {
        this.mode.switchLevel("bounce");
      }
    }));
  }
  build() {
    super.build();
    this.addLevel("disco", new DiscoLevel());
    this.addLevel("bounce", new BouncerLevel());
    this.switchLevel("disco");
  }
};

// ts/utils/ticker.ts
var Ticker = class {
  constructor() {
    this.callbacks = [];
  }
  get startTime() {
    return this.sTime;
  }
  get elapsed() {
    return this.eTime;
  }
  fFrame(time) {
    this.sTime = time;
    this.pTime = time;
    window.requestAnimationFrame(this.frame.bind(this));
  }
  frame(timeStamp) {
    const interval = timeStamp - this.pTime;
    this.eTime = timeStamp - this.sTime;
    this.pTime = timeStamp;
    const o = {
      interval,
      total: this.eTime
    };
    this.callbacks.forEach((c) => {
      c(o);
    });
    window.requestAnimationFrame(this.frame.bind(this));
  }
  start() {
    window.requestAnimationFrame(this.fFrame.bind(this));
  }
  add(callback) {
    this.callbacks.push(callback);
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

// ts/utils/input.ts
var Input = class {
  constructor(game) {
    this.game = game;
    this.canvas = game.renderer;
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvas.addEventListener("keydown", this.keyDown.bind(this));
    this.canvas.addEventListener("keyup", this.keyUp.bind(this));
  }
  mouseMove(e) {
    this.send("mouseMove", e);
  }
  keyDown(e) {
    this.send("keyDown", e);
  }
  keyUp(e) {
    this.send("keyUp", e);
  }
  send(event, e) {
    Object.values(this.game.modes).forEach((mode) => this.recursive(event, mode, e));
  }
  recursive(event, element, e) {
    if (element.active) {
      if (element[event]) {
        if (event === "mouseMove") {
          element[event](e);
        } else {
          element[event](e);
        }
      }
      element.lowerChildren.forEach((child) => this.recursive(event, child, e));
      element.controllers.forEach((child) => this.recursive(event, child, e));
    }
  }
};

// ts/canvas/canvasAnimation.ts
var CanvasAnimation = class extends CanvasElement {
  constructor(attr) {
    super(__spreadProps(__spreadValues({}, attr), { autoReady: false }));
    this.type = "animation";
    this.relativity = "anchor";
    this.ready = false;
    this.frame = 0;
    this.prepped = attr.animation;
    this.prepped.callback = this.build.bind(this);
    this.interval = attr.interval || this.prepped.interval;
  }
  get max() {
    return this.prepped.max;
  }
  get frames() {
    return this.prepped.frames;
  }
  build() {
    this.prepped.frames.forEach((frame) => {
      this.addChild(frame);
    });
  }
  tick(obj) {
    super.tick(obj);
    this.frame = (this.frame + 1) % (this.max * this.interval);
    this.frames.forEach((frame, i) => {
      frame.active = Math.floor(this.frame / this.interval) === i;
    });
  }
};

// ts/canvas/canvasImage.ts
var CanvasImage = class extends CanvasElement {
  constructor(attr) {
    super(attr);
    this.type = "image";
    this.relativity = "relative";
    this.prepped = attr.image;
    this.condition = attr.condition;
    this.paralax = attr.paralax || 0;
    this.repeatX = attr.repeatX || 1;
    this.repeatY = attr.repeatY || 1;
    this.opacity = attr.opacity || 1;
  }
  render(ctx) {
    if (this.prepped.ready && (!this.condition || this.condition(this.position.add(this.parent.position), this.prepped.size))) {
      for (let i = 0; i < this.repeatX; i++) {
        for (let j = 0; j < this.repeatY; j++) {
          ctx.globalAlpha = this.opacity;
          ctx.drawImage(
            this.prepped.image,
            this.x + this.paralax * this.level.x + i * this.prepped.width,
            this.y + j * this.prepped.height,
            this.prepped.width,
            this.prepped.height
          );
        }
      }
    }
  }
};

// ts/canvas/canvasGrid.ts
var CanvasGrid = class _CanvasGrid extends CanvasElement {
  constructor(attr) {
    super(attr);
    this.type = "logic";
    this.relativity = "anchor";
    this.ready = false;
    this.factor = attr.factor || 10;
    this.json = attr.json;
    this.spritesData = attr.sprites;
    this.paralax = attr.paralax || 0;
    this.condition = attr.condition;
  }
  build() {
    _CanvasGrid.loadJsonFile(this.json).then(this.jsonLoaded.bind(this));
    this.game.waitCount++;
  }
  jsonLoaded(tiles) {
    tiles.forEach((tile) => {
      if (this.spritesData.sprites[tile.type].type === "image") {
        this.addChild(new CanvasImage({
          position: new Vector2(
            tile.x * this.factor,
            tile.y * this.factor
          ),
          image: this.spritesData.sprites[tile.type],
          condition: this.condition ? this.condition : null
        }));
      } else {
        this.addChild(new CanvasAnimation({
          position: new Vector2(
            tile.x * this.factor,
            tile.y * this.factor
          ),
          animation: this.spritesData.sprites[tile.type]
        }));
      }
    });
    this.game.waitCount--;
  }
  tick(obj) {
    super.tick(obj);
    this.x = this.paralax * this.level.x;
  }
  static async loadJsonFile(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
};

// ts/canvas/prepImage.ts
var PrepImage = class {
  constructor(attr, game) {
    this.type = "image";
    this.ready = false;
    this.game = game;
    this.cropSize = attr.cropSize;
    this.cropPosition = attr.cropPosition || Vector2.zero;
    this.factor = attr.factor || 1;
    if (attr.image) {
      this.original = attr.image;
      this.upScale();
    } else {
      this.original = new Image();
      this.original.src = attr.url;
      this.game.waitCount++;
      this.original.onload = () => {
        this.game.waitCount--;
        this.upScale();
      };
    }
  }
  get size() {
    return new Vector2(this.width, this.height);
  }
  get width() {
    return this.image.width;
  }
  get height() {
    return this.image.height;
  }
  upScale() {
    this.game.waitCount++;
    const originalSize = this.cropSize || new Vector2(this.original.width, this.original.height);
    const newSize = originalSize.scale(this.factor);
    const os = document.createElement("canvas");
    os.width = newSize.x;
    os.height = newSize.y;
    const osCTX = os.getContext("2d", { alpha: true, willReadFrequently: true });
    osCTX.drawImage(this.original, this.cropPosition.x, this.cropPosition.y, originalSize.x, originalSize.y, 0, 0, originalSize.x, originalSize.y);
    const ss = document.createElement("canvas");
    ss.width = newSize.x;
    ss.height = newSize.y;
    const ssCTX = ss.getContext("2d", { willReadFrequently: true });
    for (let x = 0; x < originalSize.x; x++) {
      for (let y = 0; y < originalSize.y; y++) {
        const r = osCTX.getImageData(x, y, 1, 1, { colorSpace: "srgb" });
        ssCTX.fillStyle = "rgba(".concat(r.data[0], ", ").concat(r.data[1], ", ").concat(r.data[2], ", ").concat(r.data[3] / 255, ")");
        ssCTX.fillRect(
          Math.round(x * this.factor),
          newSize.y - Math.round(y * this.factor),
          Math.round(this.factor),
          Math.round(this.factor) * -1
        );
      }
    }
    const newI = new Image();
    newI.src = ss.toDataURL();
    newI.onload = () => {
      this.game.waitCount--;
      this.loaded(newI);
    };
  }
  loaded(i) {
    this.image = i;
    this.ready = true;
  }
};

// ts/canvas/prepAnimation.ts
var PrepAnimation = class {
  constructor(attr, game) {
    this.type = "animation";
    this.frames = [];
    this.max = 0;
    this.ready = false;
    this.game = game;
    this.factor = attr.factor || 1;
    this.interval = attr.interval || 10;
    this.urls = attr.urls;
    this.add();
  }
  add() {
    this.urls.forEach((url) => {
      this.game.waitCount++;
      const frame = new CanvasImage({ image: new PrepImage({ url, factor: this.factor }, this.game) });
      this.frames.push(frame);
      this.game.waitCount--;
      this.max++;
    });
    if (this.callback) {
      this.callback();
    }
  }
};

// ts/canvas/canvasPrepSprites.ts
var CanvasPrepSprites = class _CanvasPrepSprites extends CanvasController {
  constructor(attr) {
    super();
    this.type = "logic";
    this.relativity = "relative";
    this.ready = false;
    this.spritesLoaded = 0;
    this.spritesMax = 0;
    this.sprites = {};
    this.factor = attr.factor || 10;
    this.spritesMax = attr.jsons.length;
    this.readyCallback = attr.callback;
    this.jsons = attr.jsons;
  }
  get gridDimentsion() {
    return new Vector2(this.gridWidth, this.gridHeight);
  }
  set gridDimentsion(value) {
    this.gridWidth = value.x;
    this.gridHeight = value.y;
  }
  build() {
    this.game.waitCount++;
    this.jsons.forEach((json) => {
      this.game.waitCount++;
      _CanvasPrepSprites.loadJsonFile(json).then(this.jsonLoaded.bind(this));
    });
  }
  checkReady() {
    if (this.spritesLoaded === this.spritesMax) {
      this.ready = true;
      this.game.waitCount--;
      this.readyCallback();
    }
  }
  jsonLoaded(sprites) {
    sprites.forEach((sprite) => {
      if (!this.sprites[sprite.name]) {
        if (sprite.type === "image") {
          this.sprites[sprite.name] = new PrepImage(Object.assign(sprite.image, { factor: this.factor }), this.game);
        } else {
          this.sprites[sprite.name] = new PrepAnimation(Object.assign(sprite.animation, { factor: this.factor }), this.game);
        }
      }
    });
    this.game.waitCount--;
    this.spritesLoaded++;
    this.checkReady();
  }
  static async loadJsonFile(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
};

// ts/utils/collider.ts
var Collider = class extends CanvasElement {
  constructor(attr = {}) {
    super(attr);
    this.type = "collider";
    this.relativity = "anchor";
    this.colliderType = "static";
    this.cornerTolerance = attr.cornerTolerance || 0;
    this.colliderType = attr.colliderType || "static";
    this.callback = attr.callback;
  }
  build() {
  }
};

// ts/utils/character.ts
var Character = class extends Collider {
  constructor(attr) {
    super(attr);
    this.relativity = "anchor";
    this.colliderType = "dynamic";
    this.position = attr.position;
    this.size = attr.size;
    this.collider = new Collider({
      size: this.size,
      cornerTolerance: 30
    });
    this.colliderType = "dynamic";
  }
};

// ts/modes/rpg/rpgCharacter.ts
var RPGCharacter = class extends Character {
  constructor({
    scale = 6,
    position = Vector2.zero,
    controllers = []
  } = {}) {
    super({
      position,
      controllers,
      size: new Vector2(10 * scale, 7 * scale)
    });
    this.scale = 6;
    this.relativity = "anchor";
    this.animations = {};
    this.direction = "00";
    this.phase = "idle";
  }
  build() {
    super.build();
    CanvasPrepSprites.loadJsonFile("/json/character/sprites.json").then((sprite) => {
      sprite.forEach((sprite2) => {
        this.animations[sprite2.name] = new CanvasAnimation({
          position: new Vector2(-165, -80),
          animation: new PrepAnimation({
            urls: sprite2.animation.urls,
            interval: 30,
            factor: this.scale
          }, this.game)
        });
        this.addChild(this.animations[sprite2.name]);
      });
    });
  }
  tick(o) {
    super.tick(o);
    this.phase = this.movedAmount.magnitude() > 0.1 ? "walk" : "idle";
    if (this.phase === "walk") {
      const degrees = (3 - Math.round((this.movedAmount.angleDegrees() + 1) / 90 + 4) % 4) * 9;
      this.direction = degrees.toString().padStart(2, "0");
    }
    Object.entries(this.animations).forEach(([key, animation]) => {
      if (key.startsWith("walk")) {
        animation.interval = Util.clamp(Math.floor(30 - this.movedAmount.magnitude() * 0.8), 5, 50);
      }
      animation.active = key === "".concat(this.phase).concat(this.direction);
    });
  }
};

// ts/modes/snakeMode/controllers/cameraController.ts
var CameraController = class extends CanvasController {
  constructor({ target }) {
    super();
    this.target = target;
  }
  tick(obj) {
    super.tick(obj);
    const mid = this.target.position.add(this.target.size.subtract(this.mode.size).scale(0.5)).scale(-1);
    const rel = this.mode.size.subtract(this.level.size);
    this.parent.position = new Vector2(
      rel.x < 0 ? Util.clamp(mid.x, rel.x, 0) : rel.x / 2,
      rel.y < 0 ? Util.clamp(mid.y, rel.y, 0) : rel.y / 2
    );
  }
};

// ts/modes/rpg/levels/overworldLevel.ts
var OverworldLevel = class extends Level {
  constructor() {
    super({
      hasDom: true,
      size: new Vector2(320 * 6, 320 * 6)
    });
    this.zoom = 6;
    this.start = new Vector2(7 * this.zoom * 16, 7 * this.zoom * 16);
    this.background = new CanvasColorBackground("#272727");
    this.character = new RPGCharacter({
      position: this.start,
      controllers: [new FlatContoller()]
    });
    this.addControllers([new CameraController({ target: this.character })]);
    this.sprites = new CanvasPrepSprites({
      jsons: ["/json/overworld/sprites.json"],
      factor: this.zoom,
      callback: () => {
        this.assetsLoaded();
      }
    });
    this.addControllers([this.sprites]);
  }
  assetsLoaded() {
    this.addChild(this.background);
    this.addChild(new CanvasImage({
      image: new PrepImage({ url: "/img/overworld/terrain.png", factor: this.zoom }, this.game)
    }));
    this.addChild(new CanvasGrid({
      sprites: this.sprites,
      json: "/json/overworld/decorations.json",
      factor: this.zoom
    }));
    this.addChild(new CanvasGrid({
      sprites: this.sprites,
      json: "/json/overworld/objects.json",
      factor: this.zoom,
      condition: (entity) => entity.y >= this.character.y
    }));
    this.addChild(this.character);
    this.addChild(new CanvasGrid({
      sprites: this.sprites,
      json: "/json/overworld/objects.json",
      factor: this.zoom,
      condition: (entity) => entity.y < this.character.y
    }));
    this.addChild(new CanvasGrid({
      sprites: this.sprites,
      json: "/json/overworld/overlay.json",
      factor: this.zoom
    }));
    [
      [20, 122, 25, 28],
      //doghouse
      [147, 163, 173, 50],
      //riverRight
      [0, 163, 125, 50],
      //riverLeft
      [64, 120, 31, 30],
      //statue
      [23, 260, 25, 62],
      //house1
      [48, 282, 17, 39],
      //house2
      [65, 260, 24, 62],
      //house3
      [-15, 0, 30, 112, 100],
      //hedgeLeft
      [305, 0, 30, 112, 100],
      //hedgeRight
      [0, 0, 320, 14, 100],
      //hedgeBottom
      [97, 272, 13, 24],
      [176, 112, 15, 19],
      [194, 103, 49, 10],
      [255, 103, 15, 60],
      [272, 113, 41, 39],
      [67, 20, 58, 16],
      [32, 37, 15, 16]
    ].forEach(([x, y, w, h, t = 30]) => {
      this.addChild(new Collider({
        position: new Vector2(this.zoom * x, this.zoom * y),
        size: new Vector2(this.zoom * w, this.zoom * h),
        cornerTolerance: t
      }));
    });
  }
  // tick(obj: TickerReturnData): void {
  //     super.tick(obj);
  //     if (this.mo){
  //         this.mo.text = `[${Math.round(this.mo.x/this.zoom)},${Math.round(this.mo.y/this.zoom)},${Math.round(this.mo.width/this.zoom)},${Math.round(this.mo.height/this.zoom)}]`;
  //     }
  // }
};

// ts/modes/rpg/rpgMode.ts
var RPGMode = class extends Mode {
  constructor() {
    super({ hasDom: true });
  }
  build() {
    super.build();
    this.addChild(new CanvasColorBackground("#272727"));
    this.addLevel("overworld", new OverworldLevel());
    this.switchLevel("overworld");
  }
};

// ts/dom/domCanvas.ts
var DomCanvas = class extends DomElement {
  constructor() {
    super("canvas");
    this.dom = document.createElement("canvas");
    this.dom.style.position = "absolute";
    this.dom.style.imageRendering = "pixelated";
    this.dom.style.pointerEvents = "all";
    this.dom.style.bottom = "0px";
    this.ctx = this.dom.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
  }
  build() {
    this.dom.tabIndex = 1;
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      this.size = size;
    });
    this.game.resize();
  }
  addMode(child) {
    var _a, _b, _c, _d;
    (_a = child.parent) != null ? _a : child.parent = this.game;
    (_b = child.game) != null ? _b : child.game = this.game;
    (_c = child.mode) != null ? _c : child.mode = this.mode;
    (_d = child.level) != null ? _d : child.level = this.level;
    this.game.dom.appendChild(child.dom);
    child.registerControllers(child);
    child.build();
  }
  tick(obj) {
    super.tick(obj);
    this.ctx.save();
    this.ctx.scale(1, -1);
    this.ctx.translate(0, -this.height);
    Object.values(this.game.modes).filter((child) => child.active).forEach((mode) => mode.tick(obj));
    Object.values(this.game.modes).filter((child) => child.visible && child.active).forEach((mode) => {
      mode.preRender(this.ctx);
      mode.postRender(this.ctx);
    });
    this.ctx.restore();
  }
};

// ts/modes/side/character/SideCharacter.ts
var SideCharacter = class extends Character {
  constructor({
    scale = 5,
    position = Vector2.zero,
    controllers = []
  } = {}) {
    super({
      position,
      controllers,
      size: new Vector2(10 * scale, 20 * scale)
    });
    this.scale = 5;
    this.relativity = "anchor";
    this.animations = {};
    this.direction = "00";
    this.phase = "idle";
  }
  build() {
    super.build();
    this.addChild(new CanvasSquare({
      color: "red",
      size: this.size
    }));
  }
  // public tick(o: TickerReturnData) {
  //     super.tick(o);
  //     this.phase = this.movedAmount.magnitude() > .1 ? 'walk' : 'idle';
  //     if (this.phase === 'walk') {
  //         const degrees = (3 - Math.round((this.movedAmount.angleDegrees() + 1) / 90 + 4) % 4) * 9;
  //         this.direction = degrees.toString().padStart(2, '0') as '00' | '09' | '18' | '27';
  //     }
  //     Object.entries(this.animations).forEach(([key, animation]) => {
  //         if (key.startsWith('walk')){
  //             animation.interval = Util.clamp(Math.floor(30 - this.movedAmount.magnitude()*0.8), 5, 50);
  //         }
  //         animation.active = key === `${this.phase}${this.direction}`;
  //     });
  // }
};

// ts/modes/side/character/SideController.ts
var SideContoller = class extends CanvasController {
  constructor() {
    super(...arguments);
    this.speed = 4;
    this.jumpHeight = 11;
    this.velocity = Vector2.zero;
    this.jumping = false;
  }
  keyDown(e) {
    if (!this.jumping && this.mode.input.up) {
      this.velocity.y = this.jumpHeight;
      this.jumping = true;
    }
  }
  tick(obj) {
    super.tick(obj);
    this.velocity.x = Util.to0(this.velocity.x * 0.9, 0.1);
    this.velocity.y = Util.to0(this.velocity.y - 9.8 * 0.02, 1e-3);
    this.velocity.x += this.mode.input.right ? 1 : this.mode.input.left ? -1 : 0 * this.speed;
    const r = Collisions.check(this.level.colliders, this.parent, this.velocity.scale(obj.interval / 10));
    if (r.length !== 0) {
      r.sort(function(a, b) {
        return Math.abs(a[1]) - Math.abs(b[1]);
      });
      if (r.find((a) => a[0] === "x")) {
        this.velocity.x = r.find((a) => a[0] === "x")[1] / (obj.interval / 10);
      }
      if (r.find((a) => a[0] === "y")) {
        if (this.velocity.y < 0) {
          this.jumping = false;
        }
        this.velocity.y = r.find((a) => a[0] === "y")[1] / (obj.interval / 10);
      }
    }
    this.parent.position = Vector2.clamp(
      this.parent.position.add(this.velocity.scale(obj.interval / 10)),
      this.level.size.subtract(this.parent.size),
      Vector2.zero
    );
  }
};

// ts/modes/side/levels/scrolling.ts
var Scroller = class extends CanvasWrapper {
  constructor() {
    super(...arguments);
    this.speed = 6;
    this.layers = [];
  }
  add(layer, width, paralax) {
    this.layers.push([layer, width, paralax]);
    this.addChild(layer);
  }
  build() {
    this.size = this.parent.size;
    this.addChild(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/sky.png",
        factor: 5
      }, this.game),
      paralax: -1,
      position: new Vector2(800, 100)
    }));
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/far-clouds.png",
        factor: 3
      }, this.game),
      position: new Vector2(0, 400),
      paralax: -0.98,
      repeatX: 16,
      opacity: 0.4
    }), 128 * 3, 0.05);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/near-clouds.png",
        factor: 3
      }, this.game),
      position: new Vector2(0, 400),
      paralax: -0.96,
      repeatX: 16,
      opacity: 0.3
    }), 144 * 3, 0.1);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/far-mountains.png",
        factor: 3
      }, this.game),
      position: new Vector2(0, 350),
      paralax: -0.94,
      repeatX: 16
    }), 160 * 3, 0.15);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/mountains.png",
        factor: 4
      }, this.game),
      position: new Vector2(0, 250),
      paralax: -0.92,
      repeatX: 16
    }), 320 * 4, 0.17);
    this.addChild(new CanvasSquare({
      color: "#2C2546",
      size: new Vector2(this.width, 500)
    }));
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/trees.png",
        factor: 2
      }, this.game),
      position: new Vector2(0, 500),
      paralax: -0.7,
      repeatX: 16
    }), 240 * 2, 0.6);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/trees.png",
        factor: 3
      }, this.game),
      position: new Vector2(0, 350),
      paralax: -0.65,
      repeatX: 16
    }), 240 * 3, 0.8);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/trees.png",
        factor: 5
      }, this.game),
      position: new Vector2(0, -50),
      paralax: -0.6,
      repeatX: 16
    }), 240 * 5, 0.9);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/train/railtrack_v1.png",
        factor: 6
      }, this.game),
      repeatX: Math.ceil(this.level.width / 64 * 6 + 1)
    }), 64 * 6, 1);
  }
  tick(obj) {
    super.tick(obj);
    this.layers.forEach(([layer, width, paralax]) => {
      layer.x = (layer.x - this.speed * paralax) % width;
    });
  }
};

// ts/canvas/spritesheet.ts
var PrepSpritesheet = class {
  constructor(attr, game) {
    this.type = "animation";
    this.ready = false;
    this.frames = [];
    this.max = 0;
    this.game = game;
    this.factor = attr.factor || 1;
    this.interval = attr.interval || 10;
    this.url = attr.url;
    this.size = attr.size;
    this.repeatX = attr.repeatX || 1;
    this.repeatY = attr.repeatY || 1;
    this.sectionX = attr.sectionX || 0;
    this.sectionY = attr.sectionY || 0;
    this.game.waitCount++;
    const i = new Image();
    i.src = this.url;
    i.onload = () => {
      this.game.waitCount--;
      this.add(i);
      if (this.callback) {
        this.callback();
      }
    };
  }
  add(image) {
    for (let j = 0; j < this.repeatY; j++) {
      for (let i = 0; i < this.repeatX; i++) {
        const frame = new CanvasImage({
          image: new PrepImage({
            image,
            url: this.url,
            factor: this.factor,
            cropPosition: new Vector2(this.sectionX + this.size.x * i, this.sectionY + this.size.y * j),
            cropSize: this.size
          }, this.game)
        });
        this.frames.push(frame);
        this.max++;
      }
    }
  }
};

// ts/modes/side/levels/trainCar.ts
var TrainCar = class extends CanvasWrapper {
  constructor(x, y = 100, w = 800, h = 400) {
    super({
      position: new Vector2(x, y),
      size: new Vector2(w, h)
    });
  }
  build() {
    this.background = new CanvasAnimation({
      position: Vector2.zero,
      animation: new PrepSpritesheet({
        url: "/img/train/sheet_carriage_v18.png",
        factor: 5,
        size: new Vector2(256, 64),
        repeatX: 16,
        interval: 20
      }, this.game)
    });
    this.addChild(this.background);
    this.foreground = new CanvasImage({
      image: new PrepImage({
        url: "/img/train/carriage_v18_car1.png",
        factor: 5
      }, this.game)
    });
    [
      [0, 8, 256, 7],
      //hedgeBottom
      [16, 48, 4, 8],
      //hedgeBottom
      [236, 48, 4, 8],
      //hedgeBottom
      [4, 56, 248, 8]
      //hedgeBottom
    ].forEach(([x, y, w, h, t = 30]) => {
      this.addChild(new Collider({
        position: new Vector2(x * 5, y * 5),
        size: new Vector2(w * 5, h * 5),
        cornerTolerance: t
      }));
    });
    this.addChild(this.foreground);
  }
};

// ts/modes/side/levels/platform.ts
var PlatformLevel = class extends Level {
  constructor() {
    super({
      hasDom: true,
      size: new Vector2(256 * 5 * 4, 1200)
    });
    this.start = new Vector2(2e3, 150);
    this.background = new CanvasColorBackground("#46345E");
    this.trainCars = [];
    this.trainCars.push(new TrainCar(256 * 5 * 1, 35, 256 * 5, 64 * 5));
    this.trainCars.push(new TrainCar(256 * 5 * 2, 35, 256 * 5, 64 * 5));
    this.character = new SideCharacter({
      position: this.start,
      controllers: [new SideContoller()]
    });
    this.addControllers([new CameraController({ target: this.character })]);
  }
  build() {
    this.addChild(this.background);
    this.addChild(new Scroller());
    this.trainCars.forEach((trainCar) => {
      this.addChild(trainCar);
      trainCar.foreground.condition = (bP, bS) => !Collisions.overlap(bP, bS, this.character.position, this.character.size);
    });
    this.addChild(this.character);
    [
      [0, 0, this.width, 35]
    ].forEach(([x, y, w, h, t = 30]) => {
      this.addChild(new Collider({
        position: new Vector2(x, y),
        size: new Vector2(w, h)
      }));
    });
  }
  // public tick(obj: TickerReturnData): void {
  //     super.tick(obj);
  //     this.ground.x = (this.ground.x - this.trainSpeed) % this.ground.prepped.width;
  //     if (Collisions.overlap(Vector2.zero, new Vector2(this.width, 90), this.character.position, this.character.size)){
  //         this.character.x -= this.trainSpeed;
  //     }
  // }
};

// ts/modes/side/SideMode.ts
var SideMode = class extends Mode {
  constructor() {
    super({ hasDom: true });
  }
  build() {
    super.build();
    this.addChild(new CanvasColorBackground("#272727"));
    this.addLevel("platform", new PlatformLevel());
    this.switchLevel("platform");
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

// ts/game.ts
var Game = class extends CanvasWrapper {
  constructor() {
    super({ hasDom: true });
    this.relativity = "anchor";
    this.modes = {};
    this.game = this;
    this.ready = false;
    this._waitCount = 0;
    this.readyToStart = false;
    this.started = false;
    this.total = 0;
    this.game = this;
    this.addEvent(new Event("resize"));
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.build();
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
    this.loader = new Loader();
    this.addChild(this.loader);
    this.renderer = new DomCanvas();
    this.addChild(this.renderer);
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
    this.resize();
  }
  tick(obj) {
    this.renderer.tick(obj);
  }
  setupModes() {
    this.addMode("snakes", new SnakeMode());
    this.addMode("rpg", new RPGMode());
    this.addMode("side", new SideMode());
    this.switchMode("side");
  }
  resize() {
    this.game.getEvent("resize").alert(new Vector2(document.body.clientWidth, document.body.clientHeight));
  }
  debug() {
    this.fps = new FPS();
    this.dom.appendChild(this.fps);
    this.ticker.add(this.fps.tick.bind(this.fps));
  }
  addMode(s, mode) {
    this.modes[s] = mode;
    mode.parent = this;
    mode.mode = mode;
    this.renderer.addMode(mode);
  }
  switchMode(s) {
    document.title = s;
    Object.entries(this.modes).forEach(([key, mode]) => {
      mode.active = key === s;
      mode.visible = key === s;
      mode.dom ? mode.dom.visible = key === s : null;
    });
  }
  start() {
    this.started = true;
    this.loader.visible = false;
    this.fps.visible = true;
    this.ticker.start();
    this.addChild(new DomButton({
      text: "RPG",
      fontSize: 39,
      fontWeight: 1e3,
      color: "white",
      position: new Vector2(130, 5),
      size: new Vector2(65, 50),
      background: "#ff00ffaa",
      fontFamily: "monospace",
      padding: [0, 10, 0, 10],
      onClick: () => {
        this.switchMode("rpg");
      }
    }));
    this.addChild(new DomButton({
      text: "SNAKES",
      fontSize: 39,
      fontWeight: 1e3,
      color: "white",
      position: new Vector2(220, 5),
      size: new Vector2(130, 50),
      background: "#ff00ffaa",
      fontFamily: "monospace",
      padding: [0, 10, 0, 10],
      onClick: () => {
        this.switchMode("snakes");
      }
    }));
    this.addChild(new DomButton({
      text: "TRAIN",
      fontSize: 39,
      fontWeight: 1e3,
      color: "white",
      position: new Vector2(375, 5),
      size: new Vector2(130, 50),
      background: "#ff00ffaa",
      fontFamily: "monospace",
      padding: [0, 10, 0, 10],
      onClick: () => {
        this.switchMode("side");
      }
    }));
  }
};

// ts/index.ts
document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new Game().dom.dom);
  ;
});
//# sourceMappingURL=index.js.map
