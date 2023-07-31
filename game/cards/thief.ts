import { Board, Undo, Thief } from '../types';

export class ThiefImpl implements Thief {
    id: string = 'thief';   
    
    private i: number;
    private _stealth: number;
    private _treasures: number;

    constructor(i: number) {
      this.i = i;
      this._stealth = 10;
      this._treasures = 0;
    }

    is(type: string): boolean {
        return type === 'thief';
    }

    trigger(board: Board): Undo {
        return () => {};
    }

    getStealth(): number {
        return this._stealth;
    }

    getTreasures(): number {
        return this._treasures;
    }

    getStartPos(): number {
        return this.i;
    }
}

export function createThief(i: number): Thief {
    return new ThiefImpl(i);
}
