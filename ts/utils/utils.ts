export abstract class Util{
    public static clamp(value:number, min:number, max:number) {
        return Math.max(Math.min(value, max), min);
    }
    public static to0(value:number, tolerance: number = 0.1) {
        return Math.abs(value) < tolerance ? 0 : value;
    }
}