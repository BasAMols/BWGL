import { GLobj } from './obj';

export class ObjStorage{
    private registered: Record<string, {
        ready: boolean,
        origin: GLobj,
        using: GLobj[]
    }> = {}
    
    public check(url: string) {
        const item = Object.entries(this.registered).find(([u])=>u===url);
        return item?item[1]:false;
    }
    public register(url: string, user: GLobj) {
        const o = this.check(url);
        if (o){
            o.using.push(user)
            if (o.ready){
                this.callBack(user, o.origin);
            }
            return false
        } else {
            this.registered[url] = {
                ready: false,
                origin: user,
                using: [],
            }
            return true
        }
    }
    public callBack(user: GLobj, origin: GLobj) {
        user.giveData(origin.getData());
        user.build();
    }
    public loaded(url: string) {
        const o = this.check(url);
        if(o && !o.ready){
            o.ready = true;
            o.using.forEach((user:GLobj)=>this.callBack(user, o.origin));
        }
    }
}