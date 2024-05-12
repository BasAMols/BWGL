import { GlController } from '../../gl/controller';
import { Character } from '../../gl/character';
import { TickerReturnData } from '../../utils/ticker';
import { Util } from '../../utils/utils';
import { v2 } from '../../utils/vector2';
import { Vector3, v3 } from '../../utils/vector3';
import { Collisions } from '../../utils/collisions';

export class MovementController extends GlController {
    private speed = 0.8;
    private jumpHeight = 1.4;
    private velocity: Vector3 = Vector3.f(0);
    public parent: Character;
    public jumping: boolean = false;
    public jumpDuration: number = 0;
    jumpVelocity: number;

    keyDown(e: KeyboardEvent): void {
        if (!this.jumping && this.mode.input.space) {
            this.jumpVelocity = 1;
        }
    }

    jump(m: number) {
        if (this.jumpDuration !== 0 || !this.jumping) {
            this.jumping = true;
            this.velocity.y += this.jumpHeight;
        }
    }

    land() {
        this.jumpDuration = 0;
        this.jumping = false;
    }



    public tick(obj: TickerReturnData) {
        super.tick(obj);

        const m = 1 / obj.frameRate * 144;
        if (this.mode.input.space) {
            this.jump(m);
        } else {
            this.jumpDuration = 0;
        }
        // this.velocity.x = Util.to0(this.velocity.x * 0.9*m + ((this.mode.input.right ? 1 : (this.mode.input.left ? -1 : 0))*0.6 ), 0.1);
        this.velocity.x = (this.mode.input.right ? 1 : (this.mode.input.left ? -1 : 0)) * this.speed;
        this.velocity.z = (this.mode.input.up ? 1 : (this.mode.input.down ? -1 : 0)) * this.speed;
        this.velocity.y = Util.to0(this.velocity.y - (9.8 * 0.003) * m, 0.0001);

        if (this.velocity.x || this.velocity.y || this.velocity.z) {

            const frameScaledVelocity = this.velocity.scale(m);
            const rotated = v2(frameScaledVelocity.x, frameScaledVelocity.z).rotate(-this.camera.rotation.y);
            const movement = v3(
                rotated.x,
                frameScaledVelocity.y,
                rotated.y,
            );
            
            const newAbs = this.parent.absolutePosition.add(movement);
            this.level.colliders.forEach((col)=>{
                if(Collisions.overlap(col.absolutePosition, col.size, newAbs, this.parent.size)){
                    if (col.direction.equals(Vector3.up)){ // floor
                        this.velocity.y = Math.max(this.velocity.y, 0);
                        newAbs.y = col.absolutePosition.y+col.size.y;
                        if (this.jumping) this.land();
                    }
                    if (col.direction.equals(Vector3.down)){ // ceiling
                        this.velocity.y = Math.min(this.velocity.y, 0);
                        newAbs.y = col.absolutePosition.y-this.parent.size.y;
                    }
                    if (col.direction.equals(Vector3.right)){ // left wall
                        this.velocity.x = Math.max(this.velocity.x, 0);
                        newAbs.x = col.absolutePosition.x+col.size.x;
                    }
                    if (col.direction.equals(Vector3.left)){ // right wall
                        this.velocity.x = Math.min(this.velocity.x, 0);
                        newAbs.x = col.absolutePosition.x-this.parent.size.x;
                    }
                    if (col.direction.equals(Vector3.backwards)){ // left wall
                        this.velocity.z = Math.max(this.velocity.z, 0);
                        newAbs.z = col.absolutePosition.z+col.size.z;
                    }
                    if (col.direction.equals(Vector3.forwards)){ // right wall
                        this.velocity.z = Math.min(this.velocity.z, 0);
                        newAbs.z = col.absolutePosition.z-this.parent.size.z;
                    }
                }
            })

            this.parent.absolutePosition = newAbs;
            if (movement.x || movement.z) {
                this.parent.rotation = this.camera.rotation.multiply(0,1,0);
            }
        }

    }
}