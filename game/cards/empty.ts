import { CardImpl } from './card';
import { Board, Card, Undo } from '../types';

export interface EmptyInt extends Card {

}

export class EmptyImpl extends CardImpl implements EmptyInt {
    constructor() {
        super('empty');
    }

    is(type: string): boolean {
        return type === 'empty';
    }

    select(board: Board): Undo {
        return () => {};
    }
}

export default function Empty(): EmptyInt {
    return new EmptyImpl();
}
