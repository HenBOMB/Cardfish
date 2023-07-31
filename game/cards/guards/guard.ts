import { Board, Guard, Undo } from '../../types';
import { CardImpl } from '../card';

export interface GuardInt extends Guard {

}

class GuardImpl extends CardImpl implements GuardInt {
    
    constructor() {
        super('door');
    }
    
    is(type: string): boolean {
        return super.is(type) || type === 'guard';
    }
}

export default function Common(): GuardInt {
    return new GuardImpl();
}
