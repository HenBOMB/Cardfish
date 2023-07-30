import { Hand, Card, Thief } from './types';
import { Torch, Guard } from './cards/all';

export class HandImpl implements Hand {
    thief: Thief;

    private _cards: Card[];
    private _deck: Card[];

    constructor(thief: Thief, deck: Card[]) {
        this.thief = thief;
        this._cards = Array<Card>(8);
        this._deck = [...deck];
    }

    getCard(i: number): Card {
        return this._cards[i];
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
        
        for (let i = 0; i < 8; i++) 
        {
          let c = this._cards[i];
          if(c.id !== 'empty') continue;
          c = this._deck.shift();
          if(!c) c = Math.random() > 0.6? Guard() : Torch();
          this._cards = [...this._cards, c];
        }

        return this._cards.length - count;
    }
}

export function createHand(thief: Thief, deck: Card[]): Hand {
    return new HandImpl(thief, deck);
}