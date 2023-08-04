import { CardImpl } from '../card';
import { Heist, Undo } from '../../types';

export default class Pouch extends CardImpl {

    constructor() {
        super('pouch');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'treasure';
    }

    getValue(heist: Heist): number {
        return (1 +
            (this.isLit(heist)? 1 : 0) + 
            (this.isWatched(heist)? 1 : 0)
        ) * heist.path.getDiff();
    }

    select(heist: Heist): Undo {
        const uu = heist.thief.setScore(heist.thief.getScore() + this.getValue(heist));
        const u = super.select(heist);
        return () => {
            u();
            uu();
        }
    }
}
