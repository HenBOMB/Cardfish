import { CardImpl } from '../card';
import { Board, Card, Undo } from '../../types';

export interface DoorInt extends Card {

}

export class DoorImpl extends CardImpl implements DoorInt {

    constructor() {
        super('door');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'obstacle';
    }
}

export default function Door(): DoorInt {
    return new DoorImpl();
}
