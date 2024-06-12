import { GLCuboid } from '../../gl/cuboid';
import { Vector3, v3 } from '../../utils/vector3';
import { GLGroup } from '../../gl/group';
import { TickerReturnData } from '../../utils/ticker';

export class Sky extends GLGroup {
    clouds: GLCuboid[] = [];
    bigClouds: GLCuboid[] = [];

    // constructor(attr: GlElementAttributes ) {
    //     super(attr);
    // }

    createBigCloud(p: Vector3 = v3(0), s: Vector3 = v3(2000,0,2000)) {
        const c = new GLCuboid({ position: p, size: s, colors: [[0.9,0.9,0.9,1]], opacity: 0.9 });
        this.bigClouds.push(c);
        this.addChild(c);
    }
    createCloud(p: Vector3 = v3(0), s: Vector3 = v3(500,0,500)) {
        const c = new GLCuboid({ position: p, size: s, colors: [[1,1,1,1]], opacity: 0.9 });
        this.clouds.push(c);
        this.addChild(c);
    }

    spawnBigCloudLayerZ(z: number = 0) {
        for (let x = 0; x < 10; x++) {
            if (Math.random() < 0.15){
                this.createBigCloud(v3(x*2000-10000,2000,z*2000-10000));
            }
        }
    }

    spawnBigCloudLayerX(x: number = 0) {
        for (let z = 0; z < 10; z++) {
            if (Math.random() < 0.15){
                this.createBigCloud(v3(x*2000-10000,2000,z*2000-10000));
            }
        }
    }
    spawnCloudLayerZ(z: number = 0) {
        for (let x = 0; x < 40; x++) {
            if (Math.random() < 0.1){
                this.createCloud(v3(x*500-10000,900,z*500-10000));
            }
        }
    }

    spawnCloudLayerX(x: number = 0) {
        for (let z = 0; z < 40; z++) {
            if (Math.random() < 0.1){
                this.createCloud(v3(x*500-10000,900,z*500-10000));
            }
        }
    }

    build() {
        for (let x = 0; x < 40; x++) {
            this.spawnCloudLayerX(x);
        }
        for (let x = 0; x < 40; x++) {
            this.spawnBigCloudLayerX(x);
        }
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);

        this.clouds.forEach(c => {
            c.position.x += obj.interval/60;
            // c.position.z += obj.interval/0;
        });

        this.bigClouds.forEach(c => {
            c.position.x += obj.interval/90;
            // c.position.z += obj.interval/60;
        });

        const Xend = this.clouds.filter(c => c.position.x> 10000);
        if (Xend.length > 0){
            Xend.forEach((c)=>{
                
                this.clouds.splice(this.clouds.indexOf(c), 1);
                this.removeChild(c);
            });
            this.spawnCloudLayerX();
        }
        // const Zend = this.clouds.filter(c => c.position.z> 30000);
        // if (Zend.length > 0){
        //     Zend.forEach((c)=>{
        //         this.clouds.splice(this.clouds.indexOf(c), 1);
        //         this.removeChild(c);
        //     });
        //     this.spawnCloudLayerZ();
        // }

        const bigXend = this.bigClouds.filter(c => c.position.x> 30000);
        if (bigXend.length > 0){
            bigXend.forEach((c)=>{
                this.bigClouds.splice(this.bigClouds.indexOf(c), 1);
                this.removeChild(c);
            });
            this.spawnBigCloudLayerX();
        }
        // const bigZend = this.bigClouds.filter(c => c.position.z> 20000);
        // if (bigZend.length > 0){
        //     bigZend.forEach((c)=>{
        //         this.bigClouds.splice(this.bigClouds.indexOf(c), 1);
        //         this.removeChild(c);
        //     });
        //     this.spawnBigCloudLayerZ();
        // }
    }
}