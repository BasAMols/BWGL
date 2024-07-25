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
        return this.worldPosition.add(this.size.multiply(0.5,0,0.5))
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
        if (this.worldPosition.x + this.size.x < othr.worldPosition.x) return; // to the x- of other
        if (this.worldPosition.x > othr.worldPosition.x + othr.size.x) return; // to the x+ of other
        if (this.worldPosition.y + this.size.y < othr.worldPosition.y) return; // to the y- of other
        if (this.worldPosition.y > othr.worldPosition.y + othr.size.y) return; // to the y+ of other
        if (this.worldPosition.z + this.size.z < othr.worldPosition.z) return; // to the z- of other
        if (this.worldPosition.z > othr.worldPosition.z + othr.size.z) return; // to the z+ of other

        // console.log(this, );
        

        //fixed objects dont react
        if (this.fixed) return v3(0);

        this.reaction.push(Util.closestVectorMagniture(this.calculateExitVelocity(othr), 0));
    }

    private calculateExitVelocity(othr: Collider): [Vector3, Vector3, Vector3, Vector3, Vector3, Vector3] {
        return [

            v3(-(this.worldPosition.x + this.size.x - othr.worldPosition.x), 0, 0),// to the x- of other
            v3((othr.worldPosition.x + othr.size.x) - this.worldPosition.x, 0, 0),// to the x+ of other

            v3(0, -(this.worldPosition.y + this.size.y - othr.worldPosition.y), 0),// to the y- of other
            v3(0, (othr.worldPosition.y + othr.size.y) - this.worldPosition.y, 0),// to the y+ of other

            v3(0, 0, -(this.worldPosition.z + this.size.z - othr.worldPosition.z)),// to the z- of other
            v3(0, 0, (othr.worldPosition.z + othr.size.z) - this.worldPosition.z),// to the z+ of other

        ];
    }
}