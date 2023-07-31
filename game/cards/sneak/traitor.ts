import { Board, Stealth, Undo } from '../../types';

export interface TraitorInt extends Stealth {

}

export class TraitorImpl implements TraitorInt {
    id: string = 'traitor';
    
    is(type: string): boolean {
        return type === this.id || type === 'sneak';
    }

    trigger(board: Board): Undo {
        return () => {};
    }
}

export default function Traitor(): TraitorInt {
    return new TraitorImpl();
}
