import { CardImpl } from './card';
import { Undo, Thief } from '../types';

export class ThiefImpl extends CardImpl implements Thief {
    private _score: number;
    private _status: number;

    constructor(index: number) {
        super('thief', 10);
        this._index = index;
        this._score = 0;
        this._status = 0;
    }

    isCaught(): boolean {
        return this._status === 1;
    }

    isEscaped(): boolean {
        return this._status === 2;
    }

    getScore(): number {
        return this._score;
    }

    setScore(score: number): Undo {
        const thief = this;
        const old = thief._score;
        thief._score = score;
        return () => {
            thief._score = old;
        }
    }

    setCaught(): Undo {
        const thief = this;
        thief._status = 1;
        return () => {
            thief._status = 0;
        }
    }

    setEscape(): Undo {
        const thief = this;
        thief._status = 2;
        return () => {
            thief._status = 0;
        }
    }
}

export function createThief(index: number): Thief {
    return new ThiefImpl(index);
}
