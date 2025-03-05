import { Collider } from '../../classes/collider';
import { TestObj } from '../../classes/debug/testObj';
import { DomText } from '../../classes/dom/domText';
import { InputMap } from '../../classes/input/input';
import { KeyboardJoyStickReader } from '../../classes/input/keyboardReader';
import { Level } from '../../classes/level';
import { Vector2, v2 } from '../../classes/math/vector2';
import { v3 } from '../../classes/math/vector3';
import { ObjStorage } from '../../classes/objStorage';
import { Color } from '../../classes/util/colors';
import { Driver } from './car/car_actor';
import { Player } from './player/player_actor';
import { TouchLiniarAxisReader } from '../../classes/input/touchReader';
import { AmbientLight } from '../../classes/lights/ambient';
import { SpotLight } from '../../classes/lights/spot';
import { GLCuboid } from '../../classes/objects/cuboid';

export class DeskLevel extends Level {
    public start = Vector2.zero;
    public background: Color = [0.16, 0.16, 0.16, 1];
    public character: Player;
    public mo: DomText;
    public st: ObjStorage;
    public driving: boolean;
    public car: Driver;
    public test: TestObj;
    public test2d: DomText;
    public playArea: Vector2 = v2(100,100);
    public inputMap = new InputMap(
        {
            // 'camera': [new MouseMoveReader(), new TouchAxisReader(this.interface, 'bottomRight', v2(60, 60), 40, v2(4))],
            'movement': [new KeyboardJoyStickReader(['a', 'd', 's', 'w']), new TouchLiniarAxisReader(this.interface, 'bottomLeft', v2(60, 60), 40, v2(1, -1))],
        },
        {
            // 'jump': [new KeyboardReader(' '),],
            // 'aim': [new KeyboardReader('e')],
            // 'zoom': [new MouseScrollReader(), new TouchVerticalReader(this.interface, 'topRight', v2(60, 60), 30, 1)],
        }
    );
    player: Player;

    constructor() {
        super();

        const thickness = 10;

        this.addZone(new Collider({
            position: v3(-thickness, -10, -thickness),
            // size: v3((size.x - thickness) * x + thickness, 100, (size.y - thickness) * y + thickness),
            size: v3(thickness*2 + this.playArea.x, 100, thickness),
            fixed: true,
        }));
        this.addZone(new Collider({
            position: v3(-thickness, -10, -thickness),
            // size: v3((size.x - thickness) * x + thickness, 100, (size.y - thickness) * y + thickness),
            size: v3(thickness, 100, thickness*2+ this.playArea.y),
            fixed: true,
        }));
        this.addZone(new Collider({
            position: v3(-thickness, -10, this.playArea.x ),
            // size: v3((size.x - thickness) * x + thickness, 100, (size.y - thickness) * y + thickness),
            size: v3(thickness*2 + this.playArea.x, 100, thickness),
            fixed: true,
        }));
        this.addZone(new Collider({
            position: v3(this.playArea.y, -10, -thickness ),
            // size: v3((size.x - thickness) * x + thickness, 100, (size.y - thickness) * y + thickness),
            size: v3(thickness, 100, thickness*2+ this.playArea.y),
            fixed: true,
        }));
    }

    build() {
        super.build();

        this.player = new Player({
            position: v3(10, 0, 10),
            rotation: v3(0, 0, 0),
        });
        this.addChild(this.player);

        Level.registerControllers(this);

        this.addLight(new AmbientLight({
            color: [1, 1, 1],
        }));
        this.addLight(new SpotLight({
            position: v3(50, 10,0),
            color: [0.5, 0.5, 0.5, 1],
            specular: [1, 1, 1, 1],
            limit: [6, 13],
            range: [1600, 2000],
            direction: v3(0, 0.1, 0),
        }));

        // area
        this.addChild(new GLCuboid({
            size: v3(this.playArea.x, 1, this.playArea.y),
            position: v3(0, 0, 0),
            colors: [[0.38, 0.22, 0.16, 1]]
        }));
    }

}