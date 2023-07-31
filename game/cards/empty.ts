import { Board, Card, Undo } from '../types';

export interface EmptyInt extends Card {

}

export class EmptyImpl implements EmptyInt {
    id: string = 'empty';
    
    is(type: string): boolean {
        return type === 'empty';
    }

    trigger(board: Board): Undo {
        return () => {};
    }
}

export default function Empty(): EmptyInt {
    return new EmptyImpl();
}
