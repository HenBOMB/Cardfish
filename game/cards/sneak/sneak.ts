import { CardImpl } from '../card';
import { Board, Stealth, Undo } from '../../types';

export interface SneakInt extends Stealth {

}

export class SneakImpl extends CardImpl implements SneakInt {

    constructor() {
        super('sneak');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'sneak';
    }
    
    select(board: Board): Undo {
      const s = super.select(board);
      
      //board.thief.
      
      return () => {
        s();
      }
    }
}

export default function Sneak(): SneakInt {
    return new SneakImpl();
}
