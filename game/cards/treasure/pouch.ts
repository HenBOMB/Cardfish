import { CardImpl } from '../card';
import { Board, Card, Undo } from '../../types';

export interface PouchInt extends Card {

}

export class PouchImpl extends CardImpl implements PouchInt {

    constructor() {
        super('pouch');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'treasure';
    }
}

export default function Pouch(): PouchInt {
    return new PouchImpl();
}
