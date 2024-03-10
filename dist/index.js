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
var ElementZoom = class extends ElementPosition {
  constructor(attr = {}) {
    super(attr);
    this._zoomX = 1;
    this._zoomY = 1;
    if (attr.zoom) {
      this._zoomX = attr.zoom.x;
      this._zoomY = attr.zoom.y;
    }
  }
  get zoomX() {
    return this._zoomX;
  }
  set zoomX(n) {
    this._zoomX = n;
  }
  get zoomY() {
    return this._zoomY;
  }
  set zoomY(n) {
    this._zoomY = n;
  }
  get zoom() {
    return new Vector2(this.zoomX, this.zoomY);
  }
  set zoom(value) {
    this.zoomX = value.x;
    this.zoomY = value.y;
  }
};

// ts/utils/elementSize.ts
var ElementSize = class extends ElementZoom {
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
    if (this.game.waitCount) {
      this.game.waitCount++;
    }
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
      if (this.game.waitCount) {
        this.game.waitCount--;
      }
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
    c.save();
    if (this.relativity === "anchor") {
      c.translate(this.x, this.y);
      c.scale(this.zoom.x, this.zoom.y);
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
    c.restore();
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
    this.game.ctx = this.ctx;
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

// ts/canvas/canvasAnimation.ts
var CanvasAnimation = class extends CanvasElement {
  constructor(attr) {
    super(__spreadProps(__spreadValues({}, attr), { autoReady: false }));
    this.type = "animation";
    this.relativity = "anchor";
    this.ready = false;
    this.frame = 0;
    this.loop = true;
    this.prepped = attr.animation;
    this.prepped.callback = this.build.bind(this);
    this.interval = attr.interval || this.prepped.interval;
    this.shadow = attr.shadow;
    this.reverse = attr.reverse || false;
    this.loop = attr.loop !== void 0 ? attr.loop : true;
  }
  get max() {
    return this.prepped.max;
  }
  get frames() {
    return this.prepped.frames;
  }
  get width() {
    return this.prepped.size.x;
  }
  get height() {
    return this.prepped.size.y;
  }
  build() {
    this.prepped.frames.forEach((frame) => {
      this.addChild(frame, true);
      frame.shadow = this.shadow;
    });
  }
  tick(obj) {
    super.tick(obj);
    if (this.loop) {
      this.frame = (this.frame + 1) % (this.max * this.interval);
    } else {
      if (this.frame < this.max * this.interval - 1) {
        this.frame++;
      }
    }
    this.frames.forEach((frame, i) => {
      if (this.reverse) {
        frame.active = Math.floor(this.frame / this.interval) === this.max - i - 1;
      } else {
        frame.active = Math.floor(this.frame / this.interval) === i;
      }
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
    this.worldSpaceParalaxX = attr.worldSpaceParalaxX || 0;
    this.worldSpaceParalaxY = attr.worldSpaceParalaxY || 0;
    this.screenSpaceParalaxX = attr.screenSpaceParalaxX || 0;
    this.screenSpaceParalaxY = attr.screenSpaceParalaxY || 0;
    this.repeatX = attr.repeatX || 1;
    this.repeatY = attr.repeatY || 1;
    this.opacity = attr.opacity || 1;
    this.shadow = attr.shadow;
  }
  get width() {
    return this.prepped.width;
  }
  get height() {
    return this.prepped.height;
  }
  render(ctx) {
    if (this.prepped.ready && (!this.condition || this.condition(this.position.add(this.parent.position), this.prepped.size))) {
      for (let i = 0; i < this.repeatX; i++) {
        for (let j = 0; j < this.repeatY; j++) {
          if (this.opacity !== 1) {
            ctx.globalAlpha = this.opacity;
          }
          if (this.shadow) {
            ctx.shadowColor = this.shadow[0];
            ctx.shadowOffsetX = this.shadow[1];
            ctx.shadowOffsetY = this.shadow[2];
            ctx.shadowBlur = this.shadow[3];
          }
          ctx.drawImage(
            this.prepped.image,
            this.x + this.worldSpaceParalaxX * this.level.x + (this.width / 2 + this.x - (this.mode.width / 2 - this.level.x)) * this.screenSpaceParalaxX + i * this.prepped.width,
            this.y + j * this.prepped.height,
            this.prepped.width,
            this.prepped.height
          );
        }
      }
    }
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

// ts/utils/utils.ts
var Util = class {
  static clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
  }
  static to0(value, tolerance = 0.1) {
    return Math.abs(value) < tolerance ? 0 : value;
  }
};

// ts/utils/controller.ts
var CanvasController = class extends CanvasElement {
  constructor() {
    super(...arguments);
    this.type = "logic";
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
    const mid = this.target.position.add(this.target.size.subtract(this.target.mode.size).scale(0.5)).scale(-1);
    const rel = this.target.mode.size.subtract(this.target.level.size);
    this.target.level.position = new Vector2(
      rel.x < 0 ? Util.clamp(mid.x, rel.x, 0) : rel.x / 2,
      rel.y < 0 ? Util.clamp(mid.y, rel.y, 0) : rel.y / 2
    );
  }
};

// ts/modes/side/character/SideCharacter.ts
var SideCharacter = class extends Character {
  constructor({
    position = Vector2.zero,
    controllers = []
  } = {}) {
    super({
      position,
      controllers,
      size: new Vector2(15 * 5, 40 * 5)
    });
    this.scale = 5;
    this.relativity = "anchor";
    this.animations = {};
    this.direction = 1;
    this.phase = "idle";
    this.specifics = [
      ["idle", "/img/spritesheets/hat-man-idle.png", 4, 40],
      ["walk", "/img/spritesheets/hat-man-walk.png", 6, 60]
    ];
  }
  build() {
    this.level.addControllers([new CameraController({ target: this })]);
    this.specifics.forEach(([key, url, count, interval]) => {
      this.animations[key] = new CanvasAnimation({
        animation: new PrepSpritesheet({
          url,
          factor: this.scale,
          size: new Vector2(39, 52),
          repeatX: count,
          interval
        }, this.game)
      });
      this.addChild(this.animations[key], true);
    });
  }
  tick(o) {
    super.tick(o);
    this.phase = this.movedAmount.magnitude() > 0.1 ? "walk" : "idle";
    Object.entries(this.animations).forEach(([key, a]) => {
      if (this.movedAmount.x !== 0) {
        a.zoom = new Vector2(this.movedAmount.x < 0 ? 1 : -1, 1);
        a.x = 20 * this.scale * (this.movedAmount.x < 0 ? -1 : 1) + 7.5 * this.scale;
      }
      if (key.startsWith("walk")) {
        a.interval = Util.clamp(Math.floor(30 - this.movedAmount.magnitude() * 0.8), 5, 50);
      }
      a.active = key === "".concat(this.phase);
    });
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

// ts/modes/side/character/SideController.ts
var SideContoller = class extends CanvasController {
  constructor() {
    super(...arguments);
    this.speed = 4;
    this.jumpHeight = 14;
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
        if (this.velocity.y <= 0) {
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

// ts/modes/side/levels/locomotive.ts
var Locomotive = class extends CanvasWrapper {
  constructor(draw, x, y = 100, w = 800, h = 400) {
    super({
      position: new Vector2(x, y),
      size: new Vector2(w, h)
    });
    this.draw = draw;
    this.relativity = "anchor";
  }
  build() {
    this.background = new CanvasAnimation({
      animation: new PrepSpritesheet({
        url: "/img/train/sheet_train_v18.png",
        factor: 6,
        size: new Vector2(256, 64),
        repeatX: 16,
        interval: 20
      }, this.game),
      position: new Vector2(0, 0)
    });
    const r = this.background.postRender.bind(this.background);
    this.background.postRender = (c) => {
      c.save();
      r(c);
      this.draw.perspectiveSwitchFunction(1, this);
      r(c);
      c.restore();
    };
    this.addChild(this.background);
    [
      [0, 5, 256, 6]
      //hedgeBottom
    ].forEach(([x, y, w, h, t = 30]) => {
      this.addChild(new Collider({
        position: new Vector2(x * 6, y * 6),
        size: new Vector2(w * 6, h * 6),
        cornerTolerance: t
      }));
    });
  }
};

// ts/modes/side/levels/perspectiveDrawer.ts
var CanvasDrawer = class {
  constructor(ctx, perspectiveSwitchFunction) {
    this.lastZ = 1;
    this.factor = 0.05;
    this.scale = 6;
    this.ctx = ctx;
    this.perspectiveSwitchFunction = perspectiveSwitchFunction;
  }
  lineSequence(target, fill, points) {
    for (let i = 0; i < points.length - 1; i++) {
      this.line(target, fill, points[i][0], points[i][1], points[i][2] || 0, points[i + 1][0], points[i + 1][1], points[i + 1][2] || 0);
    }
  }
  line(target, fill, x, y, offset, x2, y2, offset2, style = offset !== offset2 ? "z" : x === x2 ? "x" : "y", w = 1) {
    this.ctx.fillStyle = fill;
    this.ctx.save();
    if (style === "x") {
      this.switchPerspective(target, offset);
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.scale, y * this.scale);
      this.ctx.lineTo((x + w) * this.scale, y * this.scale);
      this.switchPerspective(target, offset2);
      this.ctx.lineTo((x2 + w) * this.scale, y2 * this.scale);
      this.ctx.lineTo(x2 * this.scale, y2 * this.scale);
      this.ctx.fill();
      this.ctx.closePath();
    }
    if (style === "y") {
      this.switchPerspective(target, offset);
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.scale, y * this.scale);
      this.ctx.lineTo(x * this.scale, (y + w) * this.scale);
      this.switchPerspective(target, offset2);
      this.ctx.lineTo(x2 * this.scale, (y2 + w) * this.scale);
      this.ctx.lineTo(x2 * this.scale, y2 * this.scale);
      this.ctx.fill();
      this.ctx.closePath();
    }
    if (style === "z") {
      this.switchPerspective(target, offset);
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.scale, y * this.scale);
      this.ctx.lineTo((x + w) * this.scale, y * this.scale);
      this.switchPerspective(target, offset2);
      this.ctx.lineTo((x2 + w) * this.scale, y2 * this.scale);
      this.ctx.lineTo(x2 * this.scale, y2 * this.scale);
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.beginPath();
      this.ctx.moveTo(x2 * this.scale, y2 * this.scale);
      this.ctx.lineTo(x2 * this.scale, (y2 + w) * this.scale);
      this.switchPerspective(target, offset);
      this.ctx.lineTo(x * this.scale, (y + w) * this.scale);
      this.ctx.lineTo(x * this.scale, y * this.scale);
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.scale, (y + w) * this.scale);
      this.ctx.lineTo((x + w) * this.scale, (y + w) * this.scale);
      this.switchPerspective(target, offset2);
      this.ctx.lineTo((x2 + w) * this.scale, (y2 + w) * this.scale);
      this.ctx.lineTo(x2 * this.scale, (y2 + w) * this.scale);
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.beginPath();
      this.ctx.moveTo((x2 + w) * this.scale, y2 * this.scale);
      this.ctx.lineTo((x2 + w) * this.scale, (y2 + w) * this.scale);
      this.switchPerspective(target, offset);
      this.ctx.lineTo((x + w) * this.scale, (y + w) * this.scale);
      this.ctx.lineTo((x + w) * this.scale, y * this.scale);
      this.ctx.fill();
      this.ctx.closePath();
    }
    this.ctx.restore();
    this.lastZ = void 0;
  }
  switchPerspective(target, z) {
    if (this.lastZ !== z) {
      this.lastZ = z;
      this.ctx.restore();
      this.ctx.save();
      this.perspectiveSwitchFunction(z, target);
    }
  }
  fill(target, points, fill, stroke) {
    this.ctx.beginPath();
    this.ctx.save();
    points.forEach((p, i) => {
      this.switchPerspective(target, p[2] || 0);
      this.ctx[i === 0 ? "moveTo" : "lineTo"](p[0] * this.scale, p[1] * this.scale);
    });
    this.ctx.fillStyle = fill;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
    if (stroke) {
      this.lineSequence(target, stroke, points);
    }
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
      worldSpaceParalaxX: -1,
      position: new Vector2(800, 100)
    }));
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/far-clouds.png",
        factor: 3
      }, this.game),
      position: new Vector2(0, 400),
      worldSpaceParalaxX: -0.98,
      repeatX: 16,
      opacity: 0.4
    }), 128 * 3, 0.05);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/near-clouds.png",
        factor: 3
      }, this.game),
      position: new Vector2(0, 400),
      worldSpaceParalaxX: -0.96,
      repeatX: 16,
      opacity: 0.3
    }), 144 * 3, 0.1);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/far-mountains.png",
        factor: 3
      }, this.game),
      position: new Vector2(0, 350),
      worldSpaceParalaxX: -0.94,
      repeatX: 16
    }), 160 * 3, 0.15);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/mountains.png",
        factor: 4
      }, this.game),
      position: new Vector2(0, 250),
      worldSpaceParalaxX: -0.92,
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
      worldSpaceParalaxX: -0.5,
      repeatX: 16
    }), 240 * 2, 0.6);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/trees.png",
        factor: 3
      }, this.game),
      position: new Vector2(0, 320),
      worldSpaceParalaxX: -0.38,
      repeatX: 16
    }), 240 * 3, 0.8);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/dusk/trees.png",
        factor: 7
      }, this.game),
      position: new Vector2(0, -100),
      worldSpaceParalaxX: -0.26,
      repeatX: 16
    }), 240 * 7, 0.95);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/train/railtrack_v1.png",
        factor: 7
      }, this.game),
      position: new Vector2(0, 40),
      repeatX: Math.ceil(this.level.width / 64 * 7 + 1)
    }), 64 * 7, 1);
    this.add(new CanvasImage({
      image: new PrepImage({
        url: "/img/train/railtrack_v1.png",
        factor: 7
      }, this.game),
      position: new Vector2(0, 0),
      repeatX: Math.ceil(this.level.width / 64 * 7 + 1)
    }), 64 * 7, 1);
  }
  tick(obj) {
    super.tick(obj);
    this.layers.forEach(([layer, width, paralax]) => {
      layer.x = (layer.x - this.speed * paralax) % width;
    });
  }
};

// ts/canvas/canvasCustom.ts
var CanvasCustom = class extends CanvasElement {
  constructor(attr = {}) {
    super(attr);
    this.type = "color";
    this.render = attr.render.bind(this);
  }
};

// ts/modes/side/npcs/walkingNPC.ts
var WalkingNPC = class extends Character {
  constructor({
    scale = 5,
    position = Vector2.zero,
    controllers = [],
    size,
    idle,
    idleCount,
    idleInterval,
    walk,
    walkCount,
    walkInterval,
    width,
    waitTime = 0
  }) {
    super({
      position,
      controllers,
      size: new Vector2(size.x, size.y)
    });
    this.relativity = "anchor";
    this.animations = {};
    this.phase = "idle";
    this.length = 1e3;
    this.direction = 1;
    this.place = 0;
    this.waitTime = 0;
    this.speed = 1;
    this.frame = 0;
    this.waiting = false;
    this.startPosition = 0;
    this.scale = scale;
    this.length = width;
    this.startPosition = position.x;
    this.waitTime = waitTime;
    this.specifics = [
      ["idle", idle, idleCount, idleInterval, false],
      ["walk", walk, walkCount, walkInterval, true]
    ];
  }
  build() {
    this.specifics.forEach(([key, url, count, interval, loop]) => {
      this.animations[key] = new CanvasAnimation({
        animation: new PrepSpritesheet({
          url,
          factor: this.scale,
          size: this.size,
          repeatX: count,
          interval
        }, this.game),
        loop
      });
      this.addChild(this.animations[key], true);
    });
    this.size = this.size.scale(this.scale);
    this.go(this.direction);
  }
  wait() {
    this.waiting = true;
    this.frame = 0;
    this.animations.idle.frame = 0;
    this.animations.idle.active = true;
    this.animations.walk.active = false;
  }
  go(d) {
    this.turn(d);
    this.waiting = false;
    this.animations.idle.active = false;
    this.animations.walk.active = true;
  }
  turn(d) {
    this.direction = d;
    Object.entries(this.animations).forEach(([key, a]) => {
      a.zoomX = this.direction;
      a.x = this.size.x / 2 * (this.direction * -1);
    });
  }
  tick(o) {
    super.tick(o);
    if (this.waiting) {
      this.frame++;
      if (this.frame > this.waitTime) {
        this.go(this.direction * -1);
      }
    }
    if (!this.waiting) {
      this.place += this.speed * o.interval / 10 * this.direction;
      if (this.place > this.length) {
        this.place = this.length;
        this.wait();
      }
      if (this.place < 0) {
        this.place = 0;
        this.wait();
      }
      this.x = this.place + this.startPosition;
    }
  }
};

// ts/modes/side/npcs/npcOld.ts
var NPCOld = class extends WalkingNPC {
  constructor({
    scale = 5,
    position = Vector2.zero,
    controllers = [],
    width
  }) {
    super({
      scale,
      position,
      controllers,
      size: new Vector2(34, 42),
      idle: "/img/spritesheets/oldman-idle.png",
      idleCount: 8,
      idleInterval: 40,
      walk: "/img/spritesheets/oldman-walk.png",
      walkCount: 12,
      walkInterval: 30,
      width,
      waitTime: 40 * 8 + 200
    });
  }
};

// ts/modes/side/npcs/idleNPC.ts
var IdleNPC = class extends Character {
  constructor({
    scale = 5,
    position = Vector2.zero,
    size,
    idle,
    idleCount,
    idleInterval,
    direction = -1
  }) {
    super({
      position,
      size: new Vector2(size.x, size.y)
    });
    this.relativity = "anchor";
    this.animations = {};
    this.scale = scale;
    this.specifics = [idle, idleCount, idleInterval, direction];
  }
  build() {
    const [url, count, interval, direction] = this.specifics;
    this.animations.idle = new CanvasAnimation({
      animation: new PrepSpritesheet({
        url,
        factor: this.scale,
        size: this.size,
        repeatX: count,
        interval
      }, this.game),
      zoom: new Vector2(direction, 1),
      position: new Vector2(this.size.x * this.scale / 2 * direction * -1, 0)
    });
    this.addChild(this.animations.idle, true);
    this.size = this.size.scale(this.scale);
  }
};

// ts/modes/side/npcs/npcWoman.ts
var NPCWoman = class extends IdleNPC {
  constructor({
    scale = 5,
    position = Vector2.zero,
    direction = -1
  } = {}) {
    super({
      scale,
      position,
      size: new Vector2(37, 46),
      idle: "/img/spritesheets/woman-idle.png",
      idleCount: 7,
      idleInterval: 30,
      direction
    });
  }
};

// ts/modes/side/levels/trainDoor.ts
var TrainDoor = class extends CanvasWrapper {
  constructor(draw, car) {
    super();
    this.draw = draw;
    this.car = car;
    this.doorHeight = 45 * this.draw.scale;
  }
  build() {
    this.outer = new CanvasImage({
      image: new PrepImage({
        url: "/img/train/door.png",
        factor: 6
      }, this.game),
      position: new Vector2(0, 0)
    });
    this.addChild(this.outer);
    const or = this.outer.render.bind(this.outer);
    this.outer.render = (c) => {
      if (this.offset.x + 17 * this.draw.scale * this.draw.factor > 0) {
        c.save();
        c.transform((this.offset.x + 17 * this.draw.scale * this.draw.factor) / this.outer.prepped.width, -0.22, 0, 1 / (this.outer.prepped.height / this.doorHeight), 17 * this.draw.scale, 13 * this.draw.scale);
        or(c);
        c.restore();
      }
      if (this.offset.x + 223 * this.draw.scale * this.draw.factor < 0) {
        c.save();
        c.transform((this.offset.x + 223 * this.draw.scale * this.draw.factor) / this.outer.prepped.width, -0.22, 0, 1 / (this.outer.prepped.height / this.doorHeight), 240 * this.draw.scale, 13 * this.draw.scale);
        or(c);
        c.restore();
      }
    };
    this.inner = new CanvasImage({
      image: new PrepImage({
        url: "/img/train/door2.png",
        factor: 6
      }, this.game),
      position: new Vector2(0, 0)
    });
    this.addChild(this.inner);
    const ir = this.inner.render.bind(this.inner);
    this.inner.render = (c) => {
      if (this.offset.x + 17 * this.draw.scale * this.draw.factor < 0) {
        c.save();
        c.transform((this.offset.x + 17 * this.draw.scale * this.draw.factor) / this.inner.prepped.width, -0.22, 0, 1 / (this.inner.prepped.height / this.doorHeight), 17 * this.draw.scale, 14 * this.draw.scale);
        ir(c);
        c.restore();
      }
      if (this.offset.x + 223 * this.draw.scale * this.draw.factor > 0) {
        c.save();
        c.transform((this.offset.x + 223 * this.draw.scale * this.draw.factor) / this.inner.prepped.width, -0.22, 0, 1 / (this.inner.prepped.height / this.doorHeight), 240 * this.draw.scale, 14 * this.draw.scale);
        ir(c);
        c.restore();
      }
    };
  }
};

// ts/modes/side/levels/trainCar.ts
var TrainCar = class extends CanvasWrapper {
  constructor(train, x, y = 100, w = 800, h = 400) {
    super({
      position: new Vector2(x, y),
      size: new Vector2(w, h)
    });
    this.train = train;
  }
  set offset(value) {
    this.door.offset = value;
  }
  build() {
    this.frame = new CanvasImage({
      image: new PrepImage({
        url: "/img/train/Frame Back.png",
        factor: this.train.canvasDrawer.scale
      }, this.game),
      position: new Vector2(0, 0)
    });
    this.addChild(this.frame);
    this.interior = new CanvasImage({
      image: new PrepImage({
        url: "/img/train/Interior.png",
        factor: this.train.canvasDrawer.scale
      }, this.game),
      position: new Vector2(0, 0)
    });
    this.addChild(this.interior);
    this.interior.relativity = "anchor";
    this.interior.addChild(new CanvasCustom({
      render: (c) => {
        const ce = this.width / 2 + this.x - (this.mode.width / 2 - this.level.x);
        this.train.canvasDrawer.fill(this, [
          [9, 14],
          [247, 14],
          [247, ce + 762 > 0 ? 16 : 8, ce + 762 > 0 ? 1 : 0],
          [247, 8, 1],
          [9, 8, 1],
          [9, ce - 762 <= 0 ? 16 : 8, ce - 762 <= 0 ? 1 : 0],
          [9, 16]
        ], "#58473f", "#140e14");
        this.train.canvasDrawer.fill(this, [
          [18, 16],
          [240, 16],
          [240, 16, 1],
          [18, 16, 1]
        ], "#8f563b");
        for (let index = 18; index < 239; index += 4) {
          this.train.canvasDrawer.line(this, "#662736", 0 + index, 16, 0, 0 + index, 16, 1, "x");
          this.train.canvasDrawer.line(this, "#e37332", 1 + index, 16, 0, 1 + index, 16, 1, "x");
          if (index % 8 === 2) {
            this.train.canvasDrawer.line(this, "#662736", 0 + index, 16, 0.2, 0 + index, 16, 0.3, "x", 4);
          }
          if (index % 8 === 6) {
            this.train.canvasDrawer.line(this, "#662736", 0 + index, 16, 0.7, 0 + index, 16, 0.8, "x", 4);
          }
        }
      }
    }), true);
    this.door = new TrainDoor(this.train.canvasDrawer, this);
    this.interior.addChild(this.door, true);
    this.interior.addChild(new CanvasCustom({
      render: (c) => {
        const ce = this.width / 2 + this.x - (this.mode.width / 2 - this.level.x);
        this.train.canvasDrawer.fill(this, [
          [8, 61, 0],
          [248, 61, 0],
          [248, ce + 762 > 0 ? 61 : 57, ce + 762 > 0 ? 1 : 0],
          [248, 57, 1],
          [8, 57, 1],
          [8, ce - 762 <= 0 ? 61 : 57, ce - 762 <= 0 ? 1 : 0],
          [8, 61, 0]
        ], "#7e6970", "#140e14");
        this.train.canvasDrawer.line(this, "#140e14", 8, 57, 1, 8, 61, 1);
        this.train.canvasDrawer.line(this, "#140e14", 8, 61, 1, 248, 61, 1);
        this.train.canvasDrawer.line(this, "#140e14", 248, 61, 1, 248, 57, 1);
        this.train.canvasDrawer.line(this, "#140e14", 8, 61, 0, 8, 61, 1);
        this.train.canvasDrawer.line(this, "#140e14", 248, 61, 0, 248, 61, 1);
      }
    }), true);
    this.interior.addChild(new NPCOld({
      position: new Vector2(30 * this.train.canvasDrawer.scale, 14 * this.train.canvasDrawer.scale),
      width: this.width - 60 * this.train.canvasDrawer.scale
    }), true);
    this.interior.addChild(new NPCWoman({
      position: new Vector2(12 * this.train.canvasDrawer.scale, 13 * this.train.canvasDrawer.scale)
    }), true);
    [
      [0, 5, 256, 6],
      //hedgeBottom
      [8, 50, 240, 8]
      //hedgeBottom
    ].forEach(([x, y, w, h, t = 80]) => {
      this.addChild(new Collider({
        position: new Vector2(x * this.train.canvasDrawer.scale, y * this.train.canvasDrawer.scale),
        size: new Vector2(w * this.train.canvasDrawer.scale, h * this.train.canvasDrawer.scale),
        cornerTolerance: t
      }));
    });
  }
};

// ts/modes/side/levels/trainCarForeground.ts
var TrainCarForeground = class extends CanvasWrapper {
  constructor(car, character) {
    super({
      position: new Vector2(car.x, car.y - 50),
      size: new Vector2(car.width, car.height),
      relativity: "anchor",
      zoom: new Vector2(car.train.canvasDrawer.factor + 1, car.train.canvasDrawer.factor + 1)
    });
    this.car = car;
    this.character = character;
    this.relativity = "anchor";
    this.wheelFrame = 0;
  }
  build() {
    this.wheels1 = new CanvasAnimation({
      animation: new PrepSpritesheet({
        url: "/img/train/wheels.png",
        factor: this.car.train.canvasDrawer.scale,
        size: new Vector2(16, 8),
        repeatX: 4,
        interval: 30
      }, this.game),
      reverse: true,
      position: new Vector2(24 * this.car.train.canvasDrawer.scale, 0)
    });
    this.addChild(this.wheels1);
    this.wheels2 = new CanvasAnimation({
      animation: new PrepSpritesheet({
        url: "/img/train/wheels.png",
        factor: this.car.train.canvasDrawer.scale,
        size: new Vector2(16, 8),
        repeatX: 4,
        interval: 30
      }, this.game),
      reverse: true,
      position: new Vector2(48 * this.car.train.canvasDrawer.scale, 0)
    });
    this.addChild(this.wheels2);
    this.wheels2.frame = 20;
    this.wheels3 = new CanvasAnimation({
      animation: new PrepSpritesheet({
        url: "/img/train/wheels.png",
        factor: this.car.train.canvasDrawer.scale,
        size: new Vector2(16, 8),
        repeatX: 4,
        interval: 30
      }, this.game),
      reverse: true,
      position: new Vector2(192 * this.car.train.canvasDrawer.scale, 0)
    });
    this.addChild(this.wheels3);
    this.wheels3.frame = 2 * 20;
    this.wheels4 = new CanvasAnimation({
      animation: new PrepSpritesheet({
        url: "/img/train/wheels.png",
        factor: this.car.train.canvasDrawer.scale,
        size: new Vector2(16, 8),
        repeatX: 4,
        interval: 30
      }, this.game),
      reverse: true,
      position: new Vector2(216 * this.car.train.canvasDrawer.scale, 0)
    });
    this.addChild(this.wheels4);
    this.wheels4.frame = 3 * 20;
    this.frame = new CanvasImage({
      image: new PrepImage({
        url: "/img/train/Frane Front.png",
        factor: this.car.train.canvasDrawer.scale
      }, this.game)
    });
    this.addChild(this.frame);
    this.foreground = new CanvasImage({
      image: new PrepImage({
        url: "/img/train/Exterior.png",
        factor: this.car.train.canvasDrawer.scale
      }, this.game)
    });
    this.addChild(this.foreground);
    this.wheelFrame = 50 * this.car.x / this.car.width;
  }
  tick(obj) {
    super.tick(obj);
    const f = 200;
    [this.wheels4, this.wheels2, this.wheels3, this.wheels1].forEach((w) => {
      w.interval = 160 - Math.round(this.car.train.speed / this.car.train.maxSpeed * 120);
    });
    this.wheelFrame = (this.wheelFrame + 1) % 200;
    this.wheels4.y = this.wheelFrame > 0 && this.wheelFrame < 30 ? this.car.train.canvasDrawer.scale : 0;
    this.wheels3.y = this.wheelFrame > 20 && this.wheelFrame < 50 ? this.car.train.canvasDrawer.scale : 0;
    this.wheels2.y = this.wheelFrame > 0 && this.wheelFrame < 30 ? this.car.train.canvasDrawer.scale : 0;
    this.wheels1.y = this.wheelFrame > 20 && this.wheelFrame < 50 ? this.car.train.canvasDrawer.scale : 0;
    this.frame.y = this.wheelFrame > 40 && this.wheelFrame < 70 ? this.car.train.canvasDrawer.scale / 3 : 0;
    this.foreground.y = this.wheelFrame > 40 && this.wheelFrame < 70 ? this.car.train.canvasDrawer.scale / 3 : 0;
    this.car.frame.y = this.wheelFrame > 40 && this.wheelFrame < 70 ? this.car.train.canvasDrawer.scale / 3 : 0;
    this.car.interior.y = this.wheelFrame > 40 && this.wheelFrame < 70 ? this.car.train.canvasDrawer.scale / 3 : 0;
    this.x = this.car.x - this.car.width * (this.car.train.canvasDrawer.factor / 2) + (this.width / 2 + this.x - (this.mode.width / 2 - this.level.x)) * this.car.train.canvasDrawer.factor;
    this.car.offset = this.position.subtract(this.car.position);
    if (this.character.y < this.y + this.height) {
      this.foreground.opacity = Util.clamp((Math.abs(this.width / 2 + this.x - (this.character.width / 2 + this.character.x)) - (this.width / 2 - f)) / f, 0, 1);
    }
  }
};

// ts/modes/side/levels/train.ts
var Train = class extends Level {
  constructor() {
    super({
      hasDom: true,
      size: new Vector2(256 * 6 * 6, 1200)
    });
    this.start = Vector2.zero;
    this.background = new CanvasColorBackground("#46345E");
    this.trainCars = [];
    this.speed = 0;
    this.maxSpeed = 10;
    this.frame = 0;
  }
  perpective(z, target) {
    this.game.ctx.scale(1 + this.canvasDrawer.factor * z, 1 + this.canvasDrawer.factor * z);
    this.game.ctx.translate(-target.width * (this.canvasDrawer.factor / 2) * z, 0);
    this.game.ctx.translate(
      (target.width / 2 + target.x - (this.mode.width / 2 - this.level.x)) * this.canvasDrawer.factor * z,
      -50 * z
    );
  }
  build() {
    this.canvasDrawer = new CanvasDrawer(this.game.ctx, this.perpective.bind(this));
    this.start = new Vector2(256 * this.canvasDrawer.scale * 1.5, 12 * this.canvasDrawer.scale + 90);
    this.trainCars.push(new TrainCar(this, 256 * this.canvasDrawer.scale * 1, 90, 256 * this.canvasDrawer.scale, 64 * this.canvasDrawer.scale));
    this.trainCars.push(new TrainCar(this, 256 * this.canvasDrawer.scale * 2, 90, 256 * this.canvasDrawer.scale, 64 * this.canvasDrawer.scale));
    this.trainCars.push(new TrainCar(this, 256 * this.canvasDrawer.scale * 3, 90, 256 * this.canvasDrawer.scale, 64 * this.canvasDrawer.scale));
    this.character = new SideCharacter({
      position: this.start,
      controllers: [new SideContoller()]
    });
    this.addChild(this.background);
    this.env = new Scroller();
    this.addChild(this.env);
    this.trainCars.forEach((trainCar) => {
      this.addChild(trainCar);
    });
    this.addChild(this.character);
    this.trainCars.forEach((trainCar) => {
      this.addChild(new TrainCarForeground(trainCar, this.character));
    });
    const loco = new Locomotive(this.canvasDrawer, 256 * this.canvasDrawer.scale * 4, 90, 256 * this.canvasDrawer.scale, 64 * this.canvasDrawer.scale);
    this.addChild(loco);
    [
      [0, 0, this.width, 35]
    ].forEach(([x, y, w, h, t = 30]) => {
      this.addChild(new Collider({
        position: new Vector2(x, y),
        size: new Vector2(w, h)
      }));
    });
  }
  tick(obj) {
    super.tick(obj);
    this.frame = (this.frame + 1) % (3e3 * Math.PI);
    this.speed = +(Math.sin(this.frame / 3e3) * this.maxSpeed).toPrecision(2);
    this.env.speed = this.speed;
  }
};

// ts/modes/side/SideMode.ts
var SideMode = class extends Mode {
  constructor() {
    super({ hasDom: true });
  }
  build() {
    super.build();
    this.addChild(new CanvasColorBackground("#272727"));
    this.addLevel("platform", new Train());
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
  }
};

// ts/index.ts
document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new Game().dom.dom);
  ;
});
//# sourceMappingURL=index.js.map
