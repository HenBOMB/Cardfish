import { Match, Card, Undo } from '../types';

export interface TraitorInt extends Card {

}

export class TraitorImpl implements TraitorInt {
    id: string = 'traitor';
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export default function Traitor(): TraitorInt {
    return new TraitorImpl();
}
