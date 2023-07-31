import { Board, Treasure, Undo } from '../../types';

export interface PouchInt extends Treasure {

}

export class PouchImpl implements PouchInt {
    id: string = 'pouch';
    
    is(type: string): boolean {
        return type === 'pouch' || type === 'treasure';
    }

    trigger(board: Board): Undo {
        return () => {};
    }
}

export default function Pouch(): PouchInt {
    return new PouchImpl();
}
