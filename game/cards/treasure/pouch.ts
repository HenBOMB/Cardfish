import { CardImpl } from '../card';
import { Board, Card, Undo } from '../../types';

export interface PouchInt extends Card {

}

export class PouchImpl extends CardImpl implements PouchInt {

    constructor() {
        super('pouch');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'treasure';
    }

    getValue(board: Board): number {
        return (1 +
            (this.isLit(board)? 1 : 0) + 
            (this.isWatched(board)? 1 : 0)
        ) * board.path.getDiff();
    }

    select(board: Board): Undo {
        const uu = board.thief.setTreasures(board.thief.getTreasures() + this.getValue(board));
        const u = super.select(board);
        return () => {
            u();
            uu();
        }
    }
}

export default function Pouch(): PouchInt {
    return new PouchImpl();
}
