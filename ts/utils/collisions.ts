import { Collider } from './collider';
import { Level } from './level';
import { Vector2 } from './vector2';

export abstract class Collisions {

    public static overlap(aP: Vector2, aS: Vector2, bP: Vector2, bS: Vector2): boolean {
        return aP.x < bP.x + bS.x && aP.x + aS.x > bP.x && aP.y < bP.y + bS.y && aP.y + aS.y > bP.y;
    }

    private static overlapDirection(aP: Vector2, aS: Vector2, bP: Vector2, bS: Vector2, v: Vector2): (['x', number] | ['y', number])[] {
        let result: (['x', number] | ['y', number])[] = [];

        if (Collisions.overlap(aP,aS,new Vector2(bP.x, bP.y + v.y),bS)) {
            result.push(v.y > 0?['y', aP.y - bP.y - bS.y]: ['y', aP.y + aS.y - bP.y]); 
        }

        if (Collisions.overlap(aP,aS,new Vector2(bP.x + v.x, bP.y),bS)) {
            result.push(v.x < 0? ['x', aP.x + aS.x - bP.x]: ['x', aP.x - bP.x - bS.x]); 
        }

        return result;
    }

    static check(statics: Collider[], dynamic: Collider, velocity: Vector2): (['x', number] | ['y', number])[] {
        const r:(['x', number] | ['y', number])[] = [];

        statics.forEach((s) => {
            if (!s.condition || s.condition()){
                r.push(...Collisions.overlapDirection(s.position.add(s.parent instanceof Level? Vector2.zero: s.parent.position ), s.size, dynamic.position, dynamic.size, velocity))
            }
        });

        return r
    }
}