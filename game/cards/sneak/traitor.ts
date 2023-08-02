import { CardImpl } from '../card';
import { Board, Stealth, Undo } from '../../types';

export interface TraitorInt extends Stealth {

}

export class TraitorImpl extends CardImpl implements TraitorInt {
    
    constructor() {
        super('traitor');
    }
    
    is(type: string): boolean {
        return super.is(type) || type === 'sneak';
    }
    
    getValue(board: Board): number {
        return (
            1 + 
            (this.isWatched(board)? 1 : 0) + 
            (this.isLit(board)? 1 : 0)
        ) * board.path.getDiff();
    }

    select(board: Board): Undo {
        // * Replenishes stealth points and takes away treasures
        const value = this.getValue(board);
        const uu = board.thief.setStealth(board.thief.getStealth() + value);
        const uuu = board.thief.setTreasures(value > board.thief.getTreasures()? 0 : (board.thief.getTreasures() - value));
        const u = super.select(board);

        return () => {
          u();
          uu();
          uuu();
        }
      }
}

export default function Traitor(): TraitorInt {
    return new TraitorImpl();
}
