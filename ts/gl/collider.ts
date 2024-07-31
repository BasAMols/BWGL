import { Util } from './util/utils';
import { Vector3, v3 } from './math/vector3';
import { Zone, ZoneType } from './zone';


export class Collider extends Zone {
    public zoneType: ZoneType = 'collider';
    
    calculateCollision(): Vector3[] {
        this.calculateOverlaps();
        return this.overlaps.filter((o)=>o.zoneType === 'collider').map(this.calculateExitVelocity.bind(this)) || [];
    }

    public calculateExitVelocity(othr: Zone): Vector3 {
        return Util.closestVectorMagniture([
            v3(-(this.globalPosition.x + this.size.x - othr.globalPosition.x), 0, 0),// to the x- of other
            v3((othr.globalPosition.x + othr.size.x) - this.globalPosition.x, 0, 0),// to the x+ of other

            v3(0, -(this.globalPosition.y + this.size.y - othr.globalPosition.y), 0),// to the y- of other
            v3(0, (othr.globalPosition.y + othr.size.y) - this.globalPosition.y, 0),// to the y+ of other

            v3(0, 0, -(this.globalPosition.z + this.size.z - othr.globalPosition.z)),// to the z- of other
            v3(0, 0, (othr.globalPosition.z + othr.size.z) - this.globalPosition.z),// to the z+ of other

        ], 0);
    }
}