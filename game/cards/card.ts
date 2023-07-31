import { Board, Card as card, Path, Undo } from '../types';

export class CardImpl implements card {
    id: string;

    private _enabled: boolean;
    private _value: number;
    
    constructor(id: string) {
        this.id = id;
        this._enabled = true;
        this._value = 1;
    }

    private getAdj(board: Board): card[] {
        const MAP = [
            [1, 3, 4],
            [0, 2, 3, 4, 5],
            [1, 4, 5],
            [0, 1, 4, 6, 7],
            [0, 1, 2, 3, 5, 6, 7, 8],
            [1, 2, 4, 7, 8],
            [3, 4, 7],
            [3, 4, 5, 6, 8],
            [4, 5, 7],
        ];
        return MAP[board.getCards().findIndex(c => c === this)].map(i => board.getCard(i));
    }

    is(type: string): boolean {
        return type === this.id;
    }

    isLit(board: Board): boolean {
        return this.getAdj(board).some(c => c.is('torch'));
    }

    select(board: Board): Undo {
        const card = this;
        card._enabled = false;
        return () => {
            card._enabled = true;
        };
    }

    getValue(path: Path) {
        return this._value * path.getDiff();
    }
}

export default function Card(id: string): card {
    return new CardImpl(id);
}
