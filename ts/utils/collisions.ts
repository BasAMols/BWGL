import { GlElement } from '../gl/elementBase';
import { Collider } from './collider';
import { Vector3 } from './vector3';

export abstract class Collisions {

    public static overlap(aP: Vector3, aS: Vector3, bP: Vector3, bS: Vector3): boolean {
        return (
            aP.x < bP.x + bS.x &&
            aP.x + aS.x > bP.x &&
            aP.y < bP.y + bS.y &&
            aP.y + aS.y > bP.y &&
            aP.z < bP.z + bS.z &&
            aP.z + aS.z > bP.z
        );
    }

    private static overlapDirection(aP: Vector3, aS: Vector3, bP: Vector3, bS: Vector3, v: Vector3): (['x', number] | ['y', number])[] {
        let result: (['x', number] | ['y', number])[] = [];

        if (Collisions.overlap(aP, aS, new Vector3(bP.x, bP.y + v.y), bS)) {
            result.push(v.y > 0 ? ['y', aP.y - bP.y - bS.y] : ['y', aP.y + aS.y - bP.y]);
        }

        if (Collisions.overlap(aP, aS, new Vector3(bP.x + v.x, bP.y), bS)) {
            result.push(v.x < 0 ? ['x', aP.x + aS.x - bP.x] : ['x', aP.x - bP.x - bS.x]);
        }

        return result;
    }

    static check(statics: Collider[], dynamic: GlElement, velocity: Vector3): Collider[]|undefined{
        
        return statics.filter((s) => 
            Collisions.overlap(s.position, s.size, dynamic.position.add(velocity), dynamic.size)
            
            // r.push(...Collisions.overlapDirection(s.position.add(s.parent instanceof Level ? v3(0) : s.parent.position), s.size, dynamic[0], dynamic[1], velocity));
            // if (!s.condition || s.condition()){
            // }
        );

        // return r;
    }
}