import { Collider } from '../../../classes/collider';
import { GlController } from '../../../classes/controller';
import { v2 } from '../../../classes/math/vector2';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { TickerReturnData } from '../../../classes/ticker';
import { Util } from '../../../classes/util/utils';
import { TopLevel } from '../level';
import { Player } from './player_actor';


export class PlayerController extends GlController {
    private intr: Record<string, number> = {};
    private stat: Record<string, boolean> = { running: false, holding: false };
    private cnst = { runTime: 50, runSlowDownFactor: 0.6, runSpeed: 0.15 } as const;
    private velocity: Vector3 = Vector3.f(0);
    private newPosition: Vector3;
    public parent: Player;

    public setter(key: string, cond: boolean, interval: number) {
        this.intr[key] = Util.clamp((this.intr[key] || 0) + (cond ? interval : -(interval * this.cnst.runSlowDownFactor)), 0, this.cnst.runTime);
    }

    public setMovementVelocity(interval: number) {
        const input = this.axis('movement');
        this.setter('right', input.x === 1, interval);
        this.setter('left', input.x === -1, interval);
        this.setter('up', input.y === 1, interval);
        this.setter('down', input.y === -1, interval);

        const plane = v2(
            (this.intr.right - this.intr.left) / this.cnst.runTime,
            (this.intr.up - this.intr.down) / this.cnst.runTime,
        ).clampMagnitude(1).scale(this.cnst.runSpeed);

        
        this.velocity = v3(
            plane.x,
            0,
            plane.y
        );
    }

    public setVelocity(obj: TickerReturnData) {
        this.setMovementVelocity(obj.intervalS10);

        const sc = this.velocity.scale(obj.intervalS10 / 6);
        if (sc.xz.magnitude() > 0) {
            const [x, z] = sc.xz.rotate(-this.camera.rotation.y).array;
            this.newPosition = this.parent.position.add(v3(x, sc.y, z));
            if (!this.axis('movement').isZero()) {
                this.parent.rotation = this.camera.rotation.multiply(0, 1, 0).add(v3(0, Math.PI / 2, 0)).add(v3(0, -sc.xz.angle(), 0));
            }
            this.parent.stat.running = true;
        } else {
            this.newPosition = this.parent.position.add(v3(0, sc.y, 0));
            this.parent.stat.running = false;
        }
    }


    public collide(obj: TickerReturnData) {
        this.parent.stat.ground = false;
        const collisions = (this.parent.zones[0] as Collider)?.calculateCollision();
        
        collisions.forEach((v: Vector3) => {
            this.velocity.subtract(v);
            this.parent.position = this.newPosition.clone();
            this.newPosition = this.newPosition.add(v);
        });
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.setVelocity(obj);
        this.collide(obj);
        this.parent.position = this.newPosition.clone();
        if (this.button('interact')) {
            (this.parent.level as TopLevel).box.carrier = this.parent;
            this.parent.stat.holding = true;
        } else {
            (this.parent.level as TopLevel).box.carrier = undefined;
            this.parent.stat.holding = false;
        }
        

    }
}