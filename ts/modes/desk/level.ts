import { Collider } from '../../classes/collider';
import { TestObj } from '../../classes/debug/testObj';
import { DomText } from '../../classes/dom/domText';
import { InputMap } from '../../classes/input/input';
import { MouseMoveReader, MouseScrollReader } from '../../classes/input/mouseReader';
import { KeyboardJoyStickReader, KeyboardReader } from '../../classes/input/keyboardReader';
import { Level } from '../../classes/level';
import { Vector2, v2 } from '../../classes/math/vector2';
import { Vector3, v3 } from '../../classes/math/vector3';
import { ObjStorage } from '../../classes/objStorage';
import { TickerReturnData } from '../../classes/ticker';
import { Color } from '../../classes/util/colors';
import { Driver } from './car/car_actor';
import { Player } from './player/player_actor';
import { TouchAxisReader, TouchLiniarAxisReader, TouchVerticalReader } from '../../classes/input/touchReader';
import { AmbientLight } from '../../classes/lights/ambient';
import { GLCuboid } from '../../classes/objects/cuboid';
import { SpotLight } from '../../classes/lights/spot';
import { fixedCamera } from './level_camera';
import { GLobj } from '../../classes/objects/obj';

export class DeskLevel extends Level {
    public start = Vector2.zero;
    public background: Color = [0.2,0.2,0.3,1];
    public character: Player;
    public mo: DomText;
    public st: ObjStorage;
    public driving: boolean;
    public car: Driver;
    public test: TestObj;
    public light: Vector3 = v3(0, 400, 500);
    public test2d: DomText;
    public inputMap = new InputMap(
        {
            'camera': [new MouseMoveReader(), new TouchAxisReader(this.interface, 'bottomRight', v2(60, 60), 40, v2(4))],
            'movement': [new KeyboardJoyStickReader(['a', 'd', 's', 'w']), new TouchLiniarAxisReader(this.interface, 'bottomLeft', v2(60, 60), 40, v2(1, -1))],
        },
        {
            'jump': [new KeyboardReader(' '),],
            'aim': [new KeyboardReader('e')],
            'zoom': [new MouseScrollReader(), new TouchVerticalReader(this.interface, 'topRight', v2(60, 60), 30, 1)],
        }
    );
    player: Player;

    constructor() {
        super();
        this.addControllers([
            new Collider({
                position: v3(-5000, -1000, -2000),
                size: v3(10000, 1000, 4000),
                fixed: true
            }),
            new fixedCamera()
        ]);

        this.test2d = new DomText({
            position: v2(100, 100),
            fontSize: 40,
            fontFamily: 'monospace',
            color: 'white',
            text: '0'
        });
        this.addUi(this.test2d);
    }

    build() {
        super.build();
        Level.registerControllers(this);

        this.player = new Player({
            position: v3(0, 0, 0),
            rotation: v3(0, 0, 0)
        }); 
        this.addChild(this.player);

        this.addLight(new AmbientLight({
            color: [1, 1, 1],
        }));
        this.addLight(new SpotLight({
            position: v3(0, 40,-150),
            color: [0.0, 0.0, 0.0, 1],
            specular: [0.0, 0.0, 0.0, 1],
            limit: [6, 13],
            range: [1600, 2000],
            direction: v3(0, 0, -1),
        }));

        this.addChild(new GLCuboid({ size: v3(10000, 1, 10000), position: v3(-5000, -6, -5000), colors: [[103 / 350, 119 / 350, 107 / 350, 1]] }));
        // this.addChild(new GLobj({ url: 'lowpoly-room_start.obj', size: v3(18, 18, 18), position: v3(-40,0,70), rotation: v3(0, -Math.PI / 2, 0) }));
        this.addChild(new GLobj({ url: 'cube.obj', size: v3(10, 10, 10), position: v3(-140,50,100), rotation: v3(0, 0, 0) }));
        this.addChild(new GLobj({ url: 'cube.fbx', size: v3(10, 10, 10), position: v3(40,30,10), rotation: v3(0, 0, 0) }));
        // this.addChild(new GLobj({ url: 'CountrySide-4-Vegetation1.obj', size: v3(20, 20, 20), rotation: v3(0, Math.PI, 0), position: v3(-100 - 20, 5, 670) }));
        // this.addChild(new GLobj({ url: 'CountrySide-4-Vegetation1.obj', size: v3(25, 25, 25), rotation: v3(0, 0, 0), position: v3(-20 - 20, 6, 760) }));
        // this.addChild(new GLobj({ url: 'CountrySide-4-Vegetation1.obj', size: v3(25, 25, 25), rotation: v3(0, Math.PI / 2, 0), position: v3(0 - 20, 3, 670) }));
        // this.addChild(new GLobj({ url: 'Plane01.obj', size: v3(30, 30, 30), position: v3(420, 16, 720), rotation: v3(0, Math.PI / 4 + Math.PI / 2, -0.12) }));
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        // this.test2d.text = this.player.globalPosition.vec.map((v) => +v.toFixed(0)).join('\n');
        // this.testt.position = this.player.globalPosition.clone()

        // console.log(this.inputMap.axis('camera'));

    }


}