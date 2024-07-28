import { GlElementAttributes } from '../gl/elementBase';
import { GlElementType } from '../gl/glRenderer';
import { GlController } from '../gl/controller';


export type ZoneAttributes = GlElementAttributes & {
    fixed: boolean;
};

export type ZoneType = 'collider' | 'trigger' | 'interact';
export abstract class Zone extends GlController {
    public type: GlElementType = 'collider';
    public fixed: boolean;
    public abstract zoneType: ZoneType;
    public overlaps: Zone[] = [];

    public constructor(attr: ZoneAttributes) {
        super(attr);
        this.fixed = Boolean(attr.fixed);
    }

    public calculateOverlaps() {
        this.overlaps = this.level.levelZones.filter(this.overlap.bind(this)) || [];
    }

    public overlap(othr: Zone): boolean {
        //myself
        if (this === othr) return false;
        
        //fixed objects dont react
        if (this.fixed) return false;

        //do these NOT overlap?
        if (this.globalPosition.x + this.size.x < othr.globalPosition.x) return false; // to the x- of other
        if (this.globalPosition.x > othr.globalPosition.x + othr.size.x) return false; // to the x+ of other
        if (this.globalPosition.y + this.size.y < othr.globalPosition.y) return false; // to the y- of other
        if (this.globalPosition.y > othr.globalPosition.y + othr.size.y) return false; // to the y+ of other
        if (this.globalPosition.z + this.size.z < othr.globalPosition.z) return false; // to the z- of other
        if (this.globalPosition.z > othr.globalPosition.z + othr.size.z) return false; // to the z+ of other

        return true;
    }
}