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

// ts/classes/element.ts
var Element = class {
  constructor() {
    this.events = [];
  }
  get t() {
    return this.game.t;
  }
  get game() {
    return glob.game;
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

// ts/classes/dom/domElement.ts
var DomElement = class extends Element {
  constructor(type, attr = {}) {
    super();
    this.children = [];
    this.rendererType = "dom";
    this._position = v2(0);
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
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
    this.x = value.x;
    this.y = value.y;
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

// ts/classes/dom/domText.ts
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
    this.dom.style.whiteSpace = "pre-line";
  }
};

// ts/classes/debug/fps.ts
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

// ts/classes/debug/loader.ts
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

// ts/classes/event.ts
var Events = class {
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

// ts/classes/dom/renderer.ts
var Renderer = class extends DomElement {
  constructor() {
    super("canvas");
    this.dom.style.position = "absolute";
    this.dom.style.pointerEvents = "all";
    this.dom.style.bottom = "0px";
    this.dom.style.touchAction = "none";
    this.dom.tabIndex = 1;
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.addEvent(new Events("resize"));
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

// ts/classes/input/gamepad.ts
var Pad = class {
  constructor(gamepad) {
    this.gamepad = gamepad;
  }
  tick() {
    this.recentPad = navigator.getGamepads().find((g) => g.id === this.gamepad.id);
  }
};

// ts/classes/input/gamepadManager.ts
var PadManager = class {
  constructor() {
    this.pads = {};
    window.addEventListener("gamepadconnected", this.connect.bind(this));
    window.addEventListener("gamepaddisconnected", this.disconnect.bind(this));
  }
  connect(e) {
    this.pads[e.gamepad.id] = new Pad(e.gamepad);
  }
  disconnect(e) {
    delete this.pads[e.gamepad.id];
  }
  tick() {
    Object.values(this.pads).forEach((pad) => {
      pad.tick();
    });
  }
};

// ts/classes/input/inputDevices.ts
var Keyboard = class {
  constructor() {
    this.keyDown = {};
    this.keyUp = {};
  }
  ready() {
    glob.renderer.dom.addEventListener("keydown", (e) => {
      var _a;
      const k = e.key.toLowerCase();
      (_a = this.keyDown[k]) == null ? void 0 : _a.forEach((c) => {
        c();
      });
    });
    glob.renderer.dom.addEventListener("keyup", (e) => {
      var _a;
      const k = e.key.toLowerCase();
      (_a = this.keyUp[k]) == null ? void 0 : _a.forEach((c) => {
        c();
      });
    });
  }
  register(key, down, up) {
    const k = key.toLowerCase();
    if (this.keyDown[k])
      this.keyDown[k].push(down);
    else
      this.keyDown[k] = [down];
    if (this.keyUp[k])
      this.keyUp[k].push(up);
    else
      this.keyUp[k] = [up];
  }
};
var InputDevices = class {
  constructor() {
    this.keyboard = new Keyboard();
    this.overlay = new DomText({
      text: "Pauzed"
    });
    this.overlay.dom.setAttribute(
      "style",
      "\n            transform-origin: left bottom;\n            pointer-events: none;\n            bottom: 0px;\n            left: 0px;\n            user-select: none;\n            z-index: 999;\n            position: absolute;\n            height: 100vh;\n            width: 100vw;\n            color: white !important;\n            font-family: monospace;\n            font-weight: bold;\n            font-size: 40px;\n            padding-left: 50px;\n            padding-top: 20px;\n            box-sizing: border-box;\n            text-transform: uppercase;"
    );
  }
  get locked() {
    return this._locked;
  }
  set locked(value) {
    this._locked = value;
    this.overlay.dom.style.display = !value ? "block" : "none";
  }
  ready() {
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    this.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (this.mobile) {
      this.locked = true;
    } else {
      glob.level.interface.touchControls.style.display = "none";
      glob.renderer.dom.addEventListener("click", (e) => {
        if (!this.locked) {
          glob.renderer.dom.requestPointerLock();
        }
      });
      document.addEventListener("pointerlockchange", () => {
        this.locked = document.pointerLockElement === glob.renderer.dom;
      });
      document.body.appendChild(this.overlay.dom);
    }
    this.keyboard.ready();
  }
};

// ts/classes/shaders/vertexShaderDir.ts
var vertexShaderDir_default = "\nattribute vec4 o_a_position;\nattribute vec3 o_a_normal;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nattribute vec2 aTextureCoord;\nuniform mat4 uNormalMatrix;\nattribute vec3 aVertexNormal;\n\nuniform vec3 o_u_lightWorldPosition;\nuniform vec3 o_u_viewWorldPosition;\n\nuniform mat4 o_u_world;\nuniform mat4 o_u_worldViewProjection;\nuniform mat4 o_u_worldInverseTranspose;\n\nvarying vec3 o_v_normal;\n\nvarying vec3 o_v_surfaceToLight;\nvarying vec3 o_v_surfaceToView;\n\nvarying highp vec2 vTextureCoord;\n\nvoid main() {\n  gl_Position = uProjectionMatrix * uModelViewMatrix * o_a_position;\n  vTextureCoord = aTextureCoord;\n\n  o_v_normal = (uNormalMatrix * vec4(aVertexNormal, 1.0)).xyz;\n  vec3 surfaceWorldPosition = (uModelViewMatrix * o_a_position).xyz;\n  o_v_surfaceToLight = o_u_lightWorldPosition - surfaceWorldPosition;\n  o_v_surfaceToView = normalize(o_u_viewWorldPosition - surfaceWorldPosition);\n}";

// ts/classes/shaders/fragmentShaderDir.ts
var fragmentShaderDir_default = "\nprecision highp float;\n\nvarying vec3 o_v_normal;\nvarying vec3 o_v_surfaceToLight;\nvarying vec3 o_v_surfaceToView;\nvarying highp vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nuniform float o_u_shininess;\nuniform vec3 o_u_lightColor;\nuniform vec3 o_u_specularColor;\nuniform vec3 o_u_lightDirection;\nuniform float o_u_innerLimit;  \nuniform float o_u_outerLimit;  \nuniform float o_u_innerRange;  \nuniform float o_u_outerRange;  \nuniform int o_u_ignoreLighting;  \n\nvoid main() {\n  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);\n\n  vec3 normal = normalize(o_v_normal);\n\n  vec3 surfaceToLightDirection = normalize(o_v_surfaceToLight);\n  vec3 surfaceToViewDirection = normalize(o_v_surfaceToView);\n  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);\n\n  float dotFromDirection = dot(surfaceToLightDirection,-o_u_lightDirection);\n\n  float rangeLight = smoothstep(o_u_outerRange, o_u_innerRange, length(o_v_surfaceToLight));\n  float inLight = smoothstep(o_u_outerLimit, o_u_innerLimit, dotFromDirection);\n  float light = 0.2 + rangeLight*inLight*dot(normal, surfaceToLightDirection);\n  float specular = rangeLight*(inLight*pow(dot(normal, halfVector), o_u_shininess));\n  gl_FragColor = texelColor;\n  if (o_u_ignoreLighting == 0){\n    gl_FragColor.rgb *= light * o_u_lightColor;\n    gl_FragColor.rgb += specular * o_u_specularColor;\n  }\n}\n";

// ts/classes/rendering/glrInit.ts
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
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderDir_default);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderDir_default);
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
      },
      "o_u_worldViewProjection": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_worldViewProjection"),
        type: "matrix4"
      },
      "o_u_worldInverseTranspose": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_worldInverseTranspose"),
        type: "matrix4"
      },
      "o_u_lightColor": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_lightColor"),
        type: "vector3"
      },
      "o_u_specularColor": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_specularColor"),
        type: "vector3"
      },
      "o_u_shininess": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_shininess"),
        type: "float"
      },
      "o_u_lightWorldPosition": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_lightWorldPosition"),
        type: "vector3"
      },
      "o_u_viewWorldPosition": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_viewWorldPosition"),
        type: "vector3"
      },
      "o_u_world": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_world"),
        type: "matrix4"
      },
      "o_u_lightDirection": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_lightDirection"),
        type: "vector3"
      },
      "o_u_innerLimit": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_innerLimit"),
        type: "float"
      },
      "o_u_outerLimit": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_outerLimit"),
        type: "float"
      },
      "o_u_innerRange": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_innerRange"),
        type: "float"
      },
      "o_u_outerRange": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_outerRange"),
        type: "float"
      },
      "o_u_ignoreLighting": {
        pointer: gl.getUniformLocation(shaderProgram, "o_u_ignoreLighting"),
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
      },
      "o_a_position": {
        pointer: gl.getAttribLocation(shaderProgram, "o_a_position"),
        count: 3
      },
      "o_a_normal": {
        pointer: gl.getAttribLocation(shaderProgram, "o_a_normal"),
        count: 3
      }
    }
  ];
}

// ts/classes/rendering/glTranslator.ts
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
      if (un.type === "vector2")
        this.sendVector2(un.pointer, data);
      if (un.type === "vector3")
        this.sendVector3(un.pointer, data);
      if (un.type === "vector4")
        this.sendVector4(un.pointer, data);
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
  sendVector2(pointer, data) {
    this.gl.uniform2fv(
      pointer,
      data
    );
  }
  sendVector3(pointer, data) {
    this.gl.uniform3fv(
      pointer,
      data
    );
  }
  sendVector4(pointer, data) {
    this.gl.uniform4fv(
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

// ts/classes/util/utils.ts
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
};

// ts/classes/math/matrix4.ts
function m4() {
  return Matrix4.f();
}
var Matrix4 = class _Matrix4 {
  constructor(source) {
    this.mat4 = source ? mat4_exports.clone(source) : mat4_exports.create();
    return this;
  }
  static f() {
    return new _Matrix4();
  }
  add(mat) {
    mat4_exports.add(
      this.mat4,
      this.mat4,
      mat.mat4
    );
    return this;
  }
  subtract(mat) {
    mat4_exports.subtract(
      this.mat4,
      this.mat4,
      mat.mat4
    );
    return this;
  }
  multiply(mat) {
    mat4_exports.multiply(
      this.mat4,
      this.mat4,
      mat.mat4
    );
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
  invert() {
    mat4_exports.invert(
      this.mat4,
      this.mat4
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
  static lookAt(camera, target) {
    let matrix = m4();
    mat4_exports.lookAt(
      matrix.mat4,
      camera.vec,
      target.vec,
      v3(0, 1, 0).vec
    );
    return matrix;
  }
  get position() {
    return v3(this.mat4[12], this.mat4[13], this.mat4[14]);
  }
};

// ts/classes/rendering/glRenderer.ts
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
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  getProjection() {
    return new Matrix4().perspective(
      this.game.mode.camera.fov * Math.PI / 180,
      1,
      2e4
    ).translate(this.game.mode.camera.offset.multiply(1, 1, -1)).rotate(this.game.mode.camera.rotation).translate(this.game.mode.camera.target.multiply(-1, -1, 1));
  }
  draw() {
    this.clear();
    this.gl.useProgram(this.glt.program);
    const camera = m4().translate(this.game.mode.camera.offset.multiply(1, 1, -1)).rotate(this.game.mode.camera.rotation).translate(this.game.mode.camera.target.multiply(-1, -1, 1));
    this.glt.sendUniform("uSampler", 0);
    this.glt.sendUniform("uProjectionMatrix", this.getProjection().mat4);
    this.glt.sendUniform("o_u_viewWorldPosition", camera.invert().position.vec);
    const light = this.game.level.lights[0];
    this.glt.sendUniform("o_u_lightDirection", light.direction.vec);
    this.glt.sendUniform("o_u_innerLimit", Math.cos(Util.degToRad(light.limit[0])));
    this.glt.sendUniform("o_u_outerLimit", Math.cos(Util.degToRad(light.limit[1])));
    this.glt.sendUniform("o_u_innerRange", light.range[0]);
    this.glt.sendUniform("o_u_outerRange", light.range[1]);
    this.glt.sendUniform("o_u_lightColor", light.color.slice(0, 3));
    this.glt.sendUniform("o_u_specularColor", light.specular.slice(0, 3));
    this.glt.sendUniform("o_u_lightWorldPosition", light.globalPosition.multiply(1, 1, -1).vec);
    this.drawChildren(this.game.level);
  }
  drawChildren(element) {
    element.children.forEach((o) => {
      this.drawObject(o);
    });
  }
  drawObject(mesh) {
    if (mesh.visible) {
      if (mesh.buffer) {
        this.renderMesh(mesh, mesh.globalMatrix);
      }
      this.drawChildren(mesh);
    }
  }
  renderMesh(mesh, currentModelview) {
    this.glt.sendBuffer(mesh.buffer.indices, "element");
    this.glt.sendAttribute("aVertexNormal", mesh.buffer.normalBuffer);
    this.glt.sendUniform("uModelViewMatrix", currentModelview.mat4);
    this.glt.sendUniform("uNormalMatrix", currentModelview.invert().transpose().mat4);
    this.glt.sendAttribute("aTextureCoord", mesh.buffer.textureCoord);
    this.glt.sendTexture(mesh.texture.texture);
    const projectionMatrix = this.getProjection();
    const cameraMatrix = m4();
    const viewMatrix = cameraMatrix.invert();
    const viewProjectionMatrix = projectionMatrix.multiply(viewMatrix);
    const worldViewProjectionMatrix = viewProjectionMatrix.multiply(currentModelview);
    const worldInverseMatrix = currentModelview.invert();
    const worldInverseTransposeMatrix = worldInverseMatrix.transpose();
    this.glt.sendUniform("o_u_worldViewProjection", worldViewProjectionMatrix.mat4);
    this.glt.sendUniform("o_u_worldInverseTranspose", worldInverseTransposeMatrix.mat4);
    this.glt.sendUniform("o_u_shininess", 600);
    this.glt.sendUniform("o_u_ignoreLighting", Number(mesh.ignoreLighting));
    this.glt.sendAttribute("o_a_position", mesh.buffer.positionBuffer);
    this.glt.sendUniform("o_u_world", currentModelview.mat4);
    this.glt.drawElements(mesh.verticesCount);
  }
};

// ts/classes/ticker.ts
var Ticker = class {
  constructor() {
    this._running = false;
    this.started = false;
    this.pauzedTime = 0;
    this.intervalKeeper = [];
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
  averagedInterval(count, interval) {
    const average = this.intervalKeeper.slice(0, count).reduce((partialSum, a) => partialSum + a, 0) / count;
    return Math.abs(interval - average) > 10 ? interval : average;
  }
  frame(timeStamp) {
    if (this.running) {
      const interval = timeStamp - this.pTime;
      this.intervalKeeper.push(interval);
      this.intervalKeeper = this.intervalKeeper.slice(0, 20);
      while (this.intervalKeeper.length < 20) {
        this.intervalKeeper.push(this.intervalKeeper[0]);
      }
      this.pTime = timeStamp;
      this.frameN++;
      const o = {
        interval,
        total: this.eTime,
        frameRate: 1e3 / interval,
        frame: this.frameN,
        intervalS3: this.averagedInterval(3, interval),
        intervalS10: this.averagedInterval(5, interval),
        intervalS20: this.averagedInterval(20, interval)
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

// ts/classes/elementBase.ts
var GlElement = class _GlElement extends Element {
  constructor(attr = {}) {
    var _a;
    super();
    this.rendererType = "gl";
    this.zones = [];
    this._position = v3(0);
    this._size = v3(0);
    this._rotation = v3(0);
    this._active = true;
    this._visible = true;
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
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
  }
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = value;
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    this._rotation = value;
  }
  get localMatrix() {
    return new Matrix4().translate((this.position || v3(0)).multiply(new Vector3(1, 1, -1))).translate((this.anchorPoint || v3(0)).multiply(1, 1, -1)).rotate((this.rotation || v3(0)).multiply(new Vector3(1, -1, -1))).translate((this.anchorPoint || v3(0)).multiply(-1, -1, 1));
  }
  get globalMatrix() {
    var _a;
    return (((_a = this.parent) == null ? void 0 : _a.globalMatrix) || new Matrix4()).multiply(this.localMatrix);
  }
  get globalPosition() {
    return this.globalMatrix.position.multiply(v3(1, 1, -1));
  }
  get worldRotation() {
    var _a;
    return (((_a = this.parent) == null ? void 0 : _a.worldRotation) || v3()).add(this.rotation);
  }
  get screenPosition() {
    return v2(0);
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
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
  get axis() {
    return this.level.inputMap.axis.bind(this.level.inputMap);
  }
  get button() {
    return this.level.inputMap.button.bind(this.level.inputMap);
  }
  ready() {
    this.build();
  }
  addChild(child) {
    var _a;
    (_a = child.parent) != null ? _a : child.parent = this;
    this.children.push(child);
    if (child.autoReady) {
      child.ready();
    }
    _GlElement.registerControllers(child);
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
      var _a;
      if (controller.parent === void 0) {
        (_a = controller.parent) != null ? _a : controller.parent = child;
        controller.build();
        if (controller.type === "collider" && controller.level) {
          child.level.addZone(controller);
          child.zones.push(controller);
        }
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

// ts/classes/group.ts
var GLGroup = class extends GlElement {
  constructor() {
    super(...arguments);
    this.type = "group";
  }
  get ani() {
    return this.skeleton.animator;
  }
};

// ts/classes/objStorage.ts
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

// ts/classes/mode.ts
var Mode = class extends GLGroup {
  constructor(attr = {}) {
    super(attr);
    this.levels = {};
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
    document.body.appendChild(level.interface.dom);
  }
  switchLevel(s) {
    Object.entries(this.levels).forEach(([key, level]) => {
      level.active = key === s;
    });
  }
  tick(obj) {
    super.tick(obj);
    this.controllers.filter((child) => child.active).forEach((c) => c.tick(obj));
    this.children.filter((child) => child.active).forEach((c) => c.tick(obj));
  }
};

// ts/classes/controller.ts
var GlController = class extends GlElement {
  constructor() {
    super(...arguments);
    this.type = "controller";
    this.order = "before";
  }
};

// ts/classes/zone.ts
var Zone = class extends GlController {
  constructor(attr) {
    super(attr);
    this.type = "collider";
    this.overlaps = [];
    this.fixed = Boolean(attr.fixed);
    this.absoluteOffset = attr.absoluteOffset || v3();
  }
  get globalPosition() {
    return super.globalPosition.add(this.absoluteOffset);
  }
  calculateOverlaps() {
    this.overlaps = this.level.levelZones.filter(this.overlap.bind(this)) || [];
  }
  overlap(othr) {
    if (this === othr)
      return false;
    if (this.fixed)
      return false;
    if (this.globalPosition.x + this.size.x < othr.globalPosition.x)
      return false;
    if (this.globalPosition.x > othr.globalPosition.x + othr.size.x)
      return false;
    if (this.globalPosition.y + this.size.y < othr.globalPosition.y)
      return false;
    if (this.globalPosition.y > othr.globalPosition.y + othr.size.y)
      return false;
    if (this.globalPosition.z + this.size.z < othr.globalPosition.z)
      return false;
    if (this.globalPosition.z > othr.globalPosition.z + othr.size.z)
      return false;
    return true;
  }
};

// ts/classes/collider.ts
var Collider = class extends Zone {
  constructor() {
    super(...arguments);
    this.zoneType = "collider";
  }
  calculateCollision() {
    this.calculateOverlaps();
    return this.overlaps.filter((o) => o.zoneType === "collider").map(this.calculateExitVelocity.bind(this)) || [];
  }
  calculateExitVelocity(othr) {
    return Util.closestVectorMagniture([
      v3(-(this.globalPosition.x + this.size.x - othr.globalPosition.x), 0, 0),
      // to the x- of other
      v3(othr.globalPosition.x + othr.size.x - this.globalPosition.x, 0, 0),
      // to the x+ of other
      v3(0, -(this.globalPosition.y + this.size.y - othr.globalPosition.y), 0),
      // to the y- of other
      v3(0, othr.globalPosition.y + othr.size.y - this.globalPosition.y, 0),
      // to the y+ of other
      v3(0, 0, -(this.globalPosition.z + this.size.z - othr.globalPosition.z)),
      // to the z- of other
      v3(0, 0, othr.globalPosition.z + othr.size.z - this.globalPosition.z)
      // to the z+ of other
    ], 0);
  }
};

// ts/classes/input/input.ts
var InputReader = class {
  tick() {
  }
};
var Input = class {
  constructor(readers) {
    this.readers = readers;
  }
  tick() {
    this.readers.forEach((r) => {
      r.tick();
    });
  }
};
var JoyStick = class extends Input {
  get value() {
    let total = v2(0);
    this.readers.forEach((r) => {
      total = total.add(r.value);
    });
    return total;
  }
};
var Button = class extends Input {
  get value() {
    let total = 0;
    this.readers.forEach((r) => {
      total += r.value;
    });
    return total;
  }
};
var InputMap = class {
  constructor(joysticks = {}, buttons = {}) {
    this.joysticks = {};
    this.buttons = {};
    Object.entries(joysticks).forEach(([key, readers]) => {
      this.joysticks[key] = new JoyStick(readers);
    });
    Object.entries(buttons).forEach(([key, readers]) => {
      this.buttons[key] = new Button(readers);
    });
  }
  tick() {
    Object.values(this.joysticks).forEach((j) => {
      j.tick();
    });
    Object.values(this.buttons).forEach((j) => {
      j.tick();
    });
  }
  axis(key) {
    return this.joysticks[key].value;
  }
  button(key) {
    return this.buttons[key].value;
  }
};

// ts/classes/input/mouseReader.ts
var MouseMoveReader = class extends InputReader {
  constructor() {
    super();
    this._delta = v2(0);
    if (!glob.mobile) {
      glob.renderer.dom.addEventListener("mousemove", (e) => {
        this._delta.x += e.movementX;
        this._delta.y += e.movementY;
      });
    }
  }
  get value() {
    return this._delta;
  }
  tick() {
    this._delta = v2(0);
  }
};
var MouseScrollReader = class extends InputReader {
  constructor() {
    super();
    this._delta = 0;
    if (!glob.mobile) {
      glob.renderer.dom.addEventListener("wheel", (e) => {
        this._delta += e.deltaY;
      });
    }
  }
  get value() {
    return this._delta;
  }
  tick() {
    this._delta = 0;
  }
};

// ts/classes/input/keyboardReader.ts
var KeyboardReader = class extends InputReader {
  constructor(key) {
    super();
    this._state = false;
    glob.device.keyboard.register(
      key,
      () => {
        this._state = true;
      },
      () => {
        this._state = false;
      }
    );
  }
  get value() {
    return Number(this._state);
  }
};
var KeyboardJoyStickReader = class extends InputReader {
  constructor(keys) {
    super();
    this._state = [[false, false], [false, false]];
    this._vector = v2(0);
    keys.forEach((k, i) => {
      glob.device.keyboard.register(
        k,
        () => {
          this._state[Math.floor(i / 2)][i % 2] = true;
          this.setVector();
        },
        () => {
          this._state[Math.floor(i / 2)][i % 2] = false;
          this.setVector();
        }
      );
    });
  }
  setVector() {
    this._vector = v2(
      -this._state[0][0] + +this._state[0][1],
      -this._state[1][0] + +this._state[1][1]
    );
  }
  get value() {
    return this._vector;
  }
};

// ts/classes/dom/UI.ts
var UI = class extends DomElement {
  constructor(attr = {}) {
    super("div", attr);
    this.dom.style.width = "100%";
    this.dom.style.height = "100%";
    this.dom.style.zIndex = "3";
    this.dom.style.pointerEvents = "none";
    this.touchControls = document.createElement("div");
    this.dom.appendChild(this.touchControls);
  }
};

// ts/classes/level.ts
var Level = class extends GlElement {
  constructor(attr = {}) {
    super(attr);
    this.type = "group";
    this.levelZones = [];
    this.lights = [];
    this.colliderMeshes = [];
    this.interface = new UI();
    this._camera = {
      target: Vector3.f(0),
      rotation: Vector3.f(0),
      offset: Vector3.f(0),
      fov: 60
    };
    this.size = this.size;
  }
  addUi(element) {
    this.interface.appendChild(element);
  }
  addZone(c) {
    this.levelZones.push(c);
  }
  addLight(c) {
    this.lights.push(c);
    this.addChild(c);
  }
  get camera() {
    return this._camera;
  }
  set camera(value) {
    this._camera = value;
  }
  build() {
    glob.game.active.level = this;
    this.interface.build();
  }
  tick(obj) {
    super.tick(obj);
    this.colliderMeshes.forEach((c, i) => {
      c.position = this.levelZones[i].globalPosition;
      c.size = this.levelZones[i].size.clone();
    });
  }
  afterTick(obj) {
    super.afterTick(obj);
    this.inputMap.tick();
  }
};

// ts/classes/util/colors.ts
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

// ts/classes/rendable.ts
var GLRendable = class extends GlElement {
  constructor(attr = {}) {
    super(attr);
    this.colorIntensity = 1;
    this.opacity = 1;
    this.colors = [];
    this.opacity = attr.opacity !== void 0 ? attr.opacity : 1;
    this.colorIntensity = attr.colorIntensity !== void 0 ? attr.colorIntensity : 1;
    this.ignoreLighting = attr.ignoreLighting !== void 0 ? attr.ignoreLighting : false;
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
  }
};

// ts/classes/texture.ts
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

// ts/classes/objects/cuboid.ts
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
  get size() {
    return super.size;
  }
  set size(value) {
    super.size = value;
    if (this.parent) {
      this.buffer.positionBuffer = this.GLT.createBuffer(this.positionBuffer(this.size));
    }
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

// ts/classes/light.ts
var Light = class extends GLGroup {
  get range() {
    return this._range;
  }
  set range(value) {
    this._range = [
      value[0],
      value[1] === void 0 || value[1] <= value[0] ? value[0] + 1 : value[1]
    ];
  }
  get limit() {
    return this._limit;
  }
  set limit(value) {
    this._limit = [
      value[0],
      value[1] === void 0 || value[1] <= value[0] ? value[0] + 1 : value[1]
    ];
  }
  constructor(attr) {
    super(attr);
    this.range = attr.range;
    this.limit = attr.limit;
    this.color = attr.color || Colors.w;
    this.specular = attr.specular;
    this.direction = attr.direction || Vector3.forwards;
  }
  build() {
    super.build();
    this.addChild(new GLCuboid({
      anchorPoint: v3(2.5, 2.5, 1),
      position: v3(-2.5, -2.5, 0),
      colors: [this.color, Colors.k, Colors.k, Colors.k, Colors.k, Colors.k],
      size: v3(5, 5, 1),
      rotation: v3(this.direction.y, this.direction.z, this.direction.x).scale(Math.PI),
      ignoreLighting: true
    }));
  }
};

// ts/classes/objects/obj.ts
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
    if (glob.storage.register(attr.url, this)) {
      this.loadFile("".concat(window.location.href, "/obj/").concat(attr.url)).then(this.parseMtl.bind(this)).then(this.parseObj.bind(this)).then(() => {
        this.ready();
        glob.storage.loaded(attr.url);
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

// ts/classes/character.ts
var Character = class extends GlElement {
  constructor(attr) {
    super(attr);
    this.type = "group";
    this.stat = {};
  }
  get ani() {
    return this.skeleton.animator;
  }
};

// ts/classes/util/ease.ts
var Ease = class {
  static linear(x) {
    return x;
  }
  static easeInQuad(x) {
    return x * x;
  }
  static easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
  }
  static easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }
  static easeInCubic(x) {
    return x * x * x;
  }
  static easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }
  static easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
  static easeInQuart(x) {
    return x * x * x * x;
  }
  static easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }
  static easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
  }
  static easeInQuint(x) {
    return x * x * x * x * x;
  }
  static easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
  }
  static easeInOutQuint(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }
  static easeInSine(x) {
    return 1 - Math.cos(x * Math.PI / 2);
  }
  static easeOutSine(x) {
    return Math.sin(x * Math.PI / 2);
  }
  static easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }
  static easeInExpo(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
  }
  static easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }
  static easeInOutExpo(x) {
    return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
  }
  static easeInCirc(x) {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
  }
  static easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  }
  static easeInOutCirc(x) {
    return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  }
  static easeInBack(x) {
    return 2.70158 * x * x * x - 1.70158 * x * x;
  }
  static easeOutBack(x) {
    return 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
  }
  static easeInOutBack(x) {
    return x < 0.5 ? Math.pow(2 * x, 2) * (7.18982 * x - 2.59491) / 2 : (Math.pow(2 * x - 2, 2) * (3.59491 * (x * 2 - 2) + 2.59491) + 2) / 2;
  }
};

// ts/classes/animation/animation.ts
var Animation = class {
  constructor(attr) {
    this.interval = 0;
    this.direction = 1;
    this.data = {};
    this._active = false;
    this.bones = attr.bones || {};
    this.time = attr.time || 0;
    this.loop = attr.loop || false;
    this.once = attr.once || false;
    this.dynamic = attr.dynamic || false;
    this.bounce = attr.bounce || false;
    this.defaultEase = attr.defaultEase || "linear";
    Object.entries(attr.data).forEach(([key, d]) => {
      if (d.length === 0) {
        d = [[0], [1]];
      }
      if (d[0][0] !== 0) {
        d.unshift([0, ...d[0].slice(1)]);
      }
      if (d[d.length - 1][0] !== 1) {
        d.push([1, ...d[d.length - 1].slice(1)]);
      }
      this.data[key] = d;
    });
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
  setTime(t) {
    const f = this.interval / this.time;
    this.time = t;
    this.interval = t * f;
  }
  setBoneTransform(key, transform) {
    const bone = this.bones[key];
    if (bone) {
      bone.setRotation(v3(transform[0] || 0, transform[1] || 0, transform[2] || 0), this.dynamic);
      bone.setPosition(v3(transform[3] || 0, transform[4] || 0, transform[5] || 0), this.dynamic);
    }
  }
  setBoneToValue(key, value) {
    if (this.data[key]) {
      let before = this.data[key][0];
      let after = this.data[key][this.data[key].length - 1];
      this.data[key].forEach((d) => {
        if (d[0] >= before[0] && d[0] <= value) {
          before = [d[0], Util.padArray(d[1] || [], 0, 7)];
        }
        if (d[0] <= after[0] && d[0] >= value) {
          after = [d[0], Util.padArray(d[1] || [], 0, 7)];
        }
      });
      const [[startNumber, start], [endNumber, end, ease]] = [before, after];
      const factor = Ease[ease || this.defaultEase]((value - startNumber) / (endNumber - startNumber));
      if (key === "bowS1") {
      }
      this.setBoneTransform(
        key,
        Util.addArrays(
          start || [],
          Util.scaleArrays(
            Util.subtractArrays(end || [], start || []),
            factor
          )
        )
      );
    }
  }
  setBonesToValue(n) {
    Object.keys(this.bones).forEach((b) => {
      this.setBoneToValue(b, n);
    });
  }
  stop() {
  }
  tick(interval) {
    if (this.active) {
      this.interval = this.interval + interval * this.direction;
      if (this.interval >= this.time) {
        if (this.bounce) {
          this.interval = this.time - 1;
          this.direction = -1;
        } else if (this.loop) {
          this.interval = this.interval % this.time;
        } else if (this.once) {
          this.interval = this.time - 1;
        } else {
          this.active = false;
          this.interval = 1;
          return;
        }
      }
      if (this.interval < 0) {
        if (this.loop) {
          this.interval = 0;
          this.direction = 1;
        } else {
          this.active = false;
          this.interval = 0;
          return;
        }
      }
      this.setBonesToValue(Util.clamp(this.interval / this.time, 1e-3, 0.999));
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
      bounce: attr.bounce || false,
      dynamic: attr.dynamic || false,
      defaultEase: attr.ease || "linear",
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
  setToInterval(key, n) {
    const an = this.get(key);
    if (an) {
      an.setBonesToValue(n * an.time);
    }
  }
  replay(key) {
    this.stop();
    Object.entries(this.animations).find((k) => k[0] === key)[1].active = true;
  }
  tick(interval) {
    Object.values(this.animations).forEach((a) => a.tick(interval));
  }
};

// ts/classes/animation/skeleton.ts
var Skeleton = class extends GLGroup {
  constructor(attr = {}) {
    super(attr);
    this.bones = {};
    this.parentage = {};
    attr.bones.forEach((o) => {
      this.addBone(o);
    });
  }
  addBone(o) {
    this.bones[o[0]] = o[1];
    if (o[2]) {
      this.parentage[o[0]] = o[2];
    }
    if (this.readyState) {
      if (this.parentage[o[0]]) {
        this.bones[this.parentage[o[0]]].addChild(o[1]);
      } else {
        this.addChild(o[1]);
      }
      this.animator.bones = this.bones;
    }
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
    this.animator.tick(obj.intervalS10);
  }
};

// ts/classes/animation/skeleton_bone.ts
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

// ts/modes/side/player/bow.ts
var BowActor = class extends GLGroup {
  get holding() {
    return this._holding;
  }
  set holding(value) {
    this._holding = value;
    this.backBow.active = !value;
    this.backBow.visible = !value;
    this.handBow.active = value;
    this.handBow.visible = value;
    this.backBow.tension = 0.999;
    this.handBow.tension = 0.999;
  }
  build() {
    super.build();
    this.handBow = new Bow({ parentBone: this.parent.skeleton.bones["lHand"], offsetR: v3(0, 0, 0.2) });
    this.addChild(this.handBow);
    this.backBow = new Bow({
      parentBone: this.parent.skeleton.bones["torso"],
      offsetP: v3(0, 6, -3),
      offsetR: v3(
        Math.PI / 2,
        0.5,
        Math.PI / 2 + 0.9
      )
    });
    this.addChild(this.backBow);
    this.holding = false;
  }
};
var Bow = class extends GlElement {
  constructor(attr) {
    super(attr);
    this.stat = {};
    this.parentBone = attr.parentBone;
    this.bowRig = new BowSkeleton(attr.offsetP, attr.offsetR);
  }
  get visible() {
    return super.visible;
  }
  set visible(value) {
    super.visible = value;
    this.bowRig.visible = value;
  }
  set tension(v) {
    this.bowRig.animator.setToInterval("tension", v);
  }
  build() {
    super.build();
    this.parentBone.addChild(this.bowRig);
    this.tension = 0.999;
  }
};
var BowSkeleton = class extends Skeleton {
  constructor(offsetP = v3(0), offsetR = v3(0)) {
    super({
      bones: [
        ["bow", new Bone({ profile: v2(1, 28), length: 6, position: v3(0, 0, 0), mesh: false }), ""],
        ["bowS1", new Bone({ profile: v2(1, 13), length: 1, position: v3(0, 5, -12), mesh: false }), "bow"],
        ["bowS2", new Bone({ profile: v2(1, 13), length: 1, position: v3(0, 5, 1), mesh: false }), "bow"]
      ]
    });
    this.offsetP = offsetP;
    this.offsetR = offsetR;
    this.rotation = offsetR;
    this.position = offsetP;
  }
  get visible() {
    return super.visible;
  }
  set visible(value) {
    super.visible = value;
    this.bones["bow"].visible = value;
  }
  build() {
    super.build();
    this.bones["bow"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-2-LongBow.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(0.5, 2.5, 1) }));
    this.bones["bowS1"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-0-BowRope.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(0.5, 0.5, 6.5) }));
    this.bones["bowS2"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-1-BowRope-1.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(0.5, 0.5, 6.5) }));
    this.animator.add("tension", 100, {
      bow: [[0, [0, 0, 0]], [1, [1, 1, 0]]],
      bowS1: [[0, [0, 0, 0]], [1, [1, 1, 1]]],
      bowS2: [[0, [0, 0, 0]], [1, [1, 1, 1]]]
    }, { loop: false, bounce: false, once: false, dynamic: false });
  }
};

// ts/modes/side/player/player_camera.ts
var FreeCamera = class extends GlController {
  constructor(target) {
    super({ autoReady: false });
    this.target = target;
    this.type = "controller";
    this.order = "after";
    this.lagList = [];
    this.lagCount = 1;
    this.zoom = 0;
    this.camera.offset = v3(0, -15, this.zoom);
    this.camera.rotation = v3(0.3, Math.PI / 8, 0);
    this.camera.fov = 60;
  }
  get active() {
    return super.active;
  }
  set active(value) {
    super.active = value;
    if (value) {
      this.camera.offset = v3(0, -15, this.zoom);
      this.camera.rotation = v3(0.3, Math.PI / 8, 0);
      this.camera.fov = 60;
    }
  }
  tick(o) {
    super.tick(o);
    if (glob.device.locked) {
      const r = this.axis("camera").scale(5e-3);
      this.camera.rotation = v3(
        Util.clamp(this.camera.rotation.x + r.y, -1, Math.PI / 2),
        this.camera.rotation.y + r.x,
        this.camera.rotation.z
      );
      this.zoom = Util.clamp(this.zoom + this.button("zoom") * 0.1, 30, 300);
      this.camera.offset = this.button("aim") ? v3(-15, -10, 30) : v3(0, -15, this.zoom);
      const nP = this.target.position.add(this.target.size.multiply(0.5, 0.3, 0.5));
      this.camera.target = nP;
    }
  }
};

// ts/modes/side/player/player_controller.ts
var PlayerController = class extends GlController {
  constructor() {
    super(...arguments);
    this.intr = { fall: 0, jump: 0, landDelay: 0 };
    this.stat = { jumping: false, falling: false, running: false };
    this.cnst = { runTime: 250, runSlowDownFactor: 0.7, runSpeed: 0.5, minJumpTime: 200, jumpTime: 300, jumpSpeed: 0.6 };
    this.velocity = Vector3.f(0);
  }
  get aiming() {
    return this.button("aim");
  }
  setMovementVelocity(interval) {
    const setter = (key, cond, interval2) => {
      this.intr[key] = Util.clamp((this.intr[key] || 0) + (cond ? interval2 : -(interval2 * this.cnst.runSlowDownFactor)), 0, this.cnst.runTime);
    };
    setter("right", this.axis("movement").x === 1, interval);
    setter("left", this.axis("movement").x === -1, interval);
    setter("up", this.axis("movement").y === 1, interval);
    setter("down", this.axis("movement").y === -1, interval);
    if (!this.aiming) {
      const plane = v2(
        (this.intr.right - this.intr.left) / this.cnst.runTime,
        (this.intr.up - this.intr.down) / this.cnst.runTime
      ).clampMagnitude(1).scale(this.cnst.runSpeed);
      this.velocity = v3(
        plane.x,
        0,
        plane.y
      );
    } else {
      this.velocity = v3(0);
    }
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
          this.parent.stat.jumping = Boolean(this.button("jump"));
        } else {
          this.parent.stat.jumping = false;
          this.parent.stat.falling = true;
          this.intr.jump = this.cnst.jumpTime;
        }
      } else {
        this.parent.stat.jumping = Boolean(this.button("jump"));
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
    this.setMovementVelocity(obj.intervalS10);
    this.setJumpVelocity(obj.intervalS10);
    const sc = this.velocity.scale(obj.intervalS10 / 6);
    if (sc.xz.magnitude() > 0) {
      const [x, z] = sc.xz.rotate(-this.camera.rotation.y).array;
      this.newPosition = this.parent.position.add(v3(x, sc.y, z));
      if (!this.axis("movement").isZero()) {
        this.parent.rotation = this.camera.rotation.multiply(0, 1, 0).add(v3(0, Math.PI / 2, 0)).add(v3(0, -sc.xz.angle(), 0));
      }
      this.parent.stat.running = true;
    } else {
      this.newPosition = this.parent.position.add(v3(0, sc.y, 0));
      this.parent.stat.running = false;
    }
    if (this.aiming) {
      this.parent.rotation = this.camera.rotation.multiply(0, 1, 0);
    }
  }
  collide(obj) {
    this.parent.stat.ground = false;
    const collisions = this.parent.zones[0].calculateCollision();
    collisions.forEach((v) => {
      if (v.y >= 0) {
        this.intr.fall = 0;
        this.intr.jump = 0;
        this.parent.stat.falling = false;
        this.parent.stat.ground = true;
      } else {
        this.parent.stat.falling = true;
        this.parent.stat.ground = false;
      }
      this.velocity.subtract(v);
      this.parent.position = this.newPosition.clone();
      this.newPosition = this.newPosition.add(v);
    });
    if (!this.parent.stat.jumping) {
      this.parent.stat.falling = !this.parent.stat.ground;
    }
  }
  tick(obj) {
    super.tick(obj);
    this.setVelocity(obj);
    this.collide(obj);
    this.parent.position = this.newPosition.clone();
  }
};

// ts/classes/animation/skeleton_human.ts
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

// ts/modes/side/player/player_skeleton.ts
var PlayerSkel = class extends HumanSkeleton {
  constructor() {
    super({
      "head": 6,
      "armUpper": 6,
      "armLower": 6,
      "hand": 0,
      "legUpper": 4,
      "legLower": 7,
      "foot": 1,
      "torso": 9,
      "hips": 3,
      "hipsWidth": 6,
      "shoulderWidth": 6
    });
  }
  build() {
    super.build();
    this.bones["head"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-15-Head-7.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(2, 3, 2) }));
    this.bones["torso"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-3-Spine3-2.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(this.sizes.shoulderWidth / 2, 5, 0) }));
    this.bones["torso"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-2-Spine2-4.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(this.sizes.shoulderWidth / 2 - 1, 2, 1) }));
    this.bones["hips"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-8-Spine1-3.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(3, 2, 0) }));
    this.bones["lLegUpper"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-14-L_Thigh-3.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(1, 3, 0) }));
    this.bones["rLegUpper"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-11-R_Thigh-2.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(0, 3, 0) }));
    this.bones["lLegLower"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-13-L_Calf-3.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(1, 3, -0.5) }));
    this.bones["rLegLower"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-10-R_Calf-3.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(0, 3, -0.5) }));
    this.bones["lLegLower"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-12-L_Foot-3.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(1, -0.5, 0.5) }));
    this.bones["rLegLower"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-9-R_Foot-2.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(0, -0.5, 0.5) }));
    this.bones["lArmUpper"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-7-L_Arm-3.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(0, 3, 1) }));
    this.bones["rArmUpper"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-1-R_Arm.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(1, 3, 1) }));
    this.bones["lArmLower"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-6-L_ForeArm-3.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(0, 4, 1) }));
    this.bones["rArmLower"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-0-R_ForeArm.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, -Math.PI / 2), position: v3(1, 4, 1) }));
    this.bones["lArmLower"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-4-L_Hand-3.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(-0.5, 0.5, 1) }));
    this.bones["rArmLower"].addChild(new GLobj({ colorIntensity: 1.3, url: "RPGCharacters_Source-5-R_Hand-3.obj", size: v3(10, 10, 10), rotation: v3(0, Math.PI, -Math.PI / 2), position: v3(1.5, 0.5, 1) }));
    this.animator.add("running", 1e3, {
      torso: [[0, [-0.3, -0.3, 0]], [1, [-0.3, 0.3, 0]]],
      hips: [[0, [0, 0, 0, 0, 2, 0]], [0.5, [0, 0, 0, 0, 0, 0]], [1, [0, 0, 0, 0, 2, 0]]],
      head: [[0, [0.2, 0.2, 0]], [1, [0.2, -0.2, 0]]],
      lArmUpper: [[0, [-0.8, 0, 0.1]], [1, [1.2, 0, 0.1]]],
      lArmLower: [[0, [0.3, 0, 0]], [1, [1.2, 0, -1.2]]],
      lHand: [],
      rArmUpper: [[0, [1.2, 0, -0.1]], [1, [-0.8, 0, -0.1]]],
      rArmLower: [[0, [1.2, 0, 1.2]], [1, [0.3, 0, 0]]],
      rHand: [],
      lLegUpper: [[0, [1.2, 0, 0]], [1, [-0.6, 0, 0]]],
      lLegLower: [[0, [-0.3, 0, 0]], [1, [-2, 0, 0]]],
      lFoot: [[0, [-0.2, 0, 0]]],
      rLegUpper: [[0, [-0.6, 0, 0]], [1, [1.2, 0, 0]]],
      rLegLower: [[0, [-2, 0, 0]], [1, [-0.3, 0, 0]]],
      rFoot: [[0, [-0.2, 0, 0]]]
    }, { loop: true, ease: "easeInOutSine", bounce: true });
    this.animator.add("jumping", 500, {
      torso: [[0], [1]],
      hips: [[0], [1, [-0.1, -0.1, -0.15]]],
      head: [[0], [1, [0.3, 0, 0]]],
      lArmUpper: [[0], [1, [-0.2, 0, 0.1]]],
      lArmLower: [[0], [1, [0, 0, 0.2]]],
      lHand: [[0], [1]],
      rArmUpper: [[0], [1, [3, 0, 0.3]]],
      rArmLower: [[0], [1, [0, 0, 0.2]]],
      rHand: [[0], [1]],
      lLegUpper: [[0], [1, [2, 0, 0]]],
      lLegLower: [[0], [1, [-2.4, 0, 0]]],
      lFoot: [[0], [1]],
      rLegUpper: [[0], [1, [-0.2, 0, 0]]],
      rLegLower: [[0], [1, [-0.3, 0, 0]]],
      rFoot: [[0], [1, [-0.6, 0, 0]]]
    }, { once: true, ease: "easeInOutSine" });
    this.animator.add("idle", 15e3, {
      torso: [],
      hips: [],
      head: [[0.4, [0, 0.5]], [0.5, [0, -0.5]], [0.9, [0, -0.5]], [1, [0, 0.5]]],
      lArmUpper: [],
      lArmLower: [],
      lHand: [],
      rArmUpper: [],
      rArmLower: [],
      rHand: [],
      lLegUpper: [],
      lLegLower: [],
      lFoot: [],
      rLegUpper: [],
      rLegLower: [],
      rFoot: []
    }, { loop: true, dynamic: true, ease: "easeInOutSine" });
    this.animator.add("aim", 1e3, {
      torso: [],
      hips: [[0], [1, [0, Math.PI / 2, 0]]],
      head: [[0], [1, [0, -1.1, 0]]],
      lArmUpper: [[0], [1, [Math.PI / 2, 0, Math.PI / 2 - 0.1]]],
      lArmLower: [[0], [1, [0, 0, -0.2]]],
      lHand: [],
      rArmUpper: [[0], [1, [1.5, 0, -0.8]]],
      rArmLower: [[0], [1, [-0.3, 0, 2.2]]],
      rHand: [],
      lLegUpper: [[0], [1, [0, 0, 0.15]]],
      lLegLower: [],
      lFoot: [],
      rLegUpper: [[0], [1, [0, 0, -0.15]]],
      rLegLower: [],
      rFoot: []
    }, { once: true, ease: "easeInOutSine" });
    this.animator.play("aim");
  }
  tick(obj) {
    super.tick(obj);
    if (!this.parent.stat.ground) {
      this.animator.play("jumping");
    } else {
      if (this.parent.stat.running) {
        this.animator.play("running");
      } else {
        if (this.parent.aiming) {
          this.animator.play("aim");
        } else {
          this.animator.play("idle");
        }
      }
    }
  }
};

// ts/modes/side/player/player_actor.ts
var Player = class extends Character {
  constructor({
    position = Vector3.f(0),
    rotation = Vector3.f(0)
  } = {}) {
    super({
      position,
      rotation,
      size: v3(8, 33, 8),
      anchorPoint: v3(4, 0, 4)
    });
    this.stat = { jumping: false, falling: false, running: false, fallAnimation: false };
    this.addControllers([
      new Collider({
        size: v3(8, 33, 8),
        fixed: false,
        position: v3(4, 0, 4),
        absoluteOffset: v3(-4, 0, -4)
      }),
      new PlayerController(this),
      new FreeCamera(this)
    ]);
  }
  get aiming() {
    const a = this.controllers[1].aiming;
    return a;
  }
  build() {
    GlElement.registerControllers(this);
    this.skeleton = new PlayerSkel();
    this.addChild(this.skeleton);
    this.skeleton.position = v3(0, 0, 0);
    this.bow = new BowActor();
    this.addChild(this.bow);
  }
  tick(obj) {
    super.tick(obj);
  }
};

// ts/modes/side/trees/treeBase.ts
var TreeBase = class extends GLobj {
  constructor(attr) {
    super({
      url: "treeModels/".concat(attr.name, ".obj"),
      rotation: attr.rotation || v3(),
      size: v3(70, 70, 70).scale(attr.scale || 1),
      position: attr.position || v3()
    });
  }
};

// ts/modes/side/trees/tree1.ts
var Tree1 = class extends TreeBase {
  constructor(attr) {
    super({
      name: "tree0_1",
      position: attr.position,
      rotation: attr.rotation,
      scale: attr.scale * 0.7
    });
  }
};

// ts/modes/side/trees/tree2.ts
var Tree2 = class extends TreeBase {
  constructor(attr) {
    super({
      name: "tree0_2",
      position: attr.position,
      rotation: attr.rotation,
      scale: attr.scale
    });
  }
};

// ts/modes/side/trees/tree3.ts
var Tree3 = class extends TreeBase {
  constructor(attr) {
    super({
      name: "tree0_3",
      position: attr.position,
      rotation: attr.rotation,
      scale: attr.scale
    });
  }
};

// ts/modes/side/trees/tree4.ts
var Tree4 = class extends TreeBase {
  constructor(attr) {
    super({
      name: "tree0_4",
      position: attr.position,
      rotation: attr.rotation,
      scale: attr.scale
    });
  }
};

// ts/modes/side/trees/tree5.ts
var Tree5 = class extends TreeBase {
  constructor(attr) {
    super({
      name: "tree0_5",
      position: attr.position,
      rotation: attr.rotation,
      scale: attr.scale
    });
  }
};

// ts/modes/side/trees/tree6.ts
var Tree6 = class extends TreeBase {
  constructor(attr) {
    super({
      name: "tree0_6",
      position: attr.position,
      rotation: attr.rotation,
      scale: attr.scale
    });
  }
};

// ts/modes/side/trees/randomTree.ts
var RandomTree = class extends GLGroup {
  constructor(attr) {
    super({
      position: attr.position
    });
  }
  build() {
    super.build();
    this.addChild(new [Tree1, Tree2, Tree3, Tree4, Tree5, Tree6, Tree2, Tree3, Tree4, Tree5, Tree6][Math.floor(Math.random() * 11)]({
      rotation: v3(0, Math.random() * Math.PI, 0),
      scale: 0.8 + 0.4 * Math.random()
    }));
  }
};

// ts/modes/side/trees/forrest.ts
var Forrest = class extends GLGroup {
  constructor(attr) {
    super({
      position: attr.position
    });
    this.area = attr.area;
    this.density = attr.density;
  }
  build() {
    super.build();
    for (let x = 0; x < this.area.x; x += 10) {
      for (let y = 0; y < this.area.y; y += 10) {
        if (Math.random() < this.density) {
          this.addChild(new RandomTree({
            position: v3(x, 0, y)
          }));
        }
      }
    }
  }
};

// ts/classes/input/touchReader.ts
var TouchAxisReader = class extends InputReader {
  constructor(ui, alignment = "bottomLeft", offset = v2(0), limit = 20, scale2 = v2(1)) {
    super();
    this.ui = ui;
    this.alignment = alignment;
    this.offset = offset;
    this.limit = limit;
    this.scale = scale2;
    this._state = v2(0);
    this.shell = document.createElement("div");
    this.shell.setAttribute("style", "\n            width: ".concat(70 + this.limit * 2, "px;\n            height: ").concat(70 + this.limit * 2, "px;\n            border-radius: 100%;\n            background: #000000;\n            z-index: 99999999999999999999999;\n            position: absolute;\n            pointer-events: all;\n            opacity: 0.4;\n            ").concat(this.alignment.slice(-4) === "Left" ? "left" : "right", ":").concat(this.offset.x - this.limit, "px;\n            ").concat(this.alignment.slice(3) === "top" ? "top" : "bottom", ":").concat(this.offset.y - this.limit, "px;\n        "));
    this.stick = document.createElement("div");
    this.stick.setAttribute("style", "\n            width: 70px;\n            height: 70px;\n            border-radius: 100%;\n            z-index: 99999999999999999999999;\n            position: absolute;\n            pointer-events: all;\n            box-shadow: inset 0px 0px 29px white;\n            left: ".concat(this.limit, "px;\n            top: ").concat(this.limit, "px;\n        "));
    this.stick.addEventListener("touchstart", (e) => {
      this._dragging = true;
      this._touchStart = v2(e.touches[0].screenX, e.touches[0].screenY);
      e.preventDefault();
    });
    this.stick.addEventListener("touchmove", (e) => {
      if (this._dragging) {
        const rel = v2(e.touches[0].screenX, e.touches[0].screenY).subtract(this._touchStart).clampMagnitude(this.limit);
        this.stick.style.transform = "translate(".concat(rel.x, "px,").concat(rel.y, "px)");
        this._state = rel.scale(1 / this.limit).multiply(this.scale);
      }
      e.preventDefault();
    });
    this.stick.addEventListener("touchend", (e) => {
      this._dragging = false;
      this._state = v2(0);
      this.stick.style.transform = "translate(0,0)";
      e.preventDefault();
    });
    this.ui.touchControls.appendChild(this.shell);
    this.shell.appendChild(this.stick);
  }
  get value() {
    return this._state;
  }
};
var TouchVerticalReader = class extends InputReader {
  constructor(ui, alignment = "bottomLeft", offset = v2(0), limit = 20, scale2 = 1) {
    super();
    this.ui = ui;
    this.alignment = alignment;
    this.offset = offset;
    this.limit = limit;
    this.scale = scale2;
    this._state = 0;
    this.shell = document.createElement("div");
    this.shell.setAttribute("style", "\n            width: 70px;\n            height: ".concat(70 + this.limit * 2, "px;\n            border-radius: 35px;\n            background: #000000;\n            z-index: 99999999999999999999999;\n            position: absolute;\n            pointer-events: all;\n            opacity: 0.4;\n            ").concat(this.alignment.slice(-4) === "Left" ? "left" : "right", ":").concat(this.offset.x, "px;\n            ").concat(this.alignment.slice(0, 3) === "top" ? "top" : "bottom", ":").concat(this.offset.y - this.limit, "px;\n        "));
    this.stick = document.createElement("div");
    this.stick.setAttribute("style", "\n            width: 70px;\n            height: 70px;\n            border-radius: 35px;\n            z-index: 99999999999999999999999;\n            position: absolute;\n            pointer-events: all;\n            box-shadow: inset 0px 0px 29px white;\n            top: ".concat(this.limit, "px;\n        "));
    this.stick.addEventListener("touchstart", (e) => {
      this._dragging = true;
      this._touchStart = e.touches[0].screenY;
      e.preventDefault();
    });
    this.stick.addEventListener("touchmove", (e) => {
      if (this._dragging) {
        let rel = Util.clamp(e.touches[0].screenY - this._touchStart, -this.limit, this.limit);
        if (rel !== 0) {
          this._state = rel * this.scale;
          this.stick.style.transform = "translate(0,".concat(rel, "px)");
        } else {
          this._state = 0;
          this.stick.style.transform = "translate(0,0)";
        }
      }
      e.preventDefault();
    });
    this.stick.addEventListener("touchend", () => {
      this._dragging = false;
      this._state = 0;
      this.stick.style.transform = "translate(0,0)";
    });
    this.ui.touchControls.appendChild(this.shell);
    this.shell.appendChild(this.stick);
  }
  get value() {
    return this._state;
  }
};
var TouchLiniarAxisReader = class extends InputReader {
  constructor(ui, alignment = "bottomLeft", offset = v2(0), limit = 20, scale2 = v2(1)) {
    super();
    this.ui = ui;
    this.alignment = alignment;
    this.offset = offset;
    this.limit = limit;
    this.scale = scale2;
    this._state = v2(0);
    this.shell = document.createElement("div");
    this.shell.setAttribute("style", "\n        width: ".concat(70 + this.limit * 2, "px;\n        height: ").concat(70 + this.limit * 2, "px;\n            z-index: 99999999999999999999999;\n            position: absolute;\n            pointer-events: all;\n            opacity: 0.4;\n            ").concat(this.alignment.slice(-4) === "Left" ? "left" : "right", ":").concat(this.offset.x - this.limit, "px;\n            ").concat(this.alignment.slice(3) === "top" ? "top" : "bottom", ":").concat(this.offset.y - this.limit, "px;\n        "));
    const l1 = document.createElement("div");
    l1.setAttribute("style", "\n        width: ".concat(70 + this.limit * 2, "px;\n        height: 70px;\n            border-radius: 35px;\n            background: #000000;\n            z-index: 99999999999999999999999;\n            position: absolute;\n            pointer-events: all;\n            top: ").concat(this.limit, "px;\n            left: 0px;\n        "));
    this.shell.appendChild(l1);
    const l2 = document.createElement("div");
    l2.setAttribute("style", "\n        height: ".concat(70 + this.limit * 2, "px;\n        width: 70px;\n            border-radius: 35px;\n            background: #000000;\n            z-index: 99999999999999999999999;\n            position: absolute;\n            pointer-events: all;\n            left: ").concat(this.limit, "px;\n            top: 0px;\n        "));
    this.shell.appendChild(l2);
    this.stick = document.createElement("div");
    this.stick.setAttribute("style", "\n            width: 70px;\n            height: 70px;\n            border-radius: 100%;\n            z-index: 99999999999999999999999;\n            position: absolute;\n            pointer-events: all;\n            box-shadow: inset 0px 0px 29px white;\n            left: ".concat(this.limit, "px;\n            top: ").concat(this.limit, "px;\n        "));
    this.stick.addEventListener("touchstart", (e) => {
      this._dragging = true;
      this._touchStart = v2(e.touches[0].screenX, e.touches[0].screenY);
      e.preventDefault();
    });
    this.stick.addEventListener("touchmove", (e) => {
      if (this._dragging) {
        let direct = v2(e.touches[0].screenX, e.touches[0].screenY).subtract(this._touchStart).clampMagnitude(this.limit);
        if (direct.magnitude() > this.limit / 4) {
          let rel = Vector2.right.rotate(Math.round(direct.angle() / Math.PI * 2) * Math.PI / 2);
          this.stick.style.transform = "translate(".concat(rel.x * this.limit, "px,").concat(rel.y * this.limit, "px)");
          if (direct.magnitude() < this.limit / 2) {
            this._state = v2(0);
            this.stick.style.transform = "translate(".concat(rel.x * this.limit / 2, "px,").concat(rel.y * this.limit / 2, "px)");
          } else {
            this._state = rel.multiply(this.scale).toPrecision(1);
            this.stick.style.transform = "translate(".concat(rel.x * this.limit, "px,").concat(rel.y * this.limit, "px)");
          }
        } else {
          this._state = v2(0);
          this.stick.style.transform = "translate(0,0)";
        }
      }
      e.preventDefault();
    });
    this.stick.addEventListener("touchend", () => {
      this._dragging = false;
      this._state = v2(0);
      this.stick.style.transform = "translate(0,0)";
    });
    this.ui.touchControls.appendChild(this.shell);
    this.shell.appendChild(this.stick);
  }
  get value() {
    return this._state;
  }
};

// ts/modes/side/level.ts
var World = class extends Level {
  // new TouchButtonReader(this.interface)
  constructor() {
    super();
    this.start = Vector2.zero;
    this.background = [1 * 0.07, 1 * 0.07, 1 * 0.1, 1];
    this.light = v3(0, 400, 500);
    this.inputMap = new InputMap(
      {
        "camera": [new MouseMoveReader(), new TouchAxisReader(this.interface, "bottomRight", v2(60, 60), 40, v2(4))],
        "movement": [new KeyboardJoyStickReader(["a", "d", "s", "w"]), new TouchLiniarAxisReader(this.interface, "bottomLeft", v2(60, 60), 40, v2(1, -1))]
      },
      {
        "jump": [new KeyboardReader(" ")],
        "aim": [new KeyboardReader("e")],
        "zoom": [new MouseScrollReader(), new TouchVerticalReader(this.interface, "topRight", v2(60, 60), 30, 1)]
      }
    );
    this.addControllers([
      new Collider({
        position: v3(-5e3, -1e3, -2e3),
        size: v3(1e4, 1e3, 4e3),
        fixed: true
      })
      // new Collider({
      //     position: v3(150, -6, 727),
      //     size: v3(100, 20, 168),
      //     fixed: true
      // }),
    ]);
    this.test2d = new DomText({
      position: v2(100, 100),
      fontSize: 40,
      fontFamily: "monospace",
      color: "white",
      text: "0"
    });
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
      -2,
      200 * y - 100
    );
    this.addChild(new GLobj({ url: Math.random() < 0.5 ? "CountrySide-3-GroundTile1.obj" : "CountrySide-2-GroundTile2.obj", size: v3(20, 20, 20), position: p }));
    for (let rx = 0; rx < 5; rx++) {
      for (let ry = 0; ry < 5; ry++) {
        if (Math.random() < 0.1) {
          this.addChild(new GLobj({
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
  spawnRoad(x, y) {
    if (Math.random() < 0.5) {
      this.addChild(new GLobj({ url: "apoc/VoxelNuke-18-RoadTile-1.obj", size: v3(100, 100, 100), position: v3(x * 200 - 2200, -6, y * 200 - 100) }));
    } else {
      this.addChild(new GLobj({ url: "apoc/VoxelNuke-17-RoadTile-0.obj", size: v3(100, 100, 100), position: v3(x * 200 - 2e3, -6, y * 200 - 100) }));
    }
    for (let i = 0; i < 6; i++) {
      if (Math.random() < 0.2) {
        this.addChild(new GLobj({ url: "apoc/VoxelNuke-0-Overgrowth-0.obj", size: v3(50, 50, 50), position: v3(x * 200 - 2e3 + i * 33, -4, y * 200 - 55) }));
      }
      if (Math.random() < 0.2) {
        this.addChild(new GLobj({ url: "apoc/VoxelNuke-0-Overgrowth-0.obj", size: v3(50, 50, 50), position: v3(x * 200 - 2e3 + i * 33, -4, y * 200 - 145), rotation: v3(0, Math.PI, 0) }));
      }
    }
  }
  build() {
    super.build();
    this.player = new Player({
      position: v3(0, 0, 650),
      rotation: v3(0, 2.3, 0)
    });
    this.addChild(this.player);
    this.addLight(new Light({
      position: v3(0, 70, 100),
      color: [0.9, 0.9, 0.85, 1],
      specular: [0.3, 0.3, 0.3, 1],
      limit: [10, 10.1],
      range: [600, 1001],
      direction: v3(0, 0, -1)
    }));
    this.addChild(new GLCuboid({ size: v3(1e4, 1, 1e4), position: v3(-5e3, -6, -5e3), colors: [[103 / 350, 119 / 350, 107 / 350, 1]] }));
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        this.spawnTile(x, y);
      }
    }
    this.addChild(new Forrest({
      storage: this.mode.storage,
      position: v3(-2e3, 0, 800),
      area: v2(4e3, 2e3),
      density: 3e-3
    }));
    this.addChild(new Forrest({
      storage: this.mode.storage,
      position: v3(-2e3, 0, -1800),
      area: v2(4e3, 2e3),
      density: 3e-3
    }));
    this.addChild(new Forrest({
      storage: this.mode.storage,
      position: v3(-2300, 0, -1800),
      area: v2(2e3, 4e3),
      density: 3e-3
    }));
    this.addChild(new Forrest({
      storage: this.mode.storage,
      position: v3(300, 0, -1800),
      area: v2(2e3, 4e3),
      density: 3e-3
    }));
  }
  tick(obj) {
    super.tick(obj);
  }
};

// ts/modes/mode.ts
var OpenWorldMode = class extends Mode {
  build() {
    super.build();
    this.addLevel("openWorld", new World());
    this.switchLevel("openWorld");
  }
};

// ts/game.ts
var glob = new class {
  constructor() {
    this.device = new InputDevices();
  }
  get renderer() {
    return this.game.renderer;
  }
  get mode() {
    return this.game.active.mode;
  }
  get level() {
    return this.game.active.level;
  }
  get storage() {
    return this.mode.storage;
  }
  get mobile() {
    return this.device.mobile;
  }
}();
var Game2 = class {
  constructor() {
    this.modes = {};
    this.readyToStart = false;
    this._waitCount = 0;
    this.started = false;
    this.total = 0;
    this.padManager = new PadManager();
    this.active = {
      mode: void 0,
      level: void 0
    };
    glob.game = this;
    this.build();
    glob.device.ready();
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
    this.renderer = new Renderer();
    this.loader = new Loader();
    this.renderer.addChild(this.loader);
    this.GLR = new GLRenderer(this);
    this.setupModes();
    this.ticker = new Ticker();
    this.ticker.add(this.tick.bind(this));
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
  const g = new Game2();
  document.body.appendChild(g.renderer.dom);
});
//# sourceMappingURL=index.js.map
