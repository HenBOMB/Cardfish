import { Heist, Undo } from '../../types';
import { CardImpl } from '../card';

export default class Chest extends CardImpl {

    constructor() {
        super('chest');
    }
    
    is(type: string): boolean {
        return super.is(type) || type === 'equipment';
    }

    // ? Increases value each turn
    // ? Treasure bonus is value times path difficulty.

    getValue(heist: Heist): number {
        return (
            1 +
            (this.isLit(heist)? 1 : 0) + 
            (this.isWatched(heist)? 1 : 0) 
        ) + this.getModifier('turn') * heist.path.getDiff();
    }

    select(heist: Heist): Undo {
        const value = this.getValue(heist);
        const bonus = value * heist.path.getDiff();
        const u0 = heist.thief.setScore(heist.thief.getScore() + bonus);
        const u1 = heist.thief.setValue(heist.thief.getValue() - value);
        const u2 = super.select(heist);
        return () => {
            u0();
            u1();
            u2();
        }
    }
}
