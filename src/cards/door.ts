import { Match, Card, Undo } from '../types';

export interface DoorInt extends Card {

}

export class DoorImpl implements DoorInt {
    id: string = 'door';
    
    constructor() {
    }
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export default function Door(): DoorInt {
    return new DoorImpl();
}
