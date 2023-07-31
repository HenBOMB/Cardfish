import { Board, Equipment, Undo } from '../../types';
import { CardImpl } from '../card';

export interface ChestInt extends Equipment {

}

class ChestImpl extends CardImpl implements ChestInt {

    constructor() {
        super('chest');
    }
    
    is(type: string): boolean {
        return super.is(type) || type === 'equipment';
    }
}

export default function Common(): ChestInt {
    return new ChestImpl();
}
