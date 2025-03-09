import { Collider } from '../../../classes/collider';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { TickerReturnData } from '../../../classes/ticker';
import { Util } from '../../../classes/util/utils';
import { Forklift } from './forklift_actor';
import { GlController } from '../../../classes/controller';

export class ForkliftController extends GlController {
    private intr: Record<string, number> = {
        turn: 0,
        angle: 0,
        lift: 0,
        speed: 0,
    };
    private cnst: Record<string, number> = {
        maxTurn: 0.5,
        maxAngle: 0.28,
        maxLift: 15,
        maxSpeed: 0.01,
        liftSpeed: 0.0006,
        turnSpeed: 0.01,
        angleSpeed: 0.002,

        runTime: 2500,
        runSlowDownFactor: 0.6,
        runSpeed: 0.15
    };
    public stat: Record<string, boolean> = { driving: false };
    private velocity: Vector3 = Vector3.f(0);
    private newPosition: Vector3;
    public parent: Forklift;

    public setter(key: string, cond: boolean, interval: number) {
        this.intr[key] = Util.clamp((this.intr[key] || 0) + (cond ? interval : -(interval * this.cnst.runSlowDownFactor)), 0, this.cnst.runTime);
    }

    public setMovementVelocity(interval: number) {
        const input = this.axis('movement');
        this.turn(input.x);

        this.setter('up', input.y === 1, interval);
        this.setter('down', input.y === -1, interval);

        this.intr.speed = Util.clamp((this.intr.up - this.intr.down) / this.cnst.runTime, -1, 1);

        this.velocity = v3(
            -this.intr.speed * (this.cnst.runSpeed),
            0,
            0
        ).rotateXY(-this.parent.rotation.y);


    }

    public setVelocity(obj: TickerReturnData) {
        this.setMovementVelocity(obj.intervalS10);
        this.parent.rotation.y = this.parent.rotation.y + (this.intr.speed) * this.intr.turn *  0.004*(obj.intervalS10 / 6);
        const sc = this.velocity.scale(obj.intervalS10 / 6);
        this.newPosition = this.parent.position.add(sc.xz.magnitude() > 0 ? sc : v3(0, 0, 0));
    }


    public collide(obj: TickerReturnData) {
        const collisions = (this.parent.zones[0] as Collider)?.calculateCollision();

        collisions.forEach((v: Vector3) => {
            this.velocity.subtract(v);
            this.parent.position = this.newPosition.clone();
            this.newPosition = this.newPosition.add(v);
        });
    }

    public angle(v: 1 | 0 | -1) {
        if (v !== 0) {
            this.setAngle(this.intr.angle + v * this.cnst.angleSpeed);
        }
    }
    private setAngle(v: number) {
        this.intr.angle = Util.clamp(v, 0, 1);
        this.parent.pillar.rotation = v3(0, 0, this.intr.angle * this.cnst.maxAngle);
    }
    public lift(v: 1 |0| -1) {
        if (v !== 0) {
            this.setLift(this.intr.lift + v * this.cnst.liftSpeed);
        } 
    }
    private setLift(v: number) {
        this.intr.lift = Util.clamp(v, 0, 1);
        this.parent.fork.position.y = Util.clamp(this.intr.lift*2, 0, 1) * this.cnst.maxLift;
        this.parent.pillar2.position.y =  Util.clamp(this.intr.lift*2-1, 0, 1) * this.cnst.maxLift;
    }
    public turn(v: number) {
        this.setTurn(v===0?this.intr.turn*0.99:this.intr.turn + v * this.cnst.turnSpeed);
    }
    private setTurn(v: number) {
        this.intr.turn = Util.clamp(v, -1, 1);
        this.parent.rearrightwheel.rotation.y = this.intr.turn * -this.cnst.maxTurn;
        this.parent.rearleftwheel.rotation.y = this.intr.turn * -this.cnst.maxTurn;
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        this.setVelocity(obj);
        this.collide(obj);
        this.parent.position = this.newPosition.clone();

        this.parent.frontwheels.rotation.z = (this.parent.frontwheels.rotation.z - (this.intr.speed * this.cnst.maxSpeed));
        this.parent.rearrightwheel.rotation.z = (this.parent.rearrightwheel.rotation.z - (this.intr.speed * this.cnst.maxSpeed * 1.33)); // 1/0.75 = 1.33x faster rotation for smaller wheels
        this.parent.rearleftwheel.rotation.z = (this.parent.rearleftwheel.rotation.z - (this.intr.speed * this.cnst.maxSpeed * 1.33)); // 1/0.75 = 1.33x faster rotation for smaller wheels

        this.lift(this.button('lift') as 1 | 0| -1);
        this.angle(this.button('liftAngle') as 1 | 0|  -1);
    }
}