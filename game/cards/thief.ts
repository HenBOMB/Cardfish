import { CardImpl } from './card';
import { Board, Undo, Thief } from '../types';

export class ThiefImpl extends CardImpl implements Thief {
    private _stealth: number;
    private _treasures: number;
    private _captured: boolean;

    constructor(index: number) {
        super('thief');
        this.index = index;
        this._stealth = 10;
        this._treasures = 0;
        this._captured = false;
    }

    isCaught(): boolean {
        return this._captured;
    }

    getValue(board: Board): number {
        return this._stealth;
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

    setCaught(): Undo {
        const thief = this;
        thief._captured = true;
        return () => {
            thief._captured = false;
        }
    }
}

export function createThief(index: number): Thief {
    return new ThiefImpl(index);
}
