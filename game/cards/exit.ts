import { CardImpl } from './card';
import { Board, Undo, Card } from '../types';

export class ExitImpl extends CardImpl implements Card {
    constructor() {
        super('exit');
    }
}

export default function Exit(): Card {
    return new ExitImpl();
}
