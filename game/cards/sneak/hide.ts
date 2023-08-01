import { CardImpl } from '../card';
import { Board, Card, Undo } from '../../types';

export interface HideInt extends Card {

}

export class HideImpl extends CardImpl implements HideInt {

    constructor() {
        super('hide');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'sneak';
    }

    getValue(board: Board): number {
        return this.isLit(board)? 0: 10;
    }

    select(board: Board): Undo {
        const s = board.thief.getStealth();
        const u = super.select(board);
        // TODO Only if you end your path on a hide card.
        return u;
        const uu = board.thief.setStealth(this.isLit(board)? s : s < 10? 10 : s);
        return () => {
            u();
            uu();
        }
    }
}

export default function Hide(): HideInt {
    return new HideImpl();
}
