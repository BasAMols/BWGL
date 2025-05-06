import { TestObj } from '../../classes/debug/testObj';
import { DomText } from '../../classes/dom/domText';
import { InputMap } from '../../classes/input/input';
import { KeyboardAxisReader, KeyboardJoyStickReader, KeyboardReader } from '../../classes/input/keyboardReader';
import { Level } from '../../classes/level';
import { Vector2, v2 } from '../../classes/math/vector2';
import { v3 } from '../../classes/math/vector3';
import { ObjStorage } from '../../classes/objStorage';
import { Color } from '../../classes/util/colors';
import { Player } from './player/player_actor';
import { TouchAxisReader, TouchLiniarAxisReader, TouchVerticalReader } from '../../classes/input/touchReader';
import { AmbientLight } from '../../classes/lights/ambient';
import { SpotLight } from '../../classes/lights/spot';
import { Box } from './box';
import { MouseMoveReader, MouseScrollReader } from '../../classes/input/mouseReader';
import { Forklift } from './forklift/forklift_actor';
import { Garage } from './garage';
import { FBXScene } from '../../classes/objects/fbxScene';

export class TopLevel extends Level {
    public start = Vector2.zero;
    public background: Color = [0.37, 0.43, 0.72, 1];
    public character: Player;
    public mo: DomText;
    public st: ObjStorage;
    public driving: boolean;
    public test: TestObj;
    public test2d: DomText;
    public playArea: Vector2 = v2(371, 200);
    public inputMap = new InputMap(
        {
            'camera': [new MouseMoveReader(), new TouchAxisReader(this.interface, 'bottomRight', v2(60, 60), 40, v2(4))],
            'movement': [new KeyboardJoyStickReader(['a', 'd', 's', 'w']), new TouchLiniarAxisReader(this.interface, 'bottomLeft', v2(60, 60), 40, v2(1, -1))],
        },
        {
            'interact': [new KeyboardReader('e')],
            'zoom': [new MouseScrollReader(), new TouchVerticalReader(this.interface, 'topRight', v2(60, 60), 30, 1)],
            'lift': [new KeyboardAxisReader(['f', 'r'])],
            'liftAngle': [new KeyboardAxisReader(['g', 't'])],
        }
    );
    player: Player;
    box: Box;
    forklift: Forklift;
    garage1: Garage;
    garage2: Garage;
    garage3: Garage;
    garage4: Garage;

    constructor() {
        super();

        const thickness = 10;
     
        // this.addZone(new Collider({
        //     position: v3(-215, -10, -160),
        //     size: v3(371, 40, 2),
        //     fixed: true,
        // }));
        // this.addZone(new Collider({
        //     position: v3(-215, -10, 43),
        //     size: v3(41, 40, 6),
        //     fixed: true,
        // }));
        // this.addZone(new Collider({
        //     position: v3(-158, -10, 43),
        //     size: v3(99, 40, 6),
        //     fixed: true,
        // }));
        // this.addZone(new Collider({
        //     position: v3(-28, -10, 43),
        //     size: v3(18, 40, 6),
        //     fixed: true,
        // }));
        // this.addZone(new Collider({
        //     position: v3(22, -10, 43),
        //     size: v3(18, 40, 6),
        //     fixed: true,
        // }));
        // this.addZone(new Collider({
        //     position: v3(72, -10, 43),
        //     size: v3(18, 40, 6),
        //     fixed: true,
        // }));
        // this.addZone(new Collider({
        //     position: v3(122, -10, 43),
        //     size: v3(34, 40, 6),
        //     fixed: true,
        // }));
        // this.addZone(new Collider({
        //     position: v3(-215, -10, 145),
        //     size: v3(103, 40, 2),
        //     fixed: true,
        // }));
        // this.addZone(new Collider({
        //     position: v3(-215, -10, -168),
        //     size: v3(2, 40, 312),
        //     fixed: true,
        // }));
        // this.addZone(new Collider({
        //     position: v3(156, -10, -168),
        //     size: v3(2, 40, 215),
        //     fixed: true,
        // }));

    }

    build() {
        super.build();

        this.player = new Player({
            position: v3(10, 0, 10),
            rotation: v3(0, 0, 0),
        });
        this.addChild(this.player);

        // this.garage1 = new Garage({
        //     position: v3(-61, 0, 42),
        //     open: 1,
        // });
        // this.addChild(this.garage1);
        // this.garage2 = new Garage({
        //     position: v3(-61+50, 0, 42),
        //     open: 1,
        // });
        // this.addChild(this.garage2);
        // this.garage3 = new Garage({
        //     position: v3(-61+50*2, 0, 42),
        // });
        // this.addChild(this.garage3);
        // this.garage4= new Garage({
        //     position: v3(-61+50*3, 0, 42),
        // });
        // this.addChild(this.garage4);

        Level.registerControllers(this);

        this.addLight(new AmbientLight({
            color: [1, 1, 1],
        }));
        this.addLight(new SpotLight({
            position: v3(50, 10, 0),
            color: [0.5, 0.5, 0.5, 1],
            specular: [1, 1, 1, 1],
            limit: [6, 13],
            range: [1600, 2000],
            direction: v3(0, 0.1, 0),
        }));


        this.box = new Box({
            position: v3(30, 0, 10),
        });
        // this.addChild(this.box);

        // this.forklift = new Forklift({
        //     position: v3(0, 0, 20),
        // });
        // this.addChild(this.forklift);

        this.addChild(new FBXScene({ url: '/islands.fbx', position: v3(0, -2100, 0) }));
        // this.addChild(new FBXScene({ url: '/warehouse/warehouse/warehouse.fbx' }));

        // this.forklift.setDriving(true);
        this.player.setDriving(false);
    }
}