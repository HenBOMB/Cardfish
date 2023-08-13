import { CardImpl } from '../card';
import { Heist, Card, Undo } from '../../types';
import { Obstacle } from '../types';

export default class Torch extends Obstacle {

    private _lit: boolean = true;

    constructor() {
        super('torch');
    }

    isLit(heist: Heist): boolean {
        return this._lit;
    }

    getValue(heist: Heist): number {
        return (
            (this.isLit(heist)? 1 : 0) + 
            (this.isWatched(heist)? 1 : 0)
        ) * heist.path.getDiff();
    }
    
    select(heist: Heist): Undo {
        const torch = this;
        const value = torch.getValue(heist);
        const u = super.select(heist);
        const lit = torch._lit;

        torch._lit = false;
        const uu = heist.thief.setValue(heist.thief.getValue() - value);

        return () => {
            u();
            torch._lit = lit;
            uu();
        }
    }
}

