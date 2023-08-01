import { Board, Card as tCard, Guard, Undo } from '../types';

export class CardImpl implements tCard {
    id: string;
    index: number;

    private _selected: boolean;
    private _modifiers: { [key: string]: number };
    
    constructor(id: string) {
        this.id = id;
        this.index = -1;
        this._selected = false;
        this._modifiers = { };
    }

    is(type: tCard | string): boolean {
        return typeof type === 'string'? this.id === type : (this.id === type.id && this.index === type.index);
    }

    isLit(board: Board): boolean {
        return board.getAdj(this)
            .some(c => c.is('torch') && c.isLit(board));
    }

    isWatched(board: Board): boolean {
        const perp = board.getPerp(this);
        return board.getGuards()
            .filter((g: tCard) => perp.some((c: tCard) => c.is(g)))
            .some((g: Guard) => g.getFacing(board)?.is(this));
    }

    isSelected(): boolean {
        return this._selected;
    }

    getValue(board: Board): number {
        return 1;
    }

    select(board: Board): Undo {
        const card = this;
        const undos: Undo[] = [];

        card._selected = true;

        // ! Custom for guards
        if(card.isLit(board))
        {
            const guards: Guard[] = board.getPerp(card).filter(c => c.is('guard')).map(c => c as Guard);
        
            // ? If you select a card that was watched by a guard, the guard is alerted (!) and gets +1 permanently.
            const facing = guards.filter(g => g.getFacing(board)?.is(card));
            if(facing.length > 0) {
                undos.push(...facing.map(g => g.setModifier('alert', 1)));
            }

            // ? Selecting an illuminated adjacent card makes a guard suspicious (?) and turns him into that card's direction.
            const nonfacing = guards.filter(g => !g.getFacing(board)?.is(card));
            if(nonfacing.length > 0) {
                // undos.push(...nonfacing.map(g => g.setModifier('sus', 1)));
                undos.push(...nonfacing.map(g => g.setLook(card)));
            }
        }

        return () => {
            card._selected = false;
            undos.forEach(u => u());
        };
    }
    
    setModifier(key: string, value: number): Undo {
        const card = this;
        const old = card.getModifier(key);
        card._modifiers[key] = value;
        return () => {
            card._modifiers[key] = old;
        }
    }

    getModifier(key: string): number {
        return this._modifiers[key] || 0;
    }
}

export default function Card(id: string): tCard {
    return new CardImpl(id);
}
