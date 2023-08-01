import { CardImpl } from '../card';
import { Board, Card, Undo } from '../../types';

export class TorchImpl extends CardImpl implements Card {

    private _lit: boolean = true;

    constructor() {
        super('torch');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'obstacle';
    }

    isLit(board: Board): boolean {
        return this._lit;
    }

    getValue(board: Board): number {
        return (
            (this.isLit(board)? 1 : 0) + 
            (this.isWatched(board)? 1 : 0)
        ) * board.path.getDiff();
    }
    
    select(board: Board): Undo {
        const u = super.select(board);
        const torch = this;
        const value = torch.getValue(board);
        const lit = torch._lit;

        torch._lit = false;
        const uu = board.thief.setStealth(board.thief.getStealth() - value);

        return () => {
            u();
            torch._lit = lit;
            uu();
        }
    }
}

export default function Torch(): Card {
    return new TorchImpl();
}
