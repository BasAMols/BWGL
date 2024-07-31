import { Vector3, v3 } from '../../../gl/math/vector3';
import { GLGroup } from '../../../gl/group';
import { TickerReturnData } from '../../../gl/ticker';
import { GLobj } from '../../../gl/objects/obj';

export class Sky extends GLGroup {
    clouds: GLobj[] = [];
    bigClouds: GLobj[] = [];

    // constructor(attr: GlElementAttributes ) {
    //     super(attr);
    // }

    createBigCloud(p: Vector3 = v3(0), s: Vector3 = v3(2000, 0, 2000)) {
        const sc = 200 + 100 * Math.random();
        const c = new GLobj({ position: p, rotation: v3(0, Math.random() * Math.PI * 2, 0), size: v3(sc,sc,sc), url: 'cloud2.obj' });
        this.bigClouds.push(c);
        c.opacity = 0.5;
        this.addChild(c);
    }
    createCloud(p: Vector3 = v3(0), s: Vector3 = v3(500, 0, 500)) {
        const sc = 50 + 50 * Math.random();
        const c = new GLobj({ position: p, rotation: v3(0, Math.random() * Math.PI * 2, 0), size: v3(sc,sc,sc), url: 'cloud2.obj' });
        this.addChild(c);
        c.opacity = 0.5;
        this.clouds.push(c);
    }

    spawnBigCloudLayerZ(z: number = 0) {
        for (let x = 0; x < Math.random() * 2; x++) {
            this.createBigCloud(v3(
                Math.random() * 20000 - 10000,
                500 + Math.random() * 1000,
                2000 + z * 2000 - 10000,
            ));
        }
    }

    spawnBigCloudLayerX(x: number = 0) {
        for (let z = 0; z < Math.random() * 2; z++) {
            this.createBigCloud(v3(
                x * 2000 - 10000,
                500 + Math.random() * 1000,
                Math.random() * 20000 - 10000
            ));
        }
    }
    spawnCloudLayerZ(z: number = 0) {
        for (let x = 0; x < Math.random() * 3; x++) {
            this.createCloud(v3(
                Math.random() * 20000 - 10000,
                1000 + Math.random() * 200,
                z * 500 - 10000,
            ));
        }
    }

    spawnCloudLayerX(x: number = 0) {
        for (let z = 0; z < Math.random() * 3; z++) {
            this.createCloud(v3(
                x * 500 - 10000,
                1000 + Math.random() * 200,
                Math.random() * 20000 - 10000,
            ));
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
            c.position.x += obj.interval / 60;
            // c.position.z += obj.interval/0;
        });

        this.bigClouds.forEach(c => {
            c.position.x += obj.interval / 90;
            // c.position.z += obj.interval/60;
        });

        const Xend = this.clouds.filter(c => c.position.x > 10000);
        if (Xend.length > 0) {
            Xend.forEach((c) => {

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

        const bigXend = this.bigClouds.filter(c => c.position.x > 30000);
        if (bigXend.length > 0) {
            bigXend.forEach((c) => {
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