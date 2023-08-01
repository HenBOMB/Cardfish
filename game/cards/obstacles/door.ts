import { CardImpl } from '../card';
import { Board, Card, Undo } from '../../types';

export class DoorImpl extends CardImpl implements Card {

    constructor() {
        super('door');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'obstacle';
    }

    // TODO Select requires special lock mechanism (same as guard sight)
}

export default function Door(): Card {
    return new DoorImpl();
}
