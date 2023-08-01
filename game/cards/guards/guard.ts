import { Board, Card, Guard, Undo } from '../../types';
import { CardImpl } from '../card';

const KDI: { [key: string]: number } = {
    '-3': 0,
    '1': 1,
    '3': 2,
    '-1': 3
};

class GuardImpl extends CardImpl implements Guard {
    
    // ? 0, 1, 2, 3
    private lookDir: number;
    
    constructor(lookDir: 0 | 1 | 2 | 3) {
        super('guard');
        this.lookDir = lookDir;
    }
    
    is(type: string): boolean {
        return super.is(type);
    }

    getFacing(board: Board): Card | null {
        const i = this.index + [-3, 1, 3, -1][this.lookDir];
        return i < 0 || i > 8? null : board.getCard(i);
    }

    getValue(board: Board): number {
        const value = (
            super.getValue(board) + 
            (this.isLit(board)? 1 : 0) + 
            (this.isWatched(board)? 1 : 0) + 
            (this.getModifier('alert') || 0)
        ) * board.path.getDiff();
        return value;
    }

    setLook(card: Card): Undo {
        const guard = this;
        const old = guard.lookDir;
        const s = card.index - guard.index;
        guard.lookDir = KDI[s];
        return () => {
            guard.lookDir = old;
        }
    }

    select(board: Board): Undo {
        const undos = [super.select(board)];
        const value = this.getValue(board);
        
        // ? If a guard's value is higher than your remaining stealth points, he will capture you.
        if(value > board.thief.getStealth()) {
            undos.push(board.thief.setCaught());
        }
        else
        {
            undos.push(board.thief.setStealth(board.thief.getStealth() - value));
        }

        return () => {
            undos.forEach(undo => undo());
        }
    }
}

export default function Common(lookDir: 0 | 1 | 2 | 3): Guard {
    return new GuardImpl(lookDir);
}
