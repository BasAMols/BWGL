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
import { Color } from '../../classes/util/colors';
import { Driver } from './car/car_actor';
import { Sky } from './entities/sky';
import { Player } from './player/player_actor';
import { TouchAxisReader, TouchLiniarAxisReader, TouchVerticalReader } from '../../classes/input/touchReader';
import { TestPlayer } from './test/test_actor';
import { SpotLight } from '../../classes/lights/spot';
import { AmbientLight } from '../../classes/lights/ambient';
import { GLCuboid } from '../../classes/objects/cuboid';
import { GLobj } from '../../classes/objects/obj';

export class TestLevel extends Level {
    public start = Vector2.zero;
    public background: Color = [0.2,0.2,0.3,1];
    public character: Player;
    public mo: DomText;
    public st: ObjStorage;
    public driving: boolean;
    public car: Driver;
    public player: TestPlayer;
    public sky: Sky;
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
    // new TouchButtonReader(this.interface)

    constructor() {
        super();
        this.addControllers([
            new Collider({
                position: v3(-5000, -1000, -2000),
                size: v3(10000, 1000, 4000),
                fixed: true
            }),
            // new Collider({
            //     position: v3(150, -6, 727),
            //     size: v3(100, 20, 168),
            //     fixed: true
            // }),
        ]);
    }

    build() {
        super.build();

        this.player = new Player({
            position: v3(0, 0, 0),
            rotation: v3(0, 2.3, 0)
        });
        this.addChild(this.player);

        this.addLight(new SpotLight({
            position: v3(0, 40,150),
            color: [0, 0, 0, 1],
            specular: [0.3, 0.3, 0.3, 1],
            limit: [12, 12.1],
            range: [1600, 2000],
            direction: v3(0, 0, -1),
        }));

        this.addLight(new AmbientLight({
            color: [0.8, 0.8, 0.8],
        }));

        // this.addChild(new GLobj({ url: 'cube.obj', size: v3(10, 10, 10), position: v3(-140,50,100), rotation: v3(0, 0, 0) }));
        this.addChild(new GLobj({ url: 'poly.fbx', overrideTextureURL: 'MergedBake_Bake1_CyclesBake_COMBINED.jpg', size: v3(25, 25, 25), position: v3(40,0,10), rotation: v3(0, 0, 0) }));

        this.addChild(new GLCuboid({ ignoreLighting: true, size: v3(10000, 1, 10000), position: v3(-5000, -6, -5000), colors: [[103 / 350, 119 / 350, 107 / 350, 1]] }));



    }

}