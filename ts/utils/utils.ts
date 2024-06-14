export abstract class Util{
    public static clamp(value:number, min:number, max:number) {
        return Math.max(Math.min(value, max), min);
    }
    public static to0(value:number, tolerance: number = 0.1) {
        return Math.abs(value) < tolerance ? 0 : value;
    }

    public static padArray(ar: any[], b: any, len: number) {
        return ar.concat(Array.from(Array(len).fill(b))).slice(0,len);
    }

    public static addArrays(ar: number[], br: number[]) {
        return ar.map((a, i) => a + br[i]);
    }

    public static subtractArrays(ar: number[], br: number[]) {
        return ar.map((a, i) => a - br[i]);
    }

    public static multiplyArrays(ar: number[], br: number[]) {
        return ar.map((a, i) => a * br[i]);
    }

    public static scaleArrays(ar: number[], b: number) {
        return ar.map((a, i) => a * b);
    }
    
}