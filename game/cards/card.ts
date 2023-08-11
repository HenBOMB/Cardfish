import { Heist, Card as tCard, Guard, Undo } from '../types';

export class CardImpl implements tCard {
	
	//static MAP: { [key: string]: tCard } = {};
	
    id: string;
    _index: number;

	protected _value: number;
    private _selected: boolean;
    private _modifiers: { [key: string]: number };

    constructor(id: string, value: number = 1) {
        this.id = id;
        this._index = -4;
        this._selected = false;
        this._modifiers = { };
		this._value = value;
    }

    is(type: tCard | string): boolean {
        return typeof type === 'string'? this.id === type : (this.id === type?.id && this._index === type?._index);
    }

    isLit(heist: Heist): boolean {
        return heist.getPerp(this)
            .some(c => c.is('torch') && c.isLit(heist));
    }

     isWatched(heist: Heist): boolean {
        return heist.getPerp(this)
            // ? Filter out all cards that are not guards.
            .filter(c => c.is('guard')).map(c => c as Guard)
            // ? Filter out all guards that are not facing this card.
            .filter(g => g.isFacing(heist, this))
            // ? Filter out all guard that cannot see this card.
            .filter(g => g.isNocturnal()? true : this.isLit(heist)).length? true : false;
    }

    isSelectable(_: Heist): boolean {
        return !this._selected;
    }

	setValue(value: number): Undo {
		const card = this;
		const old = card._value;
		card._value = value;
		return () => {
			this._value = old;
		}
	}

    getValue(heist: Heist): number {
        return this._value;
    }

    select(heist: Heist): Undo {
        const card = this;
        const undos: Undo[] = [];

        card._selected = true;

        // ! Custom for guards
        if(card.isLit(heist))
        {
            const guards: Guard[] = heist.getPerp(card).filter(c => c.is('guard')).map(c => c as Guard);
        
            // ? If you select a card that was watched by a guard, the guard is alerted (!) and gets +1 permanently.
            const facing = guards.filter(g => g.isFacing(heist, card));
            if(facing.length > 0) {
                undos.push(...facing.map(g => g.setModifier('alert', 1)));
            }

            // ? Selecting an illuminated adjacent card makes a guard suspicious (?) and turns him into that card's direction.
            const nonfacing = guards.filter(g => !g.isFacing(heist, card));
            if(nonfacing.length > 0) {
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

export default function Card(id: string, value: number): tCard {
    return new CardImpl(id, value);
}
