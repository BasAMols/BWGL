import { Character } from '../../../classes/character';
import { Collider } from '../../../classes/collider';
import { GlElement } from '../../../classes/elementBase';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { GLCuboid } from '../../../classes/objects/cuboid';
import { FBXScene } from '../../../classes/objects/fbxScene';
import { ForkliftCamera } from './forkliftCamera';
import { DriverSkel } from './driver_skeleton';
import { ForkliftController } from './forklift_controller';

export class Forklift extends Character {
    public mesh: GLCuboid;
    public body: FBXScene;
    public pillar: FBXScene;
    public pillar2: FBXScene;
    public fork: FBXScene;
    public frontwheels: FBXScene;
    public rearrightwheel: FBXScene;
    public rearleftwheel: FBXScene;

    public stat: Record<string, boolean> = { driving: false };
    public driver: DriverSkel;
    public cameraController: ForkliftCamera;

    public constructor({
        position = Vector3.f(0),
    }: {
        position?: Vector3;
        rotation?: Vector3;
    } = {}) {
        super({
            position: position,
            size: v3(20, 19, 11),
            anchorPoint: v3(5, 0, 5.5),
        });

        this.addControllers([
            new Collider({
                size: this.size,
                position: v3(0, 0, 0),
                fixed: false,
            }),
            new ForkliftController(this),
            (this.cameraController = new ForkliftCamera(this))
        ]);
        GlElement.registerControllers(this);

        this.addChild((this.driver = new DriverSkel()));
        this.setDriving(false);
    }

    build() {
        super.build();

        this.addChild((this.body = new FBXScene({ url: '/warehouse/forklift/Forklift.fbx', position: v3(8, 0, 5) })));
        this.body.addChild((this.pillar = new FBXScene({ url: '/warehouse/forklift/lift1.fbx', anchorPoint: v3(-0.558895 * 10, 0.745322 * 10, 0.052947 * 10), position: v3(0, 0, 0) })));
        this.pillar.addChild((this.pillar2 = new FBXScene({ url: '/warehouse/forklift/lift2.fbx', anchorPoint: v3(-0.558895 * 10, 0.745322 * 10, 0.052947 * 10), position: v3(0, 0, 0) })));
        this.pillar2.addChild((this.fork = new FBXScene({ url: '/warehouse/forklift/fork.fbx', position: v3(0, 0, 0) })));
        this.body.addChild((this.frontwheels = new FBXScene({ url: '/warehouse/forklift/frontWheels.fbx', anchorPoint: v3(-0.357886 * 10, 0.334791 * 10, -0.050639 * 10), position: v3(0, 0, 0) })));
        this.body.addChild((this.rearrightwheel = new FBXScene({ url: '/warehouse/forklift/rearRightWheel.fbx', anchorPoint: v3(0.906661 * 10, 0.258706 * 10, 0.526077 * 10) })));
        this.body.addChild((this.rearleftwheel = new FBXScene({ url: '/warehouse/forklift/rearLeftWheel.fbx', anchorPoint: v3(0.906661 * 10, 0.258706 * 10, -0.41921 * 10) })));
    }

    setDriving(v: boolean) {
        this.stat.driving = v;
        this.driver.visible = v;
        this.cameraController.active = v;
    }
}