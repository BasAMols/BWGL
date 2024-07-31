export type Color = [number, number, number, number];
export class Colors {
    public static k:Color = [0.0, 0.0, 0.0, 1.0];
    public static r:Color = [1.0, 0.0, 0.0, 1.0];
    public static g:Color = [0.0, 1.0, 0.0, 1.0];
    public static b:Color = [0.0, 0.0, 1.0, 1.0];
    public static y:Color = [1.0, 1.0, 0.0, 1.0];
    public static c:Color = [0.0, 1.0, 1.0, 1.0];
    public static m:Color = [1.0, 0.0, 1.0, 1.0];
    public static w:Color = [1.0, 1.0, 1.0, 1.0];
}
export class rgba{
    constructor(public color: Color) {}
    get r(){
        return this.color[0];
    }
    get g(){
        return this.color[1];
    }
    get b(){
        return this.color[2];
    }
    get a(){
        return this.color[3];
    }
    get rgb(){
        return [this.color[1], this.color[2], this.color[3]];
    }
}