import { Board, Equipment, Undo } from '../../types';
import { CardImpl } from '../card';

class ChestImpl extends CardImpl implements Equipment {

    constructor() {
        super('chest');
    }
    
    is(type: string): boolean {
        return super.is(type) || type === 'equipment';
    }
}

export default function Common(): Equipment {
    return new ChestImpl();
}
