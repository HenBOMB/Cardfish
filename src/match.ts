import { createHand } from './hand';
import { Match, Card, Undo, Thief, Hand } from './types';

export class MatchImpl implements Match {
    thief: Thief;
    hand: Hand;
    
    private _undos: (() => void)[];

    // ?? path.ts
    private _diff: number;
    
    constructor() {
        this._undos = [];
        this._diff = 1;
    }

    begin(thief: Thief, deck: Card[]): void {
        this.thief = thief;
        this.hand = createHand(this.thief, deck);
    }

    // ? Getting rid of card costs stealth points.

    // ? For every card in your path that is not adjacent to your Thief, the path diff increases by 1.
    // ? A card that increases the path diff has a little arrow icon ^.
    // ? All card values are multiplied with the current path diff.

    // ? stealth > 0 = invisible
    
    play(path: number[]): void {
        const undos: Undo[] = path.map(i => {
            const u = this.hand.getCard(i).trigger(this);
            return u;
        });
        
        const undo = () => {
            undos.forEach(u => u());
        };
        
        this._undos = [...this._undos, undo];
    }
    
    undo(): void {
        this._undos.length && this._undos.shift()!();
    }
}


export function createMatch(): Match {
    return new MatchImpl();
}