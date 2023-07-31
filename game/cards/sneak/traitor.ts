import { CardImpl } from '../card';
import { Board, Stealth, Undo } from '../../types';

export interface TraitorInt extends Stealth {

}

export class TraitorImpl extends CardImpl implements TraitorInt {
    
    constructor() {
        super('traitor');
    }
    
    is(type: string): boolean {
        return super.is(type) || type === 'traitor';
    }
}

export default function Traitor(): TraitorInt {
    return new TraitorImpl();
}
