import { createThief } from './cards/thief';
import { Match, Card, Undo, Thief } from './types';

export class MatchImpl implements Match {
    private thief: Thief;
    
    private _cards: Card[];
    private _deck: Card[];
    private _undos: (() => void)[];
    
    constructor() {
        this.thief = createThief();
        this._cards = [];
        this._deck = [];
        this._undos = [];
    }
    
    public play(path: number[]): void {
        const undos: Undo[] = path.map(i => {
            const c = this.getCard(i);
            const u = c.trigger(this);
            return u;
        });
        
        const undo = () => {
            undos.forEach(u => u());
        };
        
        this._undos = [...this._undos, undo];
    }
    
    public undo(): void {
        this._undos.length && this._undos.shift()!();
    }
    
    public deal(): void {
        while(this._cards.length !== 8)
        {
            const c = this._deck.shift();
            if(!c) break; // TODO deal random card or exit card
            this._cards = [...this._cards, c];
        }
    }
    
    public getCard(i: number): Card {
        return this._cards[i];
    }
    
    public getDeck(): Card[] {
        return this._deck;
    }
    
    public getThief(): Thief {
        return this.thief;
    }

    public setDeck(deck: Card[]): void {
        this._deck = deck;
    }
}


export function createMatch(): Match {
    return new MatchImpl();
}