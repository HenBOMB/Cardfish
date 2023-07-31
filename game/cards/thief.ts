import { CardImpl } from './card';
import { Board, Undo, Thief } from '../types';

export class ThiefImpl extends CardImpl implements Thief {
    private i: number;
    private _stealth: number;
    private _treasures: number;

    constructor(i: number) {
        super('thief');
        this.i = i;
        this._stealth = 10;
        this._treasures = 0;
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
