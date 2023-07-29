import { Match, Card, Undo } from '../types';

export interface TraitorInt {

}

export class TraitorImpl implements TraitorInt, Card {
    id: string = 'traitor';
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export default function Traitor(): TraitorInt {
    return new TraitorImpl();
}
