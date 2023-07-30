import { Match, Card, Undo, Thief } from '../types';

export class ThiefImpl implements Thief {
    id: string = 'thief';   
     
    _stealth: number;
    _treasures: number;
    
    private i: number;
    
    constructor(i: number) {
      this.i = i;
      this._stealth = 10;
      this._treasures = 0;
    }

    public trigger(match: Match): Undo {
        return () => {};
    }
}

export function createThief(): Thief {
    return new ThiefImpl();
}
