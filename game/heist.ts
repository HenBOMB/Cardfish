import { Heist, Card, Path, Thief, Undo, Guard as tGuard } from './types';
import { Torch, Empty, Guard } from './cards/all';
import createPath from './path';
import { Equipment } from './cards/types';
import { createThief } from './cards/thief';

export class HeistImpl implements Heist {
    thief: Thief;
    path: Path;
    
    private _cards: Card[];
    private _deck: Card[];
    private _equipment: Equipment[];

    constructor(index: number, equipment: Equipment[], deck: Card[]) {

        this.thief = createThief(index);
        this._equipment = equipment;
        this._cards = Array<Card>(9).fill(Empty());
        this._deck = [...deck];
        this._cards[index] = this.thief;
        this.path = createPath(this);
        this.thief.select(this);
        this.deal();
    }

    getCard(i: number): Card {
        return this._cards[i];
    }

    setCard(i: number, card: Card = Empty()): Undo {
        const heist = this;
        const c = heist._cards[i];
        heist._cards[i] = card;
        return () => {
            heist._cards[i] = c;
        }
    }

    getCards(): Card[] {
        return this._cards.filter(c => c.id !== 'empty' && c.isSelectable(this));
    }

    setDeck(deck: Card[]): void {
        this._deck = deck;
    }

    getDeck(): Card[] {
        return this._deck;
    }

    getEquipment(i: number): Equipment {
        i = i < 0? i + 3 : i;
        return this._equipment[i];
    }

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
        if(card._index < 0) console.log(card.id);
        return MAP[card._index].map(i => this.getCard(i)).filter(c => c.isSelectable(this));
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
        return MAP[card._index].map(i => this.getCard(i)).filter(c => c.isSelectable(this));
    }

    getGuards(exclude: number = -1): tGuard[] {
        return this.getCards()
            .filter((c: Card) => c.is('guard') && c._index !== exclude)
            .map((c: Card) => c as tGuard);
    }

    play(path: number[], other?: number[]): void {
        if(this.thief.isCaught()) 
		{
            return;
        }

        const eCards = path.filter(i=>i<0);

        if (eCards.length)
        {
            if(eCards.length !== other?.length) return;
            eCards.forEach((i, j) => this.getEquipment(i).use(this, other![j]));
            path = path.slice(eCards.length);
        }

        if(!path.length) return;
        
        this.path = createPath(this);

        path.forEach(i => this.path.select(this, i));

        if(this.path.isEnd()) 
		{
            this.thief.setValue(this.thief.getValue() < 10? 10 : this.thief.getValue());
        }

        path.forEach(i => this.setCard(i));

        this.setCard(this.thief._index);
        this.thief._index = path[path.length-1];
        this.setCard(this.thief._index, this.thief);

        this.path = createPath(this);
        this.deal();
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
        // Guards don't move
        
        const drop = () => {
            for (let i = 5; i > 0; i--)
            {
                const c = this._cards[i];
                if(c.is('empty') || c.is('thief') || c.is('guard')) continue;
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
            c._index = i;
            if(!c.is('empty')) return c; 
            const card = this._deck.shift() || (Math.random() > 0.5? Guard(Math.floor(Math.random()*4) as any) : Torch());
            card._index = i;
            return card;
        });
    }
}

export function createHeist(index: number, equipment: Equipment[], deck: Card[]): Heist {
    return new HeistImpl(index, equipment, deck);
}