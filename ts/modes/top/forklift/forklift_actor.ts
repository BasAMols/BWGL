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
    public pillarOut: FBXScene;
    public pillarMid: FBXScene;
    public fork: FBXScene;
    public frontwheels: FBXScene;
    public rearrightwheel: FBXScene;
    public rearleftwheel: FBXScene;

    public stat: Record<string, boolean> = { driving: false };
    public driver: DriverSkel;
    public cameraController: ForkliftCamera;
    pillarIn: FBXScene;
    pillarCylinder: FBXScene;
    pillarCarriage: FBXScene;
    steering: FBXScene;

    public constructor({
        position = Vector3.f(0),
    }: {
        position?: Vector3;
        rotation?: Vector3;
    } = {}) {
        super({
            position: position,
            size: v3(25.5, 21, 12),
            anchorPoint: v3(18, 0, 6),
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

        // this.addChild((new FBXScene({ url: '/warehouse/Forklift/forklift.fbx', position: v3(4.5, 0, 6) })));
        this.addChild((this.body = new FBXScene({ url: '/warehouse/Forklift/RearBumper/RearBumper.fbx', position: v3(4.5, 0, 6) })));
        this.body.addChild((this.pillarOut = new FBXScene({ url: '/warehouse/Forklift/PillarOut/PillarOut.fbx', anchorPoint: v3(1.72114 * 10, 0.802073 * 10, 0 * 10), position: v3(0, 0, 0) })));
        this.pillarOut.addChild((this.pillarMid = new FBXScene({ url: '/warehouse/Forklift/PillarMid/PillarMid.fbx', position: v3(0, 0, 0) })));
        this.pillarMid.addChild((this.pillarIn = new FBXScene({ url: '/warehouse/Forklift/PillarIn/PillarIn.fbx', position: v3(0, 0, 0) })));
        this.pillarIn.addChild((this.pillarCylinder = new FBXScene({ url: '/warehouse/Forklift/PillarCylinder/PillarCylinder.fbx', position: v3(0, 0, 0) })));
        this.pillarCylinder.addChild((this.pillarCarriage = new FBXScene({ url: '/warehouse/Forklift/Carriage/Carriage.fbx', position: v3(0, 0, 0) })));
        this.pillarCarriage.addChild((this.fork = new FBXScene({ url: '/warehouse/Forklift/Fork/Fork.fbx', position: v3(0, 0, 0) })));
        this.body.addChild((this.steering = new FBXScene({ url: '/warehouse/Forklift/Steering.002/Steering.002.fbx', anchorPoint: v3(1.197459*10, 1.35123*10, 0.111042*10), position: v3(0, 0, 0) })));
        this.body.addChild((this.frontwheels = new FBXScene({ url: '/warehouse/Forklift/FrontWheel.001/FrontWheel.001.fbx', anchorPoint: v3(1.65142*10, 0.335522*10,0.006496*10,  ), position: v3(0, 0, 0) })));
        this.body.addChild((this.rearrightwheel = new FBXScene({ url: '/warehouse/Forklift/RearWheel.003/RearWheel.003.fbx', anchorPoint: v3(0.007179 * 10, 0.272209* 10, -0.482427 * 10) })));
        this.body.addChild((this.rearleftwheel = new FBXScene({ url: '/warehouse/Forklift/RearWheel.002/RearWheel.002.fbx', anchorPoint: v3(0.007179 * 10, 0.272209* 10, 0.482427 * 10) })));
    }

    setDriving(v: boolean) {
        this.stat.driving = v;
        this.driver.visible = v;
        this.cameraController.active = v;
    }
}