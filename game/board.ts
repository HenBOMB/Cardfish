import { Board, Card, Thief, Undo } from './types';
import { Torch, Guard, Empty } from './cards/all';

export class BoardImpl implements Board {
    // ? may not need this
    thief: Thief;

    private _cards: Card[];
    private _deck: Card[];

    constructor(thief: Thief, deck: Card[]) {
        this.thief = thief;
        this._cards = Array<Card>(8).fill(Empty());
        this._deck = [...deck];
        this._cards[thief.getStartPos()] = thief;
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

    getCards() {
        return this._cards;
    }

    getDeck() {
        return this._deck;
    }

    shuffle(): void {
        this._deck = this._deck.sort(() => Math.random() - 0.5);
    }

    deal(): number {
        // TODO
        /**
         * Trigger all cards passive.
         * Some cards move on their own.
         */

        const count = this._cards.length;
        
        // TODO move cards
        
        // ? drop dowm
        for (let i = 5; i > 0; i--)
        {
          const c = this._cards[i];
          if(c.id === 'empty') continue;
          const g = this._cards[i+3];
          if(g.id !== 'empty') continue;
          this._cards[i] = g;
          this._cards[i+3] = c;
        }
        
        // ? deal the cards
        for (let i = 0; i < 8; i++) 
        {
          let c = this._cards[i];
          if(c.id !== 'empty') continue;
          c = this._deck.shift() || Math.random() > 0.6? Guard() : Torch();
          this._cards = [...this._cards, c];
        }

        return this._cards.length - count;
    }
}

export function createBoard(thief: Thief, deck: Card[]): Board {
    return new BoardImpl(thief, deck);
}