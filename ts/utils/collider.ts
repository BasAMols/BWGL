import { GlElementAttributes } from '../gl/elementBase';
import { GlElementType } from '../gl/glRenderer';
import { GlController } from '../gl/controller';
import { TickerReturnData } from './ticker';
import { Vector3, v3 } from './vector3';
import { Util } from './utils';


export type ColliderAttributes = GlElementAttributes & {
    fixed: boolean;
};

export type ColliderType = 'static' | 'dynamic';

export class Collider extends GlController {
    public type: GlElementType = 'collider';
    public fixed: boolean;
    public reaction: Vector3[] = [];

    public get centeredPosition() {
        return this.globalPosition.add(this.size.multiply(0.5,0,0.5))
    }

    public constructor(attr: ColliderAttributes) {
        super(attr);
        this.fixed = Boolean(attr.fixed);
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        this.reaction = [];
        // console.log(this.level.colliders);
        
        this.level.levelColliders.forEach(this.calculateReaction.bind(this));
    }

    public calculateReaction(othr: Collider): Vector3 | null {
        //myself
        if (this === othr) return;

        //do these NOT overlap?
        if (this.globalPosition.x + this.size.x < othr.globalPosition.x) return; // to the x- of other
        if (this.globalPosition.x > othr.globalPosition.x + othr.size.x) return; // to the x+ of other
        if (this.globalPosition.y + this.size.y < othr.globalPosition.y) return; // to the y- of other
        if (this.globalPosition.y > othr.globalPosition.y + othr.size.y) return; // to the y+ of other
        if (this.globalPosition.z + this.size.z < othr.globalPosition.z) return; // to the z- of other
        if (this.globalPosition.z > othr.globalPosition.z + othr.size.z) return; // to the z+ of other

        // console.log(this, );
        

        //fixed objects dont react
        if (this.fixed) return v3(0);

        this.reaction.push(Util.closestVectorMagniture(this.calculateExitVelocity(othr), 0));
    }

    private calculateExitVelocity(othr: Collider): [Vector3, Vector3, Vector3, Vector3, Vector3, Vector3] {
        return [

            v3(-(this.globalPosition.x + this.size.x - othr.globalPosition.x), 0, 0),// to the x- of other
            v3((othr.globalPosition.x + othr.size.x) - this.globalPosition.x, 0, 0),// to the x+ of other

            v3(0, -(this.globalPosition.y + this.size.y - othr.globalPosition.y), 0),// to the y- of other
            v3(0, (othr.globalPosition.y + othr.size.y) - this.globalPosition.y, 0),// to the y+ of other

            v3(0, 0, -(this.globalPosition.z + this.size.z - othr.globalPosition.z)),// to the z- of other
            v3(0, 0, (othr.globalPosition.z + othr.size.z) - this.globalPosition.z),// to the z+ of other

        ];
    }
}