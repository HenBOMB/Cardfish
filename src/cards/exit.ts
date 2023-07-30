import { Match, Card, Undo } from '../types';

export interface ExitInt extends Card {

}

export class ExitImpl implements ExitInt {
    id: string = 'exit';
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export default function Exit(): ExitInt {
    return new ExitImpl();
}
