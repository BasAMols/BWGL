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
    this.lastPosition = Vector2.zero;
    this.movedAmount = Vector2.zero;
    this._x = 0;
    this._y = 0;
    this.relativity = attr.relativity || "relative";
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
  get t() {
    return this.game.t;
  }
  get gl() {
    return this.GLR.gl;
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

// ts/elements/dom/domElement.ts
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
  ready() {
    this.build();
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

// ts/elements/canvas/canvasElement.ts
var CanvasElement = class extends Element {
  constructor(attr = {}) {
    super(attr);
    this.rendererType = "canvas";
    this.composite = "source-over";
    this.lowerChildren = [];
    this.higherChildren = [];
    this.glElements = [];
    this.controllers = [];
    this.anchoredPosition = Vector2.zero;
    this.hasDom = attr.hasDom || false;
    if (this.hasDom) {
      this.dom = new DomElement("div");
    }
    this.autoReady = attr.autoReady !== void 0 ? attr.autoReady : true;
    this.composite = attr.composite || "source-over";
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
  get camera() {
    return this.mode.camera;
  }
  set camera(c) {
    this.mode.camera = c;
  }
  ready() {
    this.build();
    if (this.game.waitCount) {
      this.game.waitCount--;
    }
  }
  addChild(child, above = false) {
    var _a, _b, _c, _d, _e;
    (_a = child.parent) != null ? _a : child.parent = this;
    (_b = child.game) != null ? _b : child.game = this.game;
    (_c = child.mode) != null ? _c : child.mode = this.mode;
    (_d = child.level) != null ? _d : child.level = this.level;
    (_e = child.GLR) != null ? _e : child.GLR = this.game.GLR;
    if (this.game.waitCount) {
      this.game.waitCount++;
    }
    if (child.rendererType === "canvas") {
      this[above ? "higherChildren" : "lowerChildren"].push(child);
      child.registerControllers(child);
      if (child.dom && this.hasDom) {
        this.dom.addChild(child.dom);
      }
    } else if (child.rendererType === "gl") {
      this.glElements.push(child);
    } else {
      if (this.hasDom) {
        this.dom.addChild(child);
      } else {
        console.log("The CanvasElement class does not have a dom element to add children to. Child:", child.constructor.name);
      }
    }
    if (child.rendererType === "dom" || child.autoReady) {
      child.ready();
    }
    return child;
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
    this.glElements.filter((child) => child.active).forEach((c) => c.tick(obj));
    if (this.dom) {
      this.dom.tick(obj);
    }
  }
  preRender(c, gl) {
    c.save();
    if (this.relativity === "anchor" || this.relativity === "composite") {
      c.translate(this.x, this.y);
      c.scale(this.zoom.x, this.zoom.y);
    }
    c.save();
    c.globalCompositeOperation = this.composite;
    this.renderLower(c);
    this.render(c);
    c.restore();
  }
  renderLower(c, gl) {
    this.lowerChildren.filter((child) => child.visible && child.active).forEach((child) => {
      child.preRender(c);
      child.postRender(c);
    });
  }
  render(c, gl) {
  }
  renderHigher(c, gl) {
    this.higherChildren.filter((child) => child.visible && child.active).forEach((child) => {
      child.preRender(c);
      child.postRender(c);
    });
  }
  renderGl(gl) {
    this.glElements.filter((child) => child.visible && child.active).forEach((child) => {
      child.preRender(gl);
      child.postRender(gl);
    });
  }
  postRender(c, gl) {
    this.renderHigher(c);
    c.restore();
  }
};

// ts/elements/canvas/canvasWrapper.ts
var CanvasWrapper = class extends CanvasElement {
  constructor(attr = {}) {
    super(attr);
    this.type = "wrapper";
    if (!attr.relativity) {
      this.relativity = "anchor";
    }
  }
};

// ts/elements/dom/domText.ts
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
      text: "Click to start"
    });
    this.overlay.dom.setAttribute(
      "style",
      "\n            transform-origin: left bottom;\n            pointer-events: none;\n            bottom: 0px;\n            left: 0px;\n            user-select: none;\n            z-index: 999;\n            position: absolute;\n            height: 100vh;\n            width: 100vw;\n            background: #000000a6;\n            color: white !important;\n            font-family: monospace;\n            font-weight: bold;\n            font-size: 40px;\n            padding-left: 50px;\n            padding-top: 20px;\n            box-sizing: border-box;\n            text-transform: uppercase;"
    );
    document.body.appendChild(this.overlay.dom);
    document.addEventListener("pointerlockchange", () => {
      this.locked = document.pointerLockElement === this.canvas.dom;
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
  send(event, e) {
    Object.values(this.game.modes).forEach((mode) => this.recursive(event, mode, e));
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
      if (element.rendererType !== "gl") {
        element.lowerChildren.forEach((child) => this.recursive(event, child, e));
        element.higherChildren.forEach((child) => this.recursive(event, child, e));
        element.glElements.forEach((child) => this.recursive(event, child, e));
      }
      element.controllers.forEach((child) => this.recursive(event, child, e));
    }
  }
};

// ts/elements/dom/domCanvas.ts
var DomCanvas = class extends DomElement {
  constructor(game) {
    super("canvas");
    this.game = game;
    this.dom = document.createElement("canvas");
    this.dom.style.position = "absolute";
    this.dom.style.imageRendering = "pixelated";
    this.dom.style.pointerEvents = "all";
    this.dom.style.bottom = "0px";
    this.ctx = this.dom.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.domGl = document.createElement("canvas");
    this.domGl.style.position = "absolute";
    this.domGl.style.pointerEvents = "none";
    this.domGl.style.bottom = "0px";
  }
  build() {
    this.game.ctx = this.ctx;
    this.dom.tabIndex = 1;
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      var _a, _b;
      this.size = size;
      (_b = (_a = this.game) == null ? void 0 : _a.GLR) == null ? void 0 : _b.resize();
    });
    this.game.resize();
  }
  get width() {
    return Math.round(Number(this.dom.style.width.replace(/\D/g, "")));
  }
  set width(value) {
    if (this.dom) {
      this.dom.style.width = "".concat(value, "px");
      this.dom.setAttribute("width", String(value));
    }
    if (this.domGl) {
      this.domGl.style.width = "".concat(value, "px");
      this.domGl.setAttribute("width", String(value));
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
    if (this.domGl) {
      this.domGl.style.height = "".concat(value, "px");
      this.domGl.setAttribute("height", String(value));
    }
  }
  addMode(child) {
    var _a, _b, _c, _d, _e;
    (_a = child.parent) != null ? _a : child.parent = this.game;
    (_b = child.game) != null ? _b : child.game = this.game;
    (_c = child.mode) != null ? _c : child.mode = this.mode;
    (_d = child.level) != null ? _d : child.level = this.level;
    (_e = child.GLR) != null ? _e : child.GLR = this.game.GLR;
    this.game.dom.appendChild(child.dom);
    child.registerControllers(child);
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
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.scale(1, -1);
    this.ctx.translate(0, -this.height);
    Object.values(this.game.modes).filter((child) => child.active).forEach((mode) => mode.tick(obj));
    Object.values(this.game.modes).filter((child) => child.visible && child.active).forEach((mode) => {
      mode.preRender(this.ctx);
      mode.postRender(this.ctx);
    });
    this.ctx.restore();
    this.game.GLR.draw();
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

// ts/utils/glInit.ts
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: ".concat(gl.getShaderInfoLog(shader))
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
function initShaderProgram(gl) {
  const vsSource = "\n    attribute vec4 aVertexPosition;\n    attribute vec2 aTextureCoord;\n  \n    uniform mat4 uModelViewMatrix;\n    uniform mat4 uProjectionMatrix;\n  \n    varying highp vec2 vTextureCoord;\n  \n    void main(void) {\n      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n      vTextureCoord = aTextureCoord;\n    }\n    ";
  const fsSource = "\n    varying highp vec2 vTextureCoord;\n\n    uniform sampler2D uSampler;\n  \n    void main(void) {\n      gl_FragColor = texture2D(uSampler, vTextureCoord);\n    }\n  ";
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
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
  return {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
      textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord")
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      uSampler: gl.getUniformLocation(shaderProgram, "uSampler")
    }
  };
}

// ts/utils/vector3.ts
function v3(n, y, z) {
  if (typeof n === "number") {
    return Vector3.f(n, y, z);
  } else if (typeof n === "undefined") {
    return Vector3.f(0);
  } else {
    return Vector3.f(...n);
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
  constructor(x = 0, y = 0, z = 0) {
    this.vec = [x, y, z];
  }
  static from2(vector, z = 0) {
    return new _Vector3(vector.x, vector.y, z);
  }
  static f(x = 0, y = x, z = x) {
    return new _Vector3(x, y, z);
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
};

// ts/utils/gl.ts
var GLR = class {
  constructor(game) {
    this.game = game;
    this.objects = [];
    this.frameData = {};
    this.gl = this.game.renderer.domGl.getContext("webgl");
    this.programInfo = initShaderProgram(this.gl);
  }
  get t() {
    return this.game.t;
  }
  resize() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }
  initGlElement(mesh) {
    this.objects.push(mesh);
  }
  setCamera() {
    const fieldOfView = this.game.mode.camera.fov * Math.PI / 180;
    const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 1e4;
    const projectionMatrix = mat4_exports.create();
    const modelViewMatrix = mat4_exports.create();
    mat4_exports.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    mat4_exports.translate(
      projectionMatrix,
      projectionMatrix,
      this.game.mode.camera.offset.multiply(1, 1, -1).vec
    );
    this.game.mode.camera.rotation.forEach((r, i) => {
      mat4_exports.rotate(
        projectionMatrix,
        projectionMatrix,
        r,
        [Number(i === 0), Number(i === 1), Number(i === 2)]
      );
    });
    mat4_exports.translate(
      modelViewMatrix,
      modelViewMatrix,
      this.game.mode.camera.target.multiply(-1, 1, 1).vec
    );
    this.frameData.projectionMatrix = projectionMatrix;
    this.frameData.modelViewMatrix = modelViewMatrix;
  }
  clear() {
    this.gl.clearColor(0, 0, 0, 0.5);
    this.gl.clearDepth(1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  draw() {
    this.clear();
    this.setCamera();
    this.objects.forEach((o) => {
      this.drawObject(o);
    });
  }
  drawObject(mesh) {
    this.setPositionAttribute(mesh);
    this.setTextureAttribute(mesh);
    this.gl.useProgram(this.programInfo.program);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.buffer.indices);
    let currentModelview = mat4_exports.clone(this.frameData.modelViewMatrix);
    mat4_exports.translate(
      currentModelview,
      currentModelview,
      mesh.position3.multiply(new Vector3(1, 1, -1)).vec
    );
    mat4_exports.translate(
      currentModelview,
      currentModelview,
      mesh.anchorPoint.multiply(1, 1, -1).vec
    );
    mesh.rotation.multiply(new Vector3(1, -1, -1)).forEach((r, i) => {
      mat4_exports.rotate(
        currentModelview,
        currentModelview,
        r,
        [Number(i === 0), Number(i === 1), Number(i === 2)]
      );
    });
    mat4_exports.translate(
      currentModelview,
      currentModelview,
      mesh.anchorPoint.multiply(-1, -1, 1).vec
    );
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.projectionMatrix,
      false,
      this.frameData.projectionMatrix
    );
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.modelViewMatrix,
      false,
      currentModelview
    );
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, mesh.texture.texture);
    this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.drawElements(
      this.gl.TRIANGLES,
      mesh.verticesCount,
      this.gl.UNSIGNED_SHORT,
      0
    );
  }
  setPositionAttribute(mesh) {
    const numComponents = 3;
    const type = this.gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer.positionBuffer);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
  }
  setColorAttribute(mesh) {
    const numComponents = 4;
    const type = this.gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer.colorBuffer);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);
  }
  setTextureAttribute(mesh) {
    const num = 2;
    const type = this.gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer.textureCoord);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.textureCoord,
      num,
      type,
      normalize,
      stride,
      offset
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);
  }
};

// ts/utils/mode.ts
var Mode = class extends CanvasWrapper {
  constructor() {
    super(...arguments);
    this.levels = {};
    this.relativity = "anchor";
    this._camera = {
      target: Vector3.f(0),
      rotation: Vector3.f(0),
      offset: Vector3.f(0),
      fov: 60
    };
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
    return this._camera;
  }
  set camera(value) {
    this._camera = value;
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
  tick(obj) {
    super.tick(obj);
    this.controllers.filter((child) => child.active).forEach((c) => c.tick(obj));
    this.lowerChildren.filter((child) => child.active).forEach((c) => c.tick(obj));
    this.higherChildren.filter((child) => child.active).forEach((c) => c.tick(obj));
    this.glElements.filter((child) => child.active).forEach((c) => c.tick(obj));
    if (this.dom) {
      this.dom.tick(obj);
    }
  }
};

// ts/elements/canvas/canvasColor.ts
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

// ts/elements/canvas/canvasSquare.ts
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
      if (this.color) {
        ctx.fill();
      }
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

// ts/elements/canvas/canvasBackground.ts
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

// ts/elements/gl/glElement.ts
var GlElement = class extends Element {
  constructor(attr = {}) {
    super(attr);
    this.rendererType = "gl";
    this.glChildren = [];
    this.controllers = [];
    this.anchoredPosition = Vector2.zero;
    this.z = 0;
    this._rotation = v3(0);
    this._depth = 1;
    this.autoReady = attr.autoReady !== void 0 ? attr.autoReady : true;
    this.addControllers(attr.controllers || []);
    this.size3 = attr.size3 || v3(0);
    this.position3 = attr.position3 || v3(0);
    this.rotation = attr.rotation || v3(0);
    this.anchorPoint = attr.anchorPoint || v3(0);
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
  get x() {
    return super.x;
  }
  set x(n) {
    super.x = n;
  }
  get y() {
    return super.y;
  }
  set y(n) {
    super.y = n;
  }
  get position3() {
    return v3(this.x, this.y, this.z);
  }
  set position3({ x, y, z }) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(r) {
    this._rotation = r;
  }
  get width() {
    return super.width;
  }
  set width(n) {
    super.width = n;
  }
  get height() {
    return super.height;
  }
  set height(n) {
    super.height = n;
  }
  get depth() {
    return this._depth;
  }
  set depth(n) {
    this._depth = n;
  }
  get size3() {
    return v3(this.width, this.height, this.depth);
  }
  set size3({ x, y, z }) {
    this.width = x;
    this.height = y;
    this.depth = z;
  }
  get camera() {
    return this.mode.camera;
  }
  set camera(c) {
    this.mode.camera = c;
  }
  ready() {
    this.build();
    if (this.game.waitCount) {
      this.game.waitCount--;
    }
  }
  addChild(child) {
    var _a, _b, _c, _d, _e;
    (_a = child.parent) != null ? _a : child.parent = this;
    (_b = child.game) != null ? _b : child.game = this.game;
    (_c = child.mode) != null ? _c : child.mode = this.mode;
    (_d = child.level) != null ? _d : child.level = this.level;
    (_e = child.GLR) != null ? _e : child.GLR = this.game.GLR;
    if (this.game.waitCount) {
      this.game.waitCount++;
    }
    this.glChildren.push(child);
    child.registerControllers(child);
    if (child.autoReady) {
      child.ready();
    }
    return child;
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
    this.glChildren.filter((child) => child.active).forEach((c) => c.tick(obj));
  }
  preRender(c) {
    this.renderLower(c);
    this.render(c);
  }
  renderLower(c) {
    this.glChildren.filter((child) => child.visible && child.active).forEach((child) => {
      child.preRender(c);
      child.postRender(c);
    });
  }
  render(c) {
  }
  postRender(c) {
  }
};

// ts/elements/gl/glRendable.ts
var GLRendable = class extends GlElement {
  constructor(attr = {}) {
    super(attr);
    this.colors = [];
  }
  build() {
    this.buffer = {
      positionBuffer: this.positionBuffer(this.size3),
      colorBuffer: this.colorBuffer(this.colors),
      indices: this.indexBuffer(),
      textureCoord: this.textureBuffer(this.size3)
    };
    this.GLR.initGlElement(this);
  }
  ready() {
    this.build();
    if (this.game.waitCount) {
      this.game.waitCount--;
    }
  }
  getColorBuffer(colors) {
    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    return colorBuffer;
  }
  getIndexBuffer(indices) {
    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );
    return indexBuffer;
  }
  getPositionBuffer(positions) {
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    return positionBuffer;
  }
  getTextureBuffer(coordinates) {
    const textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(coordinates),
      this.gl.STATIC_DRAW
    );
    return textureCoordBuffer;
  }
};

// ts/elements/gl/glTexture.ts
var GLTexture = class {
  constructor(game, attr) {
    this.game = game;
    this.image = new Image();
    if (attr.url) {
      this.game.waitCount++;
      this.image.onload = () => {
        this.game.waitCount--;
        this.loadTexture();
      };
      this.image.src = "".concat(window.location.href, "/tex/").concat(attr.url);
    } else {
      this.loadColor(attr.color || [0, 0, 1, 0.5]);
    }
  }
  loadColor([r, g, b, a]) {
    const gl = this.game.gl;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([r * 255, g * 255, b * 255, a * 255])
    );
    this.texture = texture;
  }
  loadTexture() {
    const gl = this.game.gl;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.image
    );
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    if (this.isPowerOf2(this.image.width) && this.isPowerOf2(this.image.height)) {
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

// ts/elements/gl/glMesh.ts
var GlMesh = class extends GLRendable {
  constructor(attr) {
    super(attr);
    this.type = "mesh";
    this.colors = [];
    this.verticesCount = 36;
    this.dimensions = 0 | 1 | 2 | 3;
    this.dimensions = attr.size3.array.filter((v) => v !== 0).length;
    this.textureUrl = attr.textureUrl;
    if (attr.colors)
      this.colors = attr.colors;
    else if (this.dimensions === 2)
      this.colors = [Colors.r];
    else
      this.colors = [
        Colors.r,
        Colors.g,
        Colors.b,
        Colors.c,
        Colors.m,
        Colors.y
      ];
  }
  build() {
    super.build();
    this.texture = new GLTexture(this.game, this.textureUrl ? { url: this.textureUrl } : { color: this.colors[0] });
  }
  colorBuffer() {
    while (this.colors.length < this.verticesCount / 3) {
      this.colors.push(this.colors[0]);
    }
    var colors = [];
    this.colors.forEach((f) => {
      colors = colors.concat(f, f, f, f);
    });
    return this.getColorBuffer(colors);
  }
  indexBuffer() {
    let b = [
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
    if (this.dimensions === 2) {
      this.verticesCount = 6;
      b = b.slice(0, 6);
    }
    return this.getIndexBuffer(b);
  }
  positionBuffer(size) {
    let b = [
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
    if (this.dimensions === 2) {
      if (this.depth === 0)
        b = b.slice(0, 24);
      else if (this.width === 0)
        b = b.slice(60, 72);
      else if (this.height === 0)
        b = b.slice(36, 48);
    }
    return this.getPositionBuffer(b.map((n, i) => n * size.array[i % 3]));
  }
  textureBuffer(size) {
    let b = [
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
    if (this.dimensions === 2) {
      if (this.depth === 0)
        b = b.slice(0, 8);
      else if (this.width === 0)
        b = b.slice(40, 48);
      else if (this.height === 0)
        b = b.slice(24, 32);
    }
    return this.getTextureBuffer(b);
  }
};

// ts/elements/gl/glObj.ts
var GLobj = class extends GLRendable {
  constructor(attr = {}) {
    super(__spreadValues(__spreadValues({}, attr), { autoReady: false }));
    this.type = "mesh";
    this.verticesCount = 0;
    this.points = [];
    this.faces = [];
    this.faceColors = [];
    this.matIndex = [];
    this.mats = {};
    this.loadFile("".concat(window.location.href, "/obj/").concat(attr.url)).then(this.parseMat.bind(this)).then(this.parse.bind(this)).then(() => {
      this.ready();
    });
  }
  build() {
    super.build();
  }
  async parseMat(str2) {
    if (/mtllib/.test(str2)) {
      await this.loadFile("".concat(window.location.href, "obj/loco.mtl")).then((v) => {
        v.split("newmtl ").slice(1).forEach((s) => {
          const l = s.split("\n");
          this.mats[l.shift()] = l;
        });
      });
      return str2;
    } else {
      return str2;
    }
  }
  async parse(str2) {
    let mI;
    str2.split("\n").forEach(async (line) => {
      let command;
      line.split(/(?: |\/)/).forEach(async (word, i, ar) => {
        word = word.trim();
        if (/mtllib/.test(word)) {
          await this.loadFile("".concat(window.location.href, "/obj/").concat(ar[i + 1])).then(this.parseMat.bind(this));
        } else if (/usemtl/.test(word)) {
          mI = ar[i + 1];
        } else if (/(?:v|f)/.test(word)) {
          command = word;
          if (mI && command === "f") {
            this.matIndex.push(mI);
          }
        } else if (/([0-9-])/.test(word)) {
          if (command === "v") {
            this.points.push(Number(word));
            return;
          }
          if (command === "f") {
            this.faces.push(Number(word) - 1);
            return;
          }
        }
      });
    });
    const counts = {};
    this.matIndex.forEach(function(x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    this.faces = this.faces.filter((v, i) => i % 3 === 0);
    this.verticesCount = this.faces.length;
  }
  async loadFile(url) {
    const response = await fetch(url);
    const data = await response.text();
    return data;
  }
  colorBuffer() {
    if (Object.values(this.mats).length) {
      var colors = [];
      this.matIndex.forEach((n) => {
        const m = this.mats[n][2].slice(3).split(" ").map(Number);
        colors.push(...m, 1);
        colors.push(...m, 1);
        colors.push(...m, 1);
        colors.push(...m, 1);
      });
      return this.getColorBuffer(colors);
    }
    return this.getColorBuffer(this.faceColors);
  }
  indexBuffer() {
    return this.getIndexBuffer(this.faces);
  }
  positionBuffer(size) {
    return this.getPositionBuffer(this.points.map((n, i) => n * size.array[i % 3]));
  }
  textureBuffer(size) {
    if (Object.values(this.mats).length) {
      this.texture = new GLTexture(this.game, { color: Object.values(this.mats)[0][2].slice(3).split(" ").map(Number) });
    } else {
      this.texture = new GLTexture(this.game, {});
    }
    return this.getTextureBuffer(this.points.map((n, i) => n * size.array[i % 3]));
  }
};

// ts/utils/level.ts
var Level = class extends CanvasWrapper {
  constructor(attr = {}) {
    super(attr);
    this.relativity = "anchor";
    this.colliders = [];
    this._depth = 1;
    this.level = this;
    this.mode = this.mode;
    this.size = this.size;
    this.size3 = attr.size3;
  }
  get center() {
    return Vector3.from2(this.mode.size.scale(0.5).subtract(this.position), this.depth);
  }
  get width() {
    return super.width;
  }
  set width(n) {
    super.width = n;
  }
  get height() {
    return super.height;
  }
  set height(n) {
    super.height = n;
  }
  get depth() {
    return this._depth;
  }
  set depth(n) {
    this._depth = n;
  }
  get size3() {
    return v3(this.width, this.height, this.depth);
  }
  set size3({ x, y, z }) {
    this.width = x;
    this.height = y;
    this.depth = z;
  }
};

// ts/utils/character.ts
var Character = class extends GlElement {
  constructor(attr) {
    super(attr);
    this.type = "group";
  }
};

// ts/utils/controller.ts
var CanvasController = class extends CanvasElement {
  constructor() {
    super(...arguments);
    this.type = "logic";
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

// ts/modes/side/character/SideController.ts
var glController = class extends CanvasController {
  constructor() {
    super(...arguments);
    this.speed = 0.8;
    this.jumpHeight = 2;
    this.velocity = Vector3.f(0);
    this.jumping = false;
    this.jumpDuration = 0;
  }
  keyDown(e) {
    if (!this.jumping && this.mode.input.space) {
      this.jumpVelocity = 1;
    }
  }
  jump(m) {
    if (this.jumpDuration !== 0 || !this.jumping) {
      this.jumping = true;
      this.velocity.y += this.jumpHeight;
    }
  }
  land() {
    this.jumpDuration = 0;
    this.jumping = false;
  }
  mouseMove(e) {
    const r = v2(e.movementX, e.movementY).scale(5e-3);
    this.camera.rotation = v3(
      Util.clamp(this.camera.rotation.x + r.y, -0.1, Math.PI / 2),
      this.camera.rotation.y + r.x,
      this.camera.rotation.z
    );
  }
  scroll(e) {
    this.camera.offset.z = Util.clamp(this.camera.offset.z + e.deltaY * 0.1, 10, 300);
  }
  tick(obj) {
    super.tick(obj);
    const m = 1 / obj.frameRate * 144;
    if (this.mode.input.space) {
      this.jump(m);
    } else {
      this.jumpDuration = 0;
    }
    this.velocity.x = (this.mode.input.right ? 1 : this.mode.input.left ? -1 : 0) * this.speed;
    this.velocity.z = (this.mode.input.up ? 1 : this.mode.input.down ? -1 : 0) * this.speed;
    this.velocity.y = Util.to0(this.velocity.y - 9.8 * 3e-3 * m, 1e-4);
    if (this.velocity.x || this.velocity.y || this.velocity.z) {
      const frameScaledVelocity = this.velocity.scale(m);
      const rotated = v2(frameScaledVelocity.x, frameScaledVelocity.z).rotate(-this.camera.rotation.y);
      const movement = v3(
        rotated.x,
        frameScaledVelocity.y,
        rotated.y
      );
      const p = this.parent.position3.add(movement);
      if (p.y < 0) {
        this.velocity.y = 0;
        p.y = 0;
        if (this.jumping) {
          this.land();
        }
      }
      this.parent.position3 = p;
      if (movement.x || movement.z) {
        this.parent.rotation = this.camera.rotation.multiply(0, 1, 0);
      }
    }
  }
};

// ts/modes/side/character/SideCharacter.ts
var SideCharacter = class extends Character {
  constructor({
    position3 = Vector3.f(0),
    size3 = Vector3.f(0)
  } = {}) {
    super({
      position3,
      size3
    });
    this.relativity = "anchor";
    this.animations = {};
    this.direction = 1;
    this.phase = "idle";
    this.addControllers([new glController()]);
  }
  build() {
    this.registerControllers(this);
    this.addChild(this.mesh = new GlMesh({ anchorPoint: this.size3.multiply(0.5, 0, 0.5), size3: this.size3, position3: this.position3, colors: [[0.3, 0.3, 0.3, 1], [0.3, 0.3, 0.3, 1], [0.4, 0.4, 0.4, 1], [0.3, 0.3, 0.3, 1], [0.2, 0.2, 0.2, 1], [0.2, 0.2, 0.2, 1]] }));
  }
  tick(o) {
    super.tick(o);
    this.mesh.position3 = this.position3.clone();
    this.mesh.rotation = this.rotation.clone();
    this.camera.target = this.mesh.position3.clone().add(this.size3.multiply(0.5, 0.5, 0.5)).multiply(1, -1, 1);
  }
};

// ts/modes/side/levels/world.ts
var World = class extends Level {
  // public get speed(): number {
  //     if (this.inTrain) {
  //         return this.train.speed;
  //     } else {
  //         return 0;
  //     }
  // }
  // private _inTrain: boolean = false;
  // public get inTrain(): boolean {
  //     return this._inTrain;
  // }
  // public set inTrain(value: boolean) {
  //     this._inTrain = value;
  //     this.character.active = !value;
  //     this.train.character.active = value;
  //     this.train.x = 0;
  //     this.backgroundLayer.x = this.foregroundLayer.x = 0;
  //     if (value) {
  //         this.train.character.x = Util.clamp(this.character.x, this.train.left, this.train.right - 1);
  //     } else {
  //         this.character.position = this.train.character.position;
  //     }
  // }
  // public env: Scroller;
  // public frame: number = 0;
  // public backgroundLayer: CanvasWrapper;
  // public foregroundLayer: CanvasWrapper;
  // public characterLayer: CanvasComposite;
  // // public station: Station;
  // public trainLayer: CanvasWrapper;
  // public train: Train;
  constructor() {
    super({
      size3: v3(900, 200, 400)
    });
    this.start = Vector2.zero;
    this.background = new CanvasColorBackground("#46345E");
  }
  keyDown(e) {
  }
  build() {
    this.addChild(new SideCharacter({
      size3: v3(8, 24, 8),
      position3: v3(800, 0, 250)
    }));
    this.addChild(new GlMesh({ size3: v3(5e3, 100, 0), position3: v3(-2500, 0, 400), colors: [Colors.g] }));
    this.addChild(new GlMesh({ size3: v3(5e3, 5e3, 5e3), position3: v3(-2500, -1, -2500), colors: [[0.15, 0.15, 0.4, 1], [0.15, 0.15, 0.4, 1], [0.15, 0.15, 0.4, 1], [0.1, 0.2, 0.1, 1], [0.15, 0.15, 0.4, 1], [0.15, 0.15, 0.4, 1]] }));
    this.addChild(new GlMesh({ size3: v3(5e3, 0, 52), position3: v3(-2500, 0, 300), colors: [Colors.b] }));
    this.addChild(new GLobj({ url: "carriage.obj", size3: v3(100, 100, 100), position3: v3(0 + 50, 0, 300) }));
    this.addChild(new GLobj({ url: "carriage.obj", size3: v3(100, 100, 100), position3: v3(0 + 50 + 256, 0, 300) }));
    this.addChild(new GLobj({ url: "coal.obj", size3: v3(100, 100, 100), position3: v3(256 + 50 + 256, 0, 302) }));
    this.addChild(new GlMesh({ size3: v3(176, 65, 0), position3: v3(256 + 83 + 50 + 256, 0, 395), colors: [Colors.k], textureUrl: "test.png" }));
    this.addChild(new GLobj({ anchorPoint: v3(0, 0, 0), url: "loco.obj", size3: v3(100, 100, 100), position3: v3(256 + 83 + 50 + 256, 0, 300) }));
    this.camera.offset = v3(0, -5, 70);
    this.camera.rotation = v3(0.25, -Math.PI / 3, 0);
    this.camera.target = v3(150, 0, 250);
    this.camera.fov = 70;
  }
  tick(obj) {
    super.tick(obj);
  }
};

// ts/modes/side/SideMode.ts
var SideMode = class extends Mode {
  constructor() {
    super({ hasDom: true });
  }
  build() {
    super.build();
    this.addLevel("platform", new World());
    this.switchLevel("platform");
  }
};

// ts/game.ts
var Game = class extends CanvasWrapper {
  constructor() {
    super({ hasDom: true });
    this.relativity = "anchor";
    this.modes = {};
    this.game = this;
    this.readyToStart = false;
    this._waitCount = 0;
    this.started = false;
    this.total = 0;
    this.game = this;
    this.addEvent(new Event("resize"));
    window.addEventListener("resize", () => {
      this.resize();
    });
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
    this.loader = new Loader();
    this.addChild(this.loader);
    this.renderer = new DomCanvas(this);
    this.addChild(this.renderer);
    this.GLR = new GLR(this);
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
      if (key === s) {
        this.mode = mode;
      }
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
  const g = new Game();
  document.body.appendChild(g.dom.dom);
  g.dom.dom.appendChild(g.renderer.domGl);
});
//# sourceMappingURL=index.js.map
