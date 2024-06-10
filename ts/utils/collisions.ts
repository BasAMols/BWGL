import { GlElement } from '../gl/elementBase';
import { Collider } from './collider';
import { Vector3 } from './vector3';

export abstract class Collisions {

    public static boxesOverlap(aP: Vector3, aS: Vector3, bP: Vector3, bS: Vector3): boolean {
        // return (
        //     Collisions.pointInBox(v3(aP.x, aP.y, aP.z), bP, bS) || 
        //     Collisions.pointInBox(v3(aP.x, aP.y, aP.z+aS.z), bP, bS) || 
        //     Collisions.pointInBox(v3(aP.x, aP.y+aS.y, aP.z), bP, bS) || 
        //     Collisions.pointInBox(v3(aP.x, aP.y+aS.y, aP.z+aS.z), bP, bS) || 
        //     Collisions.pointInBox(v3(aP.x+aS.x, aP.y, aP.z), bP, bS) || 
        //     Collisions.pointInBox(v3(aP.x+aS.x, aP.y, aP.z+aS.z), bP, bS) ||
        //     Collisions.pointInBox(v3(aP.x+aS.x, aP.y+aS.y, aP.z), bP, bS) || 
        //     Collisions.pointInBox(v3(aP.x+aS.x, aP.y+aS.y, aP.z+aS.z), bP, bS)
        // )
        return (
            aP.x < bP.x + bS.x &&
            aP.x + aS.x > bP.x &&
            aP.y < bP.y + bS.y &&
            aP.y + aS.y > bP.y &&
            aP.z < bP.z + bS.z &&
            aP.z + aS.z > bP.z
        );
    }
    public static pointInBox(p: Vector3, bP: Vector3, bS: Vector3): boolean {
        return (
            p.x < bP.x + bS.x &&
            p.x > bP.x &&
            p.y < bP.y + bS.y &&
            p.y > bP.y &&
            p.z < bP.z + bS.z &&
            p.z > bP.z
        );
    }
    public static edgeCrossesBox(p1: Vector3, p2: Vector3, boxPosition: Vector3, boxSize: Vector3): boolean {
        return (
            p1.x < boxPosition.x + boxSize.x &&
            p1.x > boxPosition.x &&
            p1.y < boxPosition.y + boxSize.y &&
            p1.y > boxPosition.y &&
            p1.z < boxPosition.z + boxSize.z &&
            p1.z > boxPosition.z
        );
    }


    private static overlapDirection(aP: Vector3, aS: Vector3, bP: Vector3, bS: Vector3, v: Vector3): (['x', number] | ['y', number])[] {
        let result: (['x', number] | ['y', number])[] = [];

        if (Collisions.boxesOverlap(aP, aS, new Vector3(bP.x, bP.y + v.y), bS)) {
            result.push(v.y > 0 ? ['y', aP.y - bP.y - bS.y] : ['y', aP.y + aS.y - bP.y]);
        }

        if (Collisions.boxesOverlap(aP, aS, new Vector3(bP.x + v.x, bP.y), bS)) {
            result.push(v.x < 0 ? ['x', aP.x + aS.x - bP.x] : ['x', aP.x - bP.x - bS.x]);
        }

        return result;
    }

    static check(statics: Collider[], dynamic: GlElement, velocity: Vector3): Collider[]|undefined{
        
        return statics.filter((s) => 
            Collisions.boxesOverlap(s.position, s.size, dynamic.position.add(velocity), dynamic.size)
            
            // r.push(...Collisions.overlapDirection(s.position.add(s.parent instanceof Level ? v3(0) : s.parent.position), s.size, dynamic[0], dynamic[1], velocity));
            // if (!s.condition || s.condition()){
            // }
        );

        // return r;
    }
}