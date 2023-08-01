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

    select(board: Board): Undo {
        const u = super.select(board);
        // TODO ? Not sure this is accurate
        const a = (this.isLit(board)? 2 :  1) * board.path.getDiff();
        const uu = board.thief.setStealth(board.thief.getStealth() + a);
        const uuu = board.thief.setTreasures(a > board.thief.getTreasures()? 0 : (board.thief.getTreasures() - a));

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
