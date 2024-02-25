// ts/utils/element.ts
var Element = class {
  constructor(attr = {}) {
    this.events = [];
  }
  addEvent(e) {
    this.events.push(e);
  }
  getEvent(id) {
    return this.events.find((e) => id === e.id);
  }
};

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
  static get zero() {
    return new _Vector2(0, 0);
  }
  static get down() {
    return new _Vector2(0, 1);
  }
  static get up() {
    return new _Vector2(0, -1);
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
    super(attr);
    this._visible = true;
    this.dom = document.createElement(type);
    this.dom.style.position = "absolute";
    this.id = attr.id || "";
    this.size = attr.size;
    this.background = attr.background || "";
    this.position = attr.position || Vector2.zero;
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this.dom.style.display = value ? "block" : "none";
    this._visible = value;
  }
  get position() {
    return this._position;
  }
  set position(value) {
    if (value && this.dom) {
      this.dom.style.left = value.x + "px";
      this.dom.style.top = value.y + "px";
    }
  }
  get id() {
    return this.dom.id;
  }
  set id(value) {
    if (value) {
      this.dom.id = value;
    }
  }
  get size() {
    return new Vector2(this.width, this.height);
  }
  set size(value) {
    if (value) {
      this.width = value.x;
      this.height = value.y;
    }
  }
  set background(v) {
    this.dom.style.background = v;
  }
  get width() {
    return this.dom.clientWidth;
  }
  set width(value) {
    this.dom.style.width = "".concat(value, "px");
    this.dom.setAttribute("width", String(value));
  }
  get height() {
    return this.dom.clientHeight;
  }
  set height(value) {
    this.dom.style.height = "".concat(value, "px");
    this.dom.setAttribute("height", String(value));
  }
  appendChild(e) {
    this.dom.appendChild(e.dom);
    this.dom.addEventListener;
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
    this.absolute = true;
    this.lastPosition = Vector2.zero;
    this.movedAmount = Vector2.zero;
    this.position = Vector2.zero;
    this.active = true;
    this.visible = true;
    this.lowerChildren = [];
    this.higherChildren = [];
    this.controllers = [];
    this.position = attr.position || Vector2.zero;
    this.addControllers(attr.controllers || []);
    if (attr.hasDom) {
      this.dom = new DomElement("div");
    }
  }
  addChild(child, above = false) {
    var _a, _b, _c, _d;
    if (child.parent === void 0) {
      (_a = child.parent) != null ? _a : child.parent = this;
      (_b = child.game) != null ? _b : child.game = this.game;
      (_c = child.mode) != null ? _c : child.mode = this.mode;
      (_d = child.level) != null ? _d : child.level = this.level;
      this[above ? "higherChildren" : "lowerChildren"].push(child);
      if (child.dom) {
        this.dom.appendChild(child.dom);
      }
      if (child.build) {
        child.build();
      }
      child.registerControllers(child);
    } else {
      console.log("The element is already a parent of another element.");
    }
  }
  addControllers(c) {
    this.controllers.push(...c);
  }
  registerControllers(child) {
    child.controllers.forEach((controller) => {
      var _a, _b, _c, _d;
      if (controller.parent === void 0) {
        (_a = controller.parent) != null ? _a : controller.parent = child;
        (_b = controller.game) != null ? _b : controller.game = child.game;
        (_c = controller.mode) != null ? _c : controller.mode = child.mode;
        (_d = controller.level) != null ? _d : controller.level = child.level;
      }
    });
  }
  tick(obj) {
    if (this.active) {
      this.movedAmount = this.lastPosition.subtract(this.position);
      this.lastPosition = this.position;
      this.controllers.forEach((c) => c.tick(obj));
      this.lowerChildren.forEach((c) => c.tick(obj));
      this.higherChildren.forEach((c) => c.tick(obj));
    }
  }
};

// ts/canvas/canvasWrapper.ts
var CanvasWrapper = class extends CanvasElement {
  constructor(attr = {}) {
    super(attr);
    this.type = "wrapper";
  }
  render(c) {
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
    this.size = attr.size;
  }
  get size() {
    return this._size;
  }
  set size(value) {
    if (value) {
      this._size = value;
    }
  }
  get width() {
    return this._size.x;
  }
  set width(value) {
    this._size.x = value;
  }
  get height() {
    return this._size.y;
  }
  set height(value) {
    this._size.y = value;
  }
  render(ctx) {
    ctx.fillStyle = this.getColor();
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
  getLiniarGradient() {
    if (this.linearGradient) {
      const grd = this.game.renderer.ctx.createLinearGradient(this.position.x, this.position.y, this.position.x + this.width, this.position.y + this.height);
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

// ts/utils/renderer.ts
var Renderer = class extends CanvasWrapper {
  constructor() {
    super({ hasDom: true });
    this.hasDom = true;
  }
  build() {
    this.canvas = new DomElement("canvas");
    this.canvas.dom.tabIndex = 1;
    this.blockRight = new CanvasSquare({
      position: new Vector2(0, 0),
      size: new Vector2(20, 20),
      color: "black"
    });
    this.addChild(this.blockRight, true);
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      this.canvas.size = size;
    });
    this.game.resize();
    this.ctx = this.canvas.dom.getContext("2d");
    this.dom.appendChild(this.canvas);
  }
  tick(obj) {
    super.tick(obj);
    this.recursive(this);
  }
  recursive(element) {
    if (element.active && element.visible) {
      element.lowerChildren.forEach((child) => this.recursive(child));
      this.renderAll(element);
      element.higherChildren.forEach((child) => this.recursive(child));
    }
  }
  renderAll(c) {
    var _a;
    const activeLevel = Object.values((_a = Object.values(this.game.modes).find((mode) => mode.active)) == null ? void 0 : _a.levels).find((level) => level.active);
    if (activeLevel.width < this.canvas.width) {
      this.blockRight.visible = true;
      this.blockRight.position = new Vector2(activeLevel.width, 0);
      this.blockRight.size = new Vector2(this.canvas.width - activeLevel.width, this.canvas.height);
    } else {
      this.blockRight.visible = false;
    }
    c.render(this.ctx);
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
  constructor(attr = {}) {
    super(attr);
    this.levels = {};
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
    this.mode = this;
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
      this.size = this.level.size;
    });
  }
};

// ts/utils/level.ts
var Level = class extends CanvasWrapper {
  constructor(attr = {}) {
    super(attr);
    this.ready = false;
    this.level = this;
  }
  get size() {
    return new Vector2(this.width, this.height);
  }
  set size(value) {
    this.width = value.x;
    this.height = value.y;
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
  render(ctx) {
    ctx.fillStyle = this.getColor();
    ctx.beginPath();
    ctx.ellipse(this.position.x, this.position.y, this.radius, this.radiusY, this.angle, 0, 2 * Math.PI, false);
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
      const grd = this.game.renderer.ctx.createLinearGradient(this.position.x - this.radius, this.position.y - this.radiusY, this.position.x + this.radius, this.position.y + this.radiusY);
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
        this.position.x + this.radialGradient.offset.x,
        this.position.y + this.radialGradient.offset.y,
        0,
        this.position.x,
        this.position.y,
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

// ts/modes/swapper/character/parts/eye.ts
var Eye = class extends CanvasCircle {
  constructor(offset, size = 65) {
    super({
      radialGradient: {
        stops: [[0, "#555555"], [0.5, "black"], [0.5, "white"], [1, "grey"]]
      },
      // strokeWidth: 5,
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
      -this.radius * Math.max(Math.min(this.movedAmount.x / obj.interval, 0.5), -0.5),
      -this.radiusY * Math.max(Math.min(this.movedAmount.y / obj.interval, 0.6), -0.6)
    );
    this.position = this.parent.position.add(this.offset);
  }
};

// ts/modes/swapper/character/parts/tail.ts
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
    const h = lin * 360;
    const s = {
      rainbow: [
        [0.1, "hsla(".concat(h, ",0%,0%,").concat(100, "%)")],
        [0.68, "hsla(".concat(h, ",100%,50%,").concat(100, "%)")]
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
    s.push(
      [0.68, "black"],
      [0.7 + (1 - lin) * 0.06, "black"],
      [0.7 + (1 - lin) * 0.06, "#00000011"],
      [1, "#00000000"]
    );
    this.radialGradient = {
      stops: s,
      offset: new Vector2(10 * lin, 10 * lin)
    };
  }
};

// ts/modes/swapper/character/snake.ts
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
    this.strokeWidth = 3;
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
  constructor(attr = {}) {
    super(attr);
    this.type = "logic";
  }
  render(c) {
  }
  mouseMove(e) {
  }
  keyDown(e) {
  }
  keyUp(e) {
  }
};

// ts/controllers/bounce.ts
var Bounce = class extends CanvasController {
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

// ts/modes/swapper/levels/bouncingSnake.ts
var BouncerLevel = class extends Level {
  constructor() {
    super(...arguments);
    this.start = new Vector2(300, 400);
    this.background = new CanvasColorBackground("black");
    this.height = 1145;
    this.width = 2e3;
  }
  build() {
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      this.width = size.x;
      this.height = size.y;
    });
    this.addChild(this.background);
    this.addChild(new Snake({ position: this.start, totals: 50, distance: 6, colors: "rainbow", controllers: [new Bounce(120)] }));
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

// ts/controllers/random.ts
var Random = class extends CanvasController {
  constructor(radius, direction = Vector2.up) {
    super();
    this.speed = new Vector2(7, 7);
    this.direction = Vector2.up;
    this.steering = Math.random();
    this.maxSteering = 5;
    this.radius = radius;
    this.direction = direction;
  }
  tick(obj) {
    super.tick(obj);
    this.steering = Math.max(Math.min(this.steering + (Math.random() * 2 - 1) / 5, this.maxSteering), -this.maxSteering);
    this.direction = this.direction.rotate(this.steering / 200);
    this.parent.position = this.parent.position.add(this.speed.multiply(this.direction).scale(obj.interval / 10));
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

// ts/modes/swapper/levels/discoSnake.ts
var DiscoLevel = class extends Level {
  constructor() {
    super(...arguments);
    this.start = new Vector2(300, 400);
    this.background = new CanvasRadialGradientBackground({
      stops: [[0, "purple"], [1, "pink"]]
    });
    this.height = 1145;
    this.width = 2e3;
  }
  build() {
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      this.width = size.x;
      this.height = size.y;
    });
    this.addChild(this.background);
    this.addChild(new Snake({
      totals: 30,
      distance: 1,
      topRadius: 50,
      bottomRadius: 1,
      position: new Vector2(0 - 150, 200),
      controllers: [new Random(200, Vector2.left)]
    }));
    this.addChild(new Snake({
      totals: 50,
      distance: 4,
      position: new Vector2(0 - 150, 200),
      controllers: [new Random(200, Vector2.right)]
    }));
    this.addChild(new Snake({
      totals: 50,
      distance: 4,
      position: new Vector2(this.width + 150, 950),
      colors: "green",
      controllers: [new Random(100, Vector2.left)]
    }));
  }
};

// ts/modes/swapper/levels/empty.ts
var Empty = class extends Level {
  constructor() {
    super(...arguments);
    this.start = new Vector2(300, 400);
    this.background = new CanvasColorBackground("darkblue");
    this.height = 1145;
    this.width = 1594;
  }
  build() {
    this.addChild(this.background);
  }
};

// ts/controllers/followMouse.ts
var FollowMouse = class extends CanvasController {
  constructor(direction = Vector2.up) {
    super();
    this.speed = new Vector2(6, 6);
    this.direction = Vector2.right;
    this.direction = direction;
  }
  tick(obj) {
    super.tick(obj);
    if (this.target) {
      const d = this.target.subtract(this.parent.position).angle() + Math.PI - this.direction.angle();
      if (d > Math.PI || d < 0) {
        this.direction = this.direction.rotate(Math.PI / 120);
      } else {
        this.direction = this.direction.rotate(-Math.PI / 120);
      }
      this.parent.position = this.parent.position.add(this.direction.multiply(this.speed).scale(obj.interval / 10));
    }
  }
  mouseMove(e) {
    super.mouseMove(e);
    this.target = new Vector2(e.clientX, e.clientY);
  }
};

// ts/modes/swapper/levels/followMouse.ts
var FollowLevel = class extends Level {
  constructor() {
    super(...arguments);
    this.start = new Vector2(300, 400);
    this.background = new CanvasRadialGradientBackground({
      stops: [[0, "red"], [1, "blue"]]
    });
    this.height = 1145;
    this.width = 2e3;
  }
  build() {
    this.game.getEvent("resize").subscribe(String(Math.random()), (size) => {
      this.width = size.x;
      this.height = size.y;
    });
    this.addChild(this.background);
    this.addChild(new Snake({ position: this.start, totals: 50, distance: 6, colors: "rainbow", controllers: [new FollowMouse()] }));
  }
};

// ts/modes/swapper/snakeMode.ts
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
    this.addLevel("disco", new DiscoLevel());
    this.addLevel("bounce", new BouncerLevel());
    this.addLevel("follow", new FollowLevel());
    this.addLevel("Empty", new Empty());
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
    this.canvas = game.renderer.canvas;
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvas.addEventListener("keydown", this.keyDown.bind(this));
    this.canvas.addEventListener("keyup", this.keyUp.bind(this));
  }
  mouseMove(e) {
    this.recursive("mouseMove", this.game.renderer, e);
  }
  keyDown(e) {
    this.recursive("keyDown", this.game.renderer, e);
  }
  keyUp(e) {
    this.recursive("keyUp", this.game.renderer, e);
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

// ts/canvas/canvasImage.ts
var CanvasImage = class extends CanvasElement {
  constructor(attr) {
    super(attr);
    this.type = "image";
    this.prepped = attr.image;
  }
  get width() {
    return this.prepped.size.x;
  }
  set width(value) {
    this.prepped.size.x = value;
  }
  get height() {
    return this.prepped.size.y;
  }
  set height(value) {
    this.prepped.size.y = value;
  }
  render(ctx) {
    if (this.prepped.ready) {
      ctx.drawImage(this.prepped.image, this.position.x, this.position.y, this.prepped.width, this.prepped.height);
    }
  }
};

// ts/canvas/prepImage.ts
var PreppedImage = class {
  constructor(attr) {
    this.ready = false;
    this.factor = attr.factor;
    this.original = new Image();
    this.original.src = attr.url;
    this.original.onload = () => {
      if (this.factor) {
        this.upScale();
      } else {
        this.loaded(this.original);
      }
    };
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
    const os = document.createElement("canvas");
    os.width = this.original.width;
    os.height = this.original.height;
    const osCTX = os.getContext("2d", { alpha: true });
    osCTX.drawImage(this.original, 0, 0, this.original.width, this.original.height);
    const ss = document.createElement("canvas");
    ss.width = this.factor * this.original.width;
    ss.height = this.factor * this.original.height;
    const ssCTX = ss.getContext("2d");
    for (let x = 0; x < this.original.width; x++) {
      for (let y = 0; y < this.original.height; y++) {
        const r = osCTX.getImageData(x, y, 1, 1).data.join(",");
        ssCTX.fillStyle = "rgba(".concat(r, ")");
        ssCTX.fillRect(
          x * this.factor,
          y * this.factor,
          this.factor,
          this.factor
        );
      }
    }
    const newI = new Image();
    newI.src = ss.toDataURL();
    newI.onload = () => {
      this.loaded(newI);
    };
  }
  loaded(i) {
    this.image = i;
    this.ready = true;
  }
};

// ts/canvas/canvasGrid.ts
var CanvasGrid = class _CanvasGrid extends CanvasElement {
  constructor(attr = {}) {
    super(attr);
    this.type = "logic";
    this.ready = false;
    this.sprites = {};
    this.width = attr.width || 10;
    this.height = attr.height || 10;
    this.factor = attr.factor || 10;
    this.json = attr.json;
    _CanvasGrid.loadJsonFile(this.json).then(this.jsonLoaded.bind(this));
  }
  get gridDimentsion() {
    return new Vector2(this.width, this.height);
  }
  set gridDimentsion(value) {
    this.width = value.x;
    this.height = value.y;
  }
  jsonLoaded({ sprites, tiles }) {
    sprites.forEach((sprite) => {
      if (tiles.find((tile) => sprite.name === tile.type)) {
        this.sprites[sprite.name] = new PreppedImage({
          url: sprite.url,
          factor: this.factor
        });
      }
    });
    tiles.forEach((sprite) => {
      this.addChild(new CanvasImage({
        position: new Vector2(
          sprite.x * this.factor * 16,
          (this.height - sprite.y) * this.factor * 16
        ),
        image: this.sprites[sprite.type]
      }));
    });
  }
  static async loadJsonFile(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  render(c) {
  }
};

// ts/modes/topdown/overworld.ts
var Overworld = class extends Level {
  constructor() {
    super(...arguments);
    this.zoom = 3;
    this.start = new Vector2(-100, -100);
    this.background = new CanvasColorBackground("#272727");
    this.height = 20 * this.zoom * 16;
    this.width = 20 * this.zoom * 16;
  }
  build() {
    this.addChild(this.background);
    this.addChild(new CanvasGrid({ json: "/json/overworld/terrain.json", width: 19, height: 19, factor: this.zoom }));
    this.addChild(new CanvasGrid({ json: "/json/overworld/Objects.json", width: 19, height: 19, factor: this.zoom }));
    this.addChild(new CanvasGrid({ json: "/json/overworld/decorations.json", width: 19, height: 19, factor: this.zoom }));
    this.addChild(new CanvasGrid({ json: "/json/overworld/overlay.json", width: 19, height: 19, factor: this.zoom }));
    this.addChild(new Snake({
      position: this.start,
      totals: 30,
      distance: 6,
      topRadius: 100,
      bottomRadius: 4,
      colors: "green",
      controllers: [new Random(100, Vector2.down)]
    }));
  }
};

// ts/modes/topdown/topdown.ts
var Topdown = class extends Mode {
  constructor() {
    super({ hasDom: true });
  }
  build() {
    this.addLevel("overworld", new Overworld());
    this.switchLevel("overworld");
  }
  tick(obj) {
    super.tick(obj);
  }
};

// ts/game.ts
var Game = class extends CanvasWrapper {
  constructor() {
    super({ hasDom: true });
    this.modes = {};
    this.game = this;
    this.hasDom = true;
    this.game = this;
    this.addEvent(new Event("resize"));
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.build();
    this.resize();
  }
  build() {
    this.renderer = new Renderer();
    this.addChild(this.renderer);
    this.setupModes();
    this.ticker = new Ticker();
    this.ticker.add(this.tick.bind(this));
    this.input = new Input(this);
    this.debug();
    this.start();
    this.resize();
  }
  setupModes() {
    this.addMode("snakes", new SnakeMode());
    this.addMode("topdown", new Topdown());
    this.dom.appendChild(new DomButton({
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
        this.switchMode("topdown");
      }
    }));
    this.dom.appendChild(new DomButton({
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
    this.switchMode("snakes");
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
    this.renderer.addChild(mode);
  }
  switchMode(s) {
    Object.entries(this.modes).forEach(([key, mode]) => {
      mode.active = key === s;
      mode.visible = key === s;
      mode.dom ? mode.dom.visible = key === s : null;
    });
  }
  start() {
    this.ticker.start();
  }
};

// ts/index.ts
document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new Game().dom.dom);
  ;
});
//# sourceMappingURL=index.js.map
