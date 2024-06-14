type EasingFunction = (progress: number) => number;

interface EasingDictionary {
    [easing: string]: EasingFunction;
}

export abstract class ease {
    linear(x:number) {
        return x;
    }
    easeInQuad(x:number) {
        return x * x;
    }
    easeOutQuad(x:number) {
        return 1 - (1 - x) * (1 - x);
    }
    easeInOutQuad(x:number) {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }
    easeInCubic(x:number) {
        return x * x * x;
    }
    easeOutCubic(x:number) {
        return 1 - Math.pow(1 - x, 3);
    }
    easeInOutCubic(x:number) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
    easeInQuart(x:number) {
        return x * x * x * x;
    }
    easeOutQuart(x:number) {
        return 1 - Math.pow(1 - x, 4);
    }
    easeInOutQuart(x:number) {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    }
    easeInQuint(x:number) {
        return x * x * x * x * x;
    }
    easeOutQuint(x:number) {
        return 1 - Math.pow(1 - x, 5);
    }
    easeInOutQuint(x:number) {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
    easeInSine(x:number) {
        return 1 - Math.cos((x * Math.PI) / 2);
    }
    easeOutSine(x:number) {
        return Math.sin((x * Math.PI) / 2);
    }
    easeInOutSine(x:number) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    easeInExpo(x:number) {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    }
    easeOutExpo(x:number) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }
    easeInOutExpo(x:number) {
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? Math.pow(2, 20 * x - 10) / 2
                    : (2 - Math.pow(2, -20 * x + 10)) / 2;
    }
    easeInCirc(x:number) {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
    }
    easeOutCirc(x:number) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }
    easeInOutCirc(x:number) {
        return x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }
    easeInBack(x:number) {
        return 2.70158 * x * x * x - 1.70158 * x * x;
    }
    easeOutBack(x:number) {
        return 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
    }
    easeInOutBack(x:number) {
        return x < 0.5
            ? (Math.pow(2 * x, 2) * (7.18982 * x - 2.59491)) / 2
            : (Math.pow(2 * x - 2, 2) * (3.59491 * (x * 2 - 2) + 2.59491) + 2) / 2;
    }
};