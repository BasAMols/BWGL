import { Collider } from '../../classes/collider';
import { TestObj } from '../../classes/debug/testObj';
import { DomText } from '../../classes/dom/domText';
import { InputMap, KeyboardJoyStickReader, KeyboardReader, MouseMoveReader, MouseScrollReader } from '../../classes/input/inputCombiner';
import { Level } from '../../classes/level';
import { Light } from '../../classes/light';
import { Vector2, v2 } from '../../classes/math/vector2';
import { Vector3, v3 } from '../../classes/math/vector3';
import { ObjStorage } from '../../classes/objStorage';
import { GLCuboid } from '../../classes/objects/cuboid';
import { GLobj } from '../../classes/objects/obj';
import { TickerReturnData } from '../../classes/ticker';
import { Color } from '../../classes/util/colors';
import { Driver } from './car/car_actor';
import { Sky } from './entities/sky';
import { Player } from './player/player_actor';
import { Forrest } from './trees/forrest';

export class World extends Level {
    public start = Vector2.zero;
    public background: Color = [1 * 0.07, 1 * 0.07, 1 * 0.1, 1];
    public character: Player;
    public mo: DomText;
    public st: ObjStorage;
    public driving: boolean;
    public car: Driver;
    public player: Player;
    public sky: Sky;
    public test: TestObj;
    public light: Vector3 = v3(0, 400, 500);
    public test2d: DomText;
    public inputMap = new InputMap( 
        {
            'camera': [new MouseMoveReader()],
            'movement': [new KeyboardJoyStickReader(['a', 'd', 's', 'w'])],
        },
        {
            'jump': [new KeyboardReader(' ')],
            'aim': [new KeyboardReader('e')],
            'zoom': [new MouseScrollReader()],
        }
    );

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

        this.test2d = new DomText({
            position: v2(100, 100),
            fontSize: 40,
            fontFamily: 'monospace',
            color: 'white',
            text: '0'
        });
        this.addUi(this.test2d);
    }

    keyDown(e: KeyboardEvent): void {
        if (e.key === "Enter") {
            this.drive();
        }
    }

    drive(b: boolean = !this.driving) {
        this.driving = b;
        this.player.active = !this.driving;
        this.car.active = this.driving;
        if (this.driving) {
            this.player.position = v3(0, -100, 0);
        } else {
            this.player.position = this.car.position.add(v3(10, 0, 0).rotateXZ(-this.car.rotation.xz.angle())).clone();
        }
    }

    spawnTile(x: number, y: number) {
        const p = v3(
            200 * x - 2000,
            -3,
            200 * y - 100
        );
        if (Math.random() < 0.5) {
            this.addChild(new GLobj({ url: 'CountrySide-3-GroundTile1.obj', size: v3(20, 20, 20), position: p }));
        } else {
            this.addChild(new GLobj({ url: 'CountrySide-2-GroundTile2.obj', size: v3(20, 20, 20), position: p }));
        }

        for (let rx = 0; rx < 5; rx++) {
            for (let ry = 0; ry < 5; ry++) {
                if (Math.random() < 0.1) {
                    this.addChild(new GLobj({
                        url: ['CountrySide-6-Vegetation5.obj', 'CountrySide-0-Vegetation3.obj', 'CountrySide-6-Vegetation5.obj', 'CountrySide-8-Rock.obj'][Math.floor(Math.random() * 4)],
                        size: v3(
                            10,
                            10,
                            10,
                        ).scale(Math.ceil(Math.random() * 3)),
                        position: p.add(v3(
                            (40 * rx) + (Math.random() * 6),
                            3,
                            (40 * ry) + (Math.random() * 6) - 80
                        )),
                        rotation: v3(
                            0,
                            Math.floor(Math.random() * 4) * Math.PI,
                            0,
                        )
                    }));
                }
            }
        }
    }

    spawnRoad(x: number, y: number) {
        if (Math.random() < 0.5) {
            this.addChild(new GLobj({ url: 'apoc/VoxelNuke-18-RoadTile-1.obj', size: v3(100, 100, 100), position: v3(x * 200 - 2200, -6, y * 200 - 100) }));
        } else {
            this.addChild(new GLobj({ url: 'apoc/VoxelNuke-17-RoadTile-0.obj', size: v3(100, 100, 100), position: v3(x * 200 - 2000, -6, y * 200 - 100) }));
        }
        for (let i = 0; i < 6; i++) {
            if (Math.random() < 0.2) {
                this.addChild(new GLobj({ url: 'apoc/VoxelNuke-0-Overgrowth-0.obj', size: v3(50, 50, 50), position: v3(x * 200 - 2000 + (i * 33), -4, y * 200 - 55) }));
            }
            if (Math.random() < 0.2) {
                this.addChild(new GLobj({ url: 'apoc/VoxelNuke-0-Overgrowth-0.obj', size: v3(50, 50, 50), position: v3(x * 200 - 2000 + (i * 33), -4, (y * 200) - 145), rotation: v3(0, Math.PI, 0) }));
            }
        }
    }


    build() {
        super.build();

        // this.addChild(new NPC({
        //     size: v3(6, 33, 8),
        //     position: v3(220, 11, 736),
        //     rotation: v3(0, Math.PI, 0)
        // }));

        this.player = new Player({
            position: v3(0, 0, 650),
            rotation: v3(0, 2.3, 0)
        });
        this.addChild(this.player);
        // this.car = new Driver({
        //     size: v3(36, 26, 93),
        //     position: v3(130, 1, 600),
        //     rotation: v3(0, 2.3, 0)
        // });
        // this.addChild(this.car);
        // this.car.active = false;

        this.addLight(new Light({
            position: v3(0, 70, 100),
            color: [0.9, 0.9, 0.85, 1],
            specular: [0.3, 0.3, 0.3, 1],
            limit: [10, 10.1],
            range: [600, 1001],
            direction: v3(0, 0, -1),
        }));
        this.addChild(new GLCuboid({ size: v3(10000, 1, 10000), position: v3(-5000, -6, -5000), colors: [[103 / 350, 119 / 350, 107 / 350, 1]] }));
        for (let x = 0; x < 20; x++) {
            for (let y = 0; y < 20; y++) {
                this.spawnTile(x, y);
                // if (y === 3) {
                //     this.spawnRoad(x, y);
                // } else {
                // }

            }
        }


        // this.addChild(new GLobj({ url: 'CountrySide-5-House.obj', size: v3(18, 18, 18), position: v3(200, 43, 800), rotation: v3(0, -Math.PI / 2, 0) }));
        // this.addChild(new GLobj({ url: 'CountrySide-4-Vegetation1.obj', size: v3(20, 20, 20), rotation: v3(0, Math.PI, 0), position: v3(-100 - 20, 5, 670) }));
        // this.addChild(new GLobj({ url: 'CountrySide-4-Vegetation1.obj', size: v3(25, 25, 25), rotation: v3(0, 0, 0), position: v3(-20 - 20, 6, 760) }));
        // this.addChild(new GLobj({ url: 'CountrySide-4-Vegetation1.obj', size: v3(25, 25, 25), rotation: v3(0, Math.PI / 2, 0), position: v3(0 - 20, 3, 670) }));
        // this.addChild(new GLobj({ url: 'Plane01.obj', size: v3(30, 30, 30), position: v3(420, 16, 720), rotation: v3(0, Math.PI / 4 + Math.PI / 2, -0.12) }));

        // this.addChild(new GLobj({
        //     controllers: [new Collider({
        //         size: v3(97, 200, 98),
        //         position: v3(-144, 0, 143),
        //         fixed: true
        //     }),
        //     new Collider({
        //         size: v3(97-30, 20, 98),
        //         position: v3(-144+15, 0, 122),
        //         fixed: true
        //     })], url: 'Medieval Town - Pack 1-0.obj', size: v3(10, 10, 10), position: v3(0, -1, 500)
        // }));

        this.addChild(new Forrest({
            storage: this.mode.storage,
            position: v3(-2000, 0, 800),
            area: v2(4000, 2000),
            density: 0.003
        }));
        this.addChild(new Forrest({
            storage: this.mode.storage,
            position: v3(-2000, 0, -1800),
            area: v2(4000, 2000),
            density: 0.003
        }));
        this.addChild(new Forrest({
            storage: this.mode.storage,
            position: v3(-2300, 0, -1800),
            area: v2(2000, 4000),
            density: 0.003
        }));
        this.addChild(new Forrest({
            storage: this.mode.storage,
            position: v3(300, 0, -1800),
            area: v2(2000, 4000),
            density: 0.003
        }));

        // this.addChild(new GLobj({
        //     controllers: [new Collider({
        //         size: v3(97, 200, 98),
        //         position: v3(-144 + 97, 0, 143),
        //         fixed: true
        //     })], url: 'Medieval Town - Pack 1-1.obj', size: v3(10, 10, 10), position: v3(0, -1, 500)
        // }));
        // this.addChild(new GLobj({
        //     controllers: [new Collider({
        //         size: v3(97, 200, 98),
        //         position: v3(-144 - 97, 0, 143),
        //         fixed: true
        //     })], url: 'Medieval Town - Pack 1-2.obj', size: v3(10, 10, 10), position: v3(0, -1, 500)
        // }));
        // this.addChild(new GLobj({ controllers: [new Collider({
        //     size: v3(190, 200, 150),
        //     position: v3(-90, 0, 153),
        //     fixed: true
        // })], url: 'Nuclear Survival - Pack 6 - m.obj', size: v3(10, 10, 10), position: v3(0, -6, 300), rotation: v3(0, -Math.PI / 2, 0) }));

        // this.addChild(this.test = new TestObj({ size: v3(1, 1, 1) }));


        // this.sky = this.addChild(new Sky()) as Sky;

        // console.log(glob);


    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        this.test2d.text = this.player.globalPosition.vec.map((v) => +v.toFixed(0)).join('\n');
        // console.log(this.inputMap.axis('camera'));
        
    }


}