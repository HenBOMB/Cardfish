import { Match, Card, Undo } from '../types';

export interface GuardInt extends Card {

}

export class GuardImpl implements GuardInt {
    id: string = 'guard';
    
    constructor() {
    }
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export default function Guard(): GuardInt {
    return new GuardImpl();
}
