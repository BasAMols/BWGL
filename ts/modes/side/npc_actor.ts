import { GLCuboid } from '../../gl/objects/cuboid';
import { Character } from '../../gl/character';
import { Vector3 } from '../../gl/math/vector3';
import { GlElement } from '../../gl/elementBase';
import { npcSkeleton } from './npc_skeleton';
import { HumanSkeleton } from '../../gl/animation/skeleton_human';

export class NPC extends Character {
    public stat: Record<string, boolean> = { jumping: false, falling: false, running: false, fallAnimation: false };
    public mesh: GLCuboid;
    public skeleton: HumanSkeleton;

    constructor({
        position = Vector3.f(0),
        size = Vector3.f(0),
        rotation = Vector3.f(0)
    }: {
        position?: Vector3;
        size?: Vector3;
        rotation?: Vector3;
    } = {}) {
        super({
            position: position,
            size: size,
            rotation: rotation,
            anchorPoint: size.multiply(0.5, 0, 0.5),
        });
    }

    build() {
        GlElement.registerControllers(this);
        this.skeleton = new npcSkeleton();
        this.addChild(this.skeleton);
    }
}