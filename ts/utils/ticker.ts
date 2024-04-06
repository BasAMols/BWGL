export type TickerReturnData = { interval: number, total: number, frameRate: number, frame: number; };
export type TickerCallback = (obj: TickerReturnData) => void;
export class Ticker {
    private _running: boolean = false;
    private started: boolean = false;
    private pauzedTime: number = 0;
    private id: number;
    public get running(): boolean {
        return this._running;
    }
    public set running(value: boolean) {
        this._running = value;
        
        if (value) {
            this.pTime = performance.now() - this.pauzedTime;
            this.id = window.requestAnimationFrame(this.frame.bind(this));
        } else {
            window.cancelAnimationFrame(this.id);
            this.pauzedTime = performance.now() - this.pTime
            
        }
    }
    constructor() {
        document.addEventListener("visibilitychange", () => {
            if (this.started) {
                this.running = !document.hidden;
            }
        });
    }
    private callbacks: TickerCallback[] = [];
    private sTime: number;
    public get startTime() {
        return this.sTime;
    }
    private eTime: number;
    // public get elapsed() {
    //     return this.eTime;
    // }
    private pTime: number;
    private frameN: number = 0;

    private frame(timeStamp: number) {

        if (this.running) {
            const interval = timeStamp - this.pTime;
            this.pTime = timeStamp;
            this.frameN++;

            const o = {
                interval,
                total: this.eTime,
                frameRate: 1000 / interval,
                frame: this.frameN,
            };

            this.callbacks.forEach((c) => {
                c(o);
            });

            this.id = window.requestAnimationFrame(this.frame.bind(this));
        }
    }

    public start() {
        this.started = true;
        this._running = true;
        this.sTime = performance.now();
        this.pTime = performance.now();
        this.id = window.requestAnimationFrame(this.frame.bind(this));
    }

    public add(callback: TickerCallback) {
        this.callbacks.push(callback);
    }
}
