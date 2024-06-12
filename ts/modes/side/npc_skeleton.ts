import { GLobj } from '../../gl/obj';
import { v3 } from '../../utils/vector3';
import { HumanSkeleton } from '../../utils/skeleton_human';
import { TickerReturnData } from '../../utils/ticker';

export class npcSkeleton extends HumanSkeleton{
    idleTime: number = 0;
    constructor() {
        super({
            boneSizes: {
                'head': 6,
                'armUpper': 5,
                'armLower': 9,
                'hand': 0,
                'legUpper': 9,
                'legLower': 5,
                'foot': 1,
                'torso': 5.5,
                'hips': 3,
                'hipsWidth': 6,
                'shoulderWidth': 8,
            }
        })
    }

    public build(): void {
        super.build();
        this.head.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-10-Head.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(2,-9.5,2)}));
        this.torso.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-8-TorsoUpper.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(this.sizes.shoulderWidth/2,-3,1)}));
        this.hips.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-9-TorsoLower.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(3,0,1)}));
        this.lLegUpper.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-0-lLegUpper.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(3,9,1)}));
        this.rLegUpper.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-1-rLegUpper.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(-2,9,1)}));
        this.lLegLower.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-2-lLegLower.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(3,14.4,1.5)}));
        this.rLegLower.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-3-rLegLower.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(-2,14.4,1.5)}));
        this.lArmUpper.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-4-lArmUpper.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,Math.PI/2), position: v3(8.5,7,1)}));
        this.rArmUpper.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-5-rArmUpper.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,-Math.PI/2), position: v3(-7.5,7,1)}));
        this.lArmLower.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-6-lArmLower.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,Math.PI/2), position: v3(8.5,16,1)}));
        this.rArmLower.addChild(new GLobj({colorIntensity: 0.7, url: 'worker/worker-7-rArmLower.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,-Math.PI/2), position: v3(-7.5,16,1)}));
        this.animation = {
            idle: {
                torso: [0.02, []],
                hips: [0.02, []],
                head: [0.005, [0, 0.5]],
                lArmUpper: [0.03, []],
                lArmLower: [0.03, []],
                lHand: [0.03, []],
                rArmUpper: [0.03, []],
                rArmLower: [0.03, []],
                rHand: [0.03, []],
                lLegUpper: [0.04, []],
                lLegLower: [0.05, []],
                lFoot: [0.03, []],
                rLegUpper: [0.03, []],
                rLegLower: [0.03, []],
                rFoot: [0.03, []],
            },
            idle2: {
                torso: [0.02, []],
                hips: [0.02, []],
                head: [0.005, [0, -0.5]],
                lArmUpper: [0.03, []],
                lArmLower: [0.03, []],
                lHand: [0.03, []],
                rArmUpper: [0.03, []],
                rArmLower: [0.03, []],
                rHand: [0.03, []],
                lLegUpper: [0.04, []],
                lLegLower: [0.05, []],
                lFoot: [0.03, []],
                rLegUpper: [0.03, []],
                rLegLower: [0.03, []],
                rFoot: [0.03, []],
            },
        };
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        this.idleTime = (this.idleTime + obj.interval) % 12000;
        this.setPose(this.idleTime < 6000 ? 'idle' : 'idle2');
    }
}