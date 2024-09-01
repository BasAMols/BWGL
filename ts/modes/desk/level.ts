import { Collider } from '../../classes/collider';
import { TestObj } from '../../classes/debug/testObj';
import { DomText } from '../../classes/dom/domText';
import { InputMap } from '../../classes/input/input';
import { MouseMoveReader, MouseScrollReader } from '../../classes/input/mouseReader';
import { KeyboardJoyStickReader, KeyboardReader } from '../../classes/input/keyboardReader';
import { Level } from '../../classes/level';
import { Vector2, v2 } from '../../classes/math/vector2';
import { v3 } from '../../classes/math/vector3';
import { ObjStorage } from '../../classes/objStorage';
import { Color } from '../../classes/util/colors';
import { Driver } from './car/car_actor';
import { Player } from './player/player_actor';
import { TouchAxisReader, TouchLiniarAxisReader, TouchVerticalReader } from '../../classes/input/touchReader';
import { AmbientLight } from '../../classes/lights/ambient';
import { SpotLight } from '../../classes/lights/spot';
import { fixedCamera } from './level_camera';
import { FBXScene } from '../../classes/objects/fbxScene';

export class DeskLevel extends Level {
    public start = Vector2.zero;
    public background: Color = [0.1,0.1,0.2,1];
    public character: Player;
    public mo: DomText;
    public st: ObjStorage;
    public driving: boolean;
    public car: Driver;
    public test: TestObj;
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
            position: v3(0, -1000,-150),
            color: [0.0, 0.0, 0.0, 1],
            specular: [0.0, 0.0, 0.0, 1],
            limit: [6, 13],
            range: [1600, 2000],
            direction: v3(0, 0, -1),
        }));

        // this.addChild(new GLobj({ url: 'cube.fbx', size: v3(10), position: v3(0,0,0), rotation: v3(0, 0, 0) }));
        this.addChild(new FBXScene({ url: '/shack/shack1.fbx', size: v3(20), position: v3(-50,5,-20), rotation: v3(0, 0, 0) }));
    }


}