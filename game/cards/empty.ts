import { CardImpl } from './card';
import { Board, Card, Undo } from '../types';

export class EmptyImpl extends CardImpl implements Card {
    constructor() {
        super('empty');
    }
}

export default function Empty(): Card {
    return new EmptyImpl();
}
