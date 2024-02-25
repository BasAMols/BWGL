import { DomButton } from '../../dom/domButton';
import { Mode } from '../../utils/mode';
import { Vector2 } from '../../utils/vector2';
import { BouncerLevel } from './levels/bouncingSnake';
import { DiscoLevel } from './levels/discoSnake';
import { Empty } from './levels/empty';
import { FollowLevel } from './levels/followMouse';

export class SwapperMode extends Mode{
    public constructor() {
        super({hasDom: true});
        this.dom.appendChild(new DomButton({
            text: 'DISCO',
            fontSize: 39,
            fontWeight: 1000,
            color: 'black',
            position: new Vector2(130,5), 
            background: 'linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%)',
            fontFamily: 'monospace',
            padding: [0,10,0,10],
            onClick: ()=>{
                this.mode.switchLevel('disco')
            }
        }));
        this.dom.appendChild(new DomButton({
            text: 'BOUNCE',
            fontSize: 39,
            fontWeight: 1000,
            color: 'white',
            position: new Vector2(263,5), 
            background: '#ff00ffaa',
            fontFamily: 'monospace',
            padding: [0,10,0,10],
            onClick: ()=>{
                this.mode.switchLevel('bounce')
            }
        }));
    }

    build(){
        this.addLevel('disco', new DiscoLevel());
        this.addLevel('bounce', new BouncerLevel());
        this.addLevel('follow', new FollowLevel());
        this.addLevel('Empty', new Empty());
        this.switchLevel('follow');
    }
}