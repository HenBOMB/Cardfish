import { CardImpl } from '../card';
import { Board, Equipment, Undo, Card } from '../../types';

export class ClokImpl extends CardImpl implements Equipment {
    private _value: number;

    constructor(value: number) {
        super('cloak');
        this._value  = value;
    }

    is(type: string): boolean {
        return super.is(type) || type === 'equipmentq';
	}

    getValue(board: Board): number {
        return this._value;
    }

    equip(board: Board, card: Card): Undo {
        const value = this;
        const u = card.setValue(card.getValue(board) + value);

        return () => {
            u();
        }
    }
}

export default function Door(lockDir: number): Card {
    return new DoorImpl(lockDir);
}
