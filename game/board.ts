import { Board, Card, Path, Thief, Undo, Guard as tGuard } from './types';
import { Torch, Empty, Guard } from './cards/all';
import createPath from './path';

export class BoardImpl implements Board {
    // ? may not need this
    thief: Thief;
    path: Path;
    
    private _cards: Card[];
    private _deck: Card[];

    constructor(thief: Thief, deck: Card[]) {
        this.thief = thief;
        this._cards = Array<Card>(9).fill(Empty());
        this._deck = [...deck];
        this._cards[thief.index] = thief;
        this.path = createPath(this);
    }

    getCard(i: number): Card {
        return this._cards[i];
    }

    setCard(i: number, card: Card = Empty()): Undo {
        const board = this;
        const c = board._cards[i];
        board._cards[i] = card;
        return () => {
            board._cards[i] = c;
        }
    }

    getCards(): Card[] {
        return this._cards.filter(c => c.id !== 'empty' && c.isSelectable(this));
    }

    getDeck(): Card[] {
        return this._deck;
    }

    /**
     * 0 1 2
     * 3 4 5
     * 6 7 8
     */

    getAdj(card: Card): Card[] {
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
        if(card.index < 0) console.log(card.id);
        return MAP[card.index].map(i => this.getCard(i)).filter(c => c.isSelectable(this));
    }

    getPerp(card: Card): Card[] {
        const MAP = [
            [1, 3],
            [0, 2, 4],
            [1, 5],
            [0, 4, 6],
            [1, 3, 5, 7],
            [2, 4, 8],
            [3, 7],
            [4, 6, 8],
            [5, 7],
        ];
        return MAP[card.index].map(i => this.getCard(i)).filter(c => c.isSelectable(this));
    }

    getGuards(exclude: number = -1): tGuard[] {
        return this.getCards()
            .filter((c: Card) => c.is('guard') && c.index !== exclude)
            .map((c: Card) => c as tGuard);
    }

    shuffle(): void {
        this._deck = this._deck.sort(() => Math.random() - 0.5);
    }

    deal(): void {
        // TODO
        /**
         * Trigger all cards passive.
         * Some cards move on their own.
         */

        // TODO move cards
        
        const drop = () => {
            for (let i = 5; i > 0; i--)
            {
                const c = this._cards[i];
                if(c.is('empty') || c.is('thief')) continue;
                const g = this._cards[i+3];
                if(!g.is('empty')) continue;
                this._cards[i] = g;
                this._cards[i+3] = c;
            }
        }
        // ? Why 2 times? Because the top cards may have to drop twice to reach the bottom.
        drop();
        drop();

        // ? deal the cards
        
        this._cards = this._cards.map((c, i) => {
            c.index = i;
            if(!c.is('empty')) return c; 
            const card = this._deck.shift() || (Math.random() > 0.4? Guard(1) : Torch());
            card.index = i;
            return card;
        });
    }
}

export function createBoard(thief: Thief, deck: Card[]): Board {
    return new BoardImpl(thief, deck);
}