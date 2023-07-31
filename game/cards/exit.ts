import { Board, Card, Undo } from '../types';

export interface ExitInt extends Card {

}

export class ExitImpl implements ExitInt {
    id: string = 'exit';
    
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
