import { CardImpl } from './card';
import { Board, Undo, Card } from '../types';

export interface ExitInt extends Card {

}

export class ExitImpl extends CardImpl implements ExitInt {
    constructor() {
        super('exit');
    }

    is(type: string): boolean {
        return type === 'exit';
    }

    trigger(board: Board): Undo {
        return () => {};
    }
}

export default function Exit(): ExitInt {
    return new ExitImpl();
}
