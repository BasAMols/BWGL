import { Collider } from '../../classes/collider';
import { TestObj } from '../../classes/debug/testObj';
import { DomText } from '../../classes/dom/domText';
import { InputMap } from '../../classes/input/input';
import { KeyboardJoyStickReader, KeyboardReader } from '../../classes/input/keyboardReader';
import { Level } from '../../classes/level';
import { Vector2, v2 } from '../../classes/math/vector2';
import { v3 } from '../../classes/math/vector3';
import { ObjStorage } from '../../classes/objStorage';
import { Color } from '../../classes/util/colors';
import { Player } from './player/player_actor';
import { TouchLiniarAxisReader } from '../../classes/input/touchReader';
import { Forrest } from './trees/forrest';
import { Light } from '../../classes/light';
import { TickerReturnData } from '../../classes/ticker';
import { GLCuboid } from '../../classes/objects/cuboid';

export class HalfDimensionWorld extends Level {
    public start = Vector2.zero;
    public background: Color = [1 * 0.2, 1 * 0.2, 1 * 0.5, 1];
    public character: Player;
    public mo: DomText;
    public st: ObjStorage;
    public player: Player;
    public test: TestObj;
    public test2d: DomText;
    public inputMap = new InputMap(
        {
            'movement': [new KeyboardJoyStickReader(['a', 'd', 's', 'w']), new TouchLiniarAxisReader(this.interface, 'bottomLeft', v2(60, 60), 40, v2(1, -1))],
        },
        {
            'jump': [new KeyboardReader(' '),],
        }
    );
    light: Light;

    constructor() {
        super();
        this.addControllers([
            new Collider({
                position: v3(-5000, -100, -200),
                size: v3(10000, 100, 400),
                fixed: true
            }),
            new Collider({
                position: v3(-5000, 0, 200),
                size: v3(10000, 100, 10),
                fixed: true
            }),
            new Collider({
                position: v3(-5000, 0, -200),
                size: v3(10000, 100, 10),
                fixed: true
            }),
        ]);
    }

    build() {
        super.build();

        this.player = new Player({
            position: v3(0, 0, 0),
            rotation: v3(0, 2.3, 0)
        });
        this.addChild(this.player);

        this.light = new Light({
            position: v3(0, 600, -300),
            color: [0.9, 0.9, 1, 1],
            specular: [0.3, 0.3, 0.3, 1],
            limit: [10, 10.1],
            range: [600, 1001],
            direction: v3(0, 0, -1),
        });
        this.addLight(this.light);
        
        this.addChild(new GLCuboid({ size: v3(10000, 1, 10000), position: v3(-5000, -1, -5000), colors: [[103 / 350, 180 / 350, 107 / 350, 1]] }));

        this.addChild(new Forrest({
            storage: this.mode.storage,
            position: v3(-2000, 0, 300),
            area: v2(4000, 4000),
            density: 0.001
        }));

    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj)
        this.light.position.x = this.player.globalPosition.x + 600
    }
}