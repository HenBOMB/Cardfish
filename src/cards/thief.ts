import { Match, Card, Undo, Thief } from '../types';

export class ThiefImpl implements Thief {
    id: string = 'thief';
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export function createThief(): Thief {
    return new ThiefImpl();
}
