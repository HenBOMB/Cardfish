import { Path, Heist, Undo, Card } from './types';
import { Guard } from './cards/types';

const MASK = [
    [2, 5, 6, 7, 8],
    [6, 7, 8],
    [0, 3, 6, 7, 8],
    [2, 5, 8],
    [],
    [0, 3, 6],
    [0, 1, 2, 5, 8],
    [0, 1, 2],
    [0, 1, 2, 3, 6]
];

class PathImpl implements Path {
    private initStealth: number;
    private heist: Heist;
    private diffMask: number[];

    private _diff: number;
    private _path: number[];

    constructor(heist: Heist) {
        this.heist = heist;
        this.initStealth = heist.thief.getValue();
        this.diffMask = MASK[heist.thief._index];
        this._diff = 1;
        this._path = [heist.thief._index];
    }

    isEnd(): boolean {
        return this._path.length === 9 ||
            this.heist.thief.isCaught();
    }

    isIn(index: number): boolean {
        return this._path.some(i => i === index);
    }

    getDiff(): number {
        return this._diff;
    }

    getPath(): number[] {
        return this._path;
    }

    getLast(heist: Heist): Card {
        const i = this._path.slice(-1)[0];
        return heist.getCard(i);
    }

    getInitStealth(): number {
        return this.initStealth;
    }

    getState(): [number[], number, number] {
        return [[...this.getPath()], this.heist.thief.getValue(), this.heist.thief.getScore()];
    }

    select(heist: Heist, i: Card| number): Undo | null {
        if(this.isEnd()) return null;
        const c = typeof i === 'number'? heist.getCard(i) : i;
        if(this._path.some(j => j === c._index)) return null;

        const p = this;
        const d = p._diff;
        
        p._path.push(c._index);
        const u = c.select(heist);
        if(this.diffMask.some(j => j === c._index)) p._diff++;

        return () => {
            p._path.pop();
            p._diff = d;
            u();
        };
    }
}

export default function createPath(heist: Heist): Path {
    return new PathImpl(heist);
}