import { Match, Card, Undo, Thief } from '../types';

export class ThiefImpl implements Thief {
    id: string = 'thief';   
     
    _stealth: number = 0;    
    _treasures: number = 0;

    public trigger(match: Match): Undo {
        return () => {};
    }
}

export function createThief(): Thief {
    return new ThiefImpl();
}
