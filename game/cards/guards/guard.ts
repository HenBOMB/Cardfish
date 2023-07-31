import { Board, Guard, Undo } from '../../types';

export interface GuardInt extends Guard {

}

class GuardImpl implements GuardInt {
    id: string = 'guard';
    
    is(type: string): boolean {
        return type === this.id || type === 'guard';
    }
    
    trigger(board: Board): Undo {
        return () => {};
    }
}

export default function Common(): GuardInt {
    return new GuardImpl();
}
