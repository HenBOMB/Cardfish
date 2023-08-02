import { CardImpl } from '../card';
import { Board, Card, Undo } from '../../types';

export class DoorImpl extends CardImpl implements Card {
    private lockDir: number;

    constructor(lockDir: number) {
        super('door');
        this.lockDir  = lockDir;
    }

    is(type: string): boolean {
        return super.is(type) || type === 'obstacle';
    }

    // ? If illuminated only passable from the lock direction.
    // ? If visible impassible

    // TODO Untested
    isSelectable(board: Board): boolean {
        const i = this.index + [-3, 1, 3, -1][this.lockDir];
        const facing = i < 0 || i > 8? null : board.getCard(i);
        return super.isSelectable(board) && 
            // ? If visible impassible
            !this.isWatched(board) &&
            // If illuminated only passable from the lock direction.
            (!this.isLit(board) || (facing? true : false) && board.path.getLast(board).is(facing!));
    }

    getValue(board: Board): number {
        return (
            (this.isLit(board)? 1 : 0) + 
            (this.isWatched(board)? 1 : 0)
        ) * board.path.getDiff();
    }

    select(board: Board): Undo {
        const value = this.getValue(board);

        const u = super.select(board);
        const uu = board.thief.setStealth(board.thief.getStealth() - value);

        return () => {
            u();
            uu();
        }
    }
}

export default function Door(lockDir: number): Card {
    return new DoorImpl(lockDir);
}
