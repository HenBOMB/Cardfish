import { CardImpl } from './card';
import { Board, Undo, Thief } from '../types';

export class ThiefImpl extends CardImpl implements Thief {
    private i: number;
    private _stealth: number;
    private _treasures: number;
    private _captured: boolean;

    constructor(i: number) {
        super('thief');
        this.i = i;
        this._stealth = 10;
        this._treasures = 0;
        this._captured = false;
    }

    isCaught(): boolean {
        return this._captured;
    }
    
    getStealth(): number {
        return this._stealth;
    }

    setStealth(stealth: number): Undo {
        const thief = this;
        const s = thief._stealth;
        thief._stealth = stealth;
        return () => {
            thief._stealth = s;
        }
    }

    getTreasures(): number {
        return this._treasures;
    }

    setTreasures(treasures: number): Undo {
        const thief = this;
        const s = thief._treasures;
        thief._treasures = treasures;
        return () => {
            thief._treasures = s;
        }
    }

    getStartPos(): number {
        return this.i;
    }

    setStartPos(i: number): void {
        this.i = i;
    }

    setCaught(): Undo {
        const thief = this;
        thief._captured = true;
        return () => {
            thief._captured = false;
        }
    }
}

export function createThief(i: number): Thief {
    return new ThiefImpl(i);
}
