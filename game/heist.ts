import { Heist, Card, Path, Undo } from './types';
import { Torch, Empty, Guard, Thief } from './cards/all';
import createPath from './path';
import { Equipment, Guard as iGuard, Thief as iThief } from './cards/types';

export class HeistImpl implements Heist {
    thief: iThief;
    path: Path;
    
    private _cards: Card[];
    private _deck: Card[];
    private _equipment: Equipment[];

    constructor(index: number, equipment: Equipment[], deck: Card[]) {
        this.thief = Thief(index);
        this._equipment = equipment;
        this._cards = Array<Card>(9).fill(Empty());
        this._deck = [...deck];
        this._cards[index] = this.thief;
        this.path = createPath(this);
        this.thief.select(this);
        this.deal();
    }

    genCards(count: number): Card[] {
        return Array(count).fill(null).map(_ => this.getCard(9))
    }

    getCard(i: number): Card {
        const card = this._cards[i] || (Math.random() > 0.5? Guard(Math.floor(Math.random()*4) as any) : Torch());
        card._index = i;
        return card;
    }

    setCard(i: number, card?: Card): Undo {
        const heist = this;
        const c = heist._cards[i];
        heist._cards[i] = card || Empty();
        heist._cards[i]._index = i;
        return () => {
            heist._cards[i] = c;
        }
    }

    getCards(all?: boolean): Card[] {
        return this._cards.filter(c => all || c.id !== 'empty' && c.isSelectable(this));
    }

    setDeck(deck: Card[]): void {
        this._deck = deck;
    }

    getDeck(): Card[] {
        return this._deck;
    }

    getEquipment(i: number): Equipment {
        return this._equipment[i < 0? i + 3 : i];
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

    getGuards(exclude: number = -1): iGuard[] {
        return this.getCards()
            .filter((c: Card) => c.is('guard') && c._index !== exclude)
            .map((c: Card) => c as iGuard);
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
    	for (let i = 0; i < 9; i++)
    	{
    		const c = this._cards[i];
    		if (c.is('guard'))
    		{
    			if (!((c as Guard).isIdle()))
    			{
    				const f = (c as Guard).getFacing(this);
    				if (!f || !f.is('empty')) continue;
    				this._cards[i] = f;
    				this._cards[f._index] = c;
    			}
    		}
    	}
    	
        const drop = (b?: boolean) => {
            for (let i = 5; i > 0; i--)
            {
                const c = this._cards[i];
                if(c.is('empty') || c.is('thief') ||  c.is('guard')) continue;
                if(c.is('guard'))
                {
                	if(!((c as Guard).isIdle()))
                	{
                		continue;
                	}
                }
                const g = this._cards[i+3];
                if(!g.is('empty')) continue;
                this._cards[i] = g;
                this._cards[i+3] = c;
                g._index = i;
                c._index = i+3;
            }
            if(b) return;
            drop(true);
        }
        
        drop();
		
        // ! Deal the cards
       
        this._cards.reverse().map((c, i) => {
            c._index = i;
            if(!c.is('empty')) return c; 
            (this._deck.shift() || this.getCard(-1)).place(this, i);
        })
    }
}

export default function createHeist(index: number, equipment: Equipment[], deck: Card[]): Heist {
    return new HeistImpl(index, equipment, deck);
}