import { Board, Equipment, Undo } from '../../types';
import { CardImpl } from '../card';

class ChestImpl extends CardImpl implements Equipment {

    constructor() {
        super('chest');
    }
    
    is(type: string): boolean {
        return super.is(type) || type === 'equipment';
    }

    getValue(board: Board): number {
        return (
            1 +
            (this.isLit(board)? 1 : 0) + 
            (this.isWatched(board)? 1 : 0) 
        ) + this.getModifier('turn') * board.path.getDiff();
    }

    select(board: Board): Undo {
        const value = this.getValue(board);
        const uu = board.thief.setStealth(board.thief.getStealth() - value);
        const u = super.select(board);
        return () => {
            u();
            uu();
        }
    }
}

export default function Common(): Equipment {
    return new ChestImpl();
}
