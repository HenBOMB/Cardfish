import { Match, Card, Undo } from '../types';

export interface EmptyInt extends Card {

}

export class EmptyImpl implements ExitInt {
    id: string = 'empty';
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export default function Empty(): EmptyInt {
    return new EmptyImpl();
}
