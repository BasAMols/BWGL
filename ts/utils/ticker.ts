import { Vector2 } from './vector2';

export type TickerReturnData = {interval: number, total: number}
export type TickerCallback = (obj: TickerReturnData) => void;
export class Ticker {
    private callbacks: TickerCallback[] = [];
    private sTime: number;
    public get startTime() {
        return this.sTime;
    }
    private eTime: number;
    public get elapsed() {
        return this.eTime;
    }
    private pTime: number;
    
    private fFrame(time: number) {
        this.sTime = time;
        this.pTime = time;
        window.requestAnimationFrame(this.frame.bind(this));
    }
    private frame(timeStamp: number) {
        const interval = timeStamp - this.pTime;
        this.eTime = timeStamp - this.sTime;
        this.pTime = timeStamp;

        const o = {
            interval,
            total: this.eTime,
        }

        this.callbacks.forEach((c) => {
            c(o);
        });

        window.requestAnimationFrame(this.frame.bind(this));
    }

    public start() {
        window.requestAnimationFrame(this.fFrame.bind(this));
    }

    public add(callback: TickerCallback) {
        this.callbacks.push(callback);
    }
}
