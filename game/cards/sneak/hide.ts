import { Board, Heist, Stealth, Undo } from '../../types';

export interface HideInt extends Stealth {

}

export class HideImpl implements HideInt {
    id: string = 'hide';
    
    is(type: string): boolean {
        return type === this.id || type === 'sneak';
    }

    trigger(board: Board): Undo {
        return () => {};
    }
}

export default function Hide(): HideInt {
    return new HideImpl();
}
