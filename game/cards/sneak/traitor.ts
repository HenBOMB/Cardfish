import { CardImpl } from '../card';
import { Heist, Stealth, Undo } from '../../types';

export default class Traitor extends CardImpl {
    
    constructor() {
        super('traitor');
    }
    
    is(type: string): boolean {
        return super.is(type) || type === 'sneak';
    }
    
    getValue(heist: Heist): number {
        return (
            1 + 
            (this.isWatched(heist)? 1 : 0) + 
            (this.isLit(heist)? 1 : 0)
        ) * heist.path.getDiff();
    }

    select(heist: Heist): Undo {
        // * Replenishes stealth points and takes away treasures
        const value = this.getValue(heist);
        const uu = heist.thief.setValue(heist.thief.getValue() + value);
        const uuu = heist.thief.setScore(value > heist.thief.getScore()? 0 : (heist.thief.getScore() - value));
        const u = super.select(heist);

        return () => {
          u();
          uu();
          uuu();
        }
      }
}
