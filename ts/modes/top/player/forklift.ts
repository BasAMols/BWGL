import { Character } from '../../../classes/character';
import { Collider } from '../../../classes/collider';
import { GlElement } from '../../../classes/elementBase';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { GLCuboid } from '../../../classes/objects/cuboid';
import { FBXScene } from '../../../classes/objects/fbxScene';
import { TickerReturnData } from '../../../classes/ticker';
import { Util } from '../../../classes/util/utils';

export class Forklift extends Character {
    public mesh: GLCuboid;
    private body: FBXScene;
    private pillar: FBXScene;
    private fork: FBXScene;
    private frontwheels: FBXScene;
    private rearrightwheel: FBXScene;
    private rearleftwheel: FBXScene;
    private intr: Record<string, number> = {
        turn: 0,
        angle: 0,
        lift: 0,
        speed: 1,
    };
    private cnst: Record<string, number> = {
        maxTurn: 0.5,
        maxAngle: 0.25,
        maxLift: 14,
        maxSpeed: 0.01,
        liftSpeed: 0.1,
        turnSpeed: 0.1,
        angleSpeed: 0.1,
    };
    turnValue: number;
    angleValue: number;
    liftValue: number;

    constructor({
        position = Vector3.f(0),
    }: {
        position?: Vector3;
        rotation?: Vector3;
    } = {}) {
        super({
            position: position,
            size: v3(20, 19, 11),
        });
    }

    build() {
        super.build();
        this.addControllers([
            new Collider({
                size: this.size,
                position: v3(0, 0, 0),
                fixed: false,
            }),
        ]);
        GlElement.registerControllers(this);

        //-x, z, y for anchor point from blender 3d cursor
        const x = -0.906661  * 10, y = -0.526077 * 10, z = 0.258706 * 10;

        this.body = new FBXScene({ url: '/warehouse/Forklift.fbx', size: v3(1), position: v3(8, 0, 4.5) });
        this.addChild(this.body);
        this.pillar = new FBXScene({ url: '/warehouse/lift.fbx', size: v3(1), anchorPoint: v3(-0.558895 * 10, 0.745322 * 10, 0.052947 * 10), position: v3(0, 0, 0) });
        this.body.addChild(this.pillar);
        this.fork = new FBXScene({ url: '/warehouse/fork.001.fbx', size: v3(1), position: v3(0, 0, 0) });
        this.pillar.addChild(this.fork);
        this.frontwheels = new FBXScene({ url: '/warehouse/frontWheels.fbx', size: v3(1), anchorPoint: v3(-0.357886 * 10, 0.334791 * 10, -0.050639 * 10), position: v3(0, 0, 0) });
        this.body.addChild(this.frontwheels);
        this.rearrightwheel = new FBXScene({ url: '/warehouse/rearRightWheel.fbx', size: v3(1), anchorPoint: v3(0.906661  * 10, 0.258706 * 10, 0.526077 * 10) });
        this.body.addChild(this.rearrightwheel);
        this.rearleftwheel = new FBXScene({ url: '/warehouse/rearLeftWheel.fbx', size: v3(1), anchorPoint: v3(0.906661  * 10, 0.258706 * 10, -0.41921 * 10) });
        this.body.addChild(this.rearleftwheel);
        this.setAngle(0);
        this.setLift(0);
        this.setTurn(0);
    }

    public angle(v: 1|-1) {
        this.setAngle(this.intr.angle + v * this.cnst.angleSpeed);
    }
    private setAngle(v: number) {
        this.intr.angle = Util.clamp(v, 0, 1);
        this.pillar.rotation = v3(0, 0, this.intr.angle * this.cnst.maxAngle);
    }
    public lift(v: 1|-1) {
        this.setLift(this.intr.lift + v * this.cnst.liftSpeed);
    }
    private setLift(v: number) {
        this.intr.lift = Util.clamp(v, 0, 1);
        this.fork.position.y = this.intr.lift * 14;
    }
    public turn(v: 1|-1) {
        this.setTurn(this.intr.turn + v * this.cnst.turnSpeed);
    }
    private setTurn(v: number) {
        this.intr.turn = Util.clamp(v, -1, 1);
        this.rearrightwheel.rotation.y = v * -0.5;
        this.rearleftwheel.rotation.y = v * -0.5;
    }


    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        
        // this.position.x += this.intr.speed * -this.cnst.maxSpeed * obj.intervalS10;
        this.frontwheels.rotation.z = (this.frontwheels.rotation.z - (this.intr.speed * this.cnst.maxSpeed));
        this.rearrightwheel.rotation.z = (this.rearrightwheel.rotation.z - (this.intr.speed * this.cnst.maxSpeed));
        this.rearleftwheel.rotation.z= (this.rearleftwheel.rotation.z - (this.intr.speed * this.cnst.maxSpeed));
    }
}