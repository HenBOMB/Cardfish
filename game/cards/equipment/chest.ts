import { Board, Equipment, Undo } from '../../types';

export interface ChestInt extends Equipment {

}

class ChestImpl implements ChestInt {
    id: string = 'chest';
    
    is(type: string): boolean {
        return type === this.id || type === 'chest';
    }
    
    public trigger(board: Board): Undo {
        return () => {};
    }
}

export default function Common(): ChestInt {
    return new ChestImpl();
}
