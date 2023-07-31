import { CardImpl } from '../card';
import { Board, Card, Undo } from '../../types';

export interface HideInt extends Card {

}

export class HideImpl extends CardImpl implements HideInt {

    constructor() {
        super('hide');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'hide';
    }
}

export default function Hide(): HideInt {
    return new HideImpl();
}
