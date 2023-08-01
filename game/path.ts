import { Path, Board, Undo, Card, Guard } from './types';

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
    private board: Board;
    private diffMask: number[];

    private _diff: number;
    private _path: number[];

    constructor(board: Board) {
        this.board = board;
        this.initStealth = board.thief.getStealth();
        this.diffMask = MASK[board.thief.getStartPos()];
        this._diff = 1;
        this._path = [board.thief.getStartPos()];
    }

    isEnd(): boolean {
        return this._path.length === 9 ||
            this.board.thief.isCaught();
    }

    getDiff(): number {
        return this._diff;
    }

    getPath(): number[] {
        return this._path;
    }

    getLast(board: Board): Card {
        const i = this._path.slice(-1)[0];
        return board.getCard(i);
    }

    getInitStealth(): number {
        return this.initStealth;
    }

    getState(): [number[], number, number] {
        return [[...this.getPath()], this.board.thief.getStealth(), this.board.thief.getTreasures()];
    }

    select(board: Board, i: Card| number): Undo | false {
        const c = typeof i === 'number'? board.getCard(i) : i;
        if(this.isEnd()) return false;
        if(this._path.some(j => j === i)) return false;

        const p = this;
        const d = p._diff;
        
        p._path.push(c.index);
        const u = c.select(board);
        if(this.diffMask.some(j => j === i)) p._diff++;

        return () => {
            p._path.pop();
            p._diff = d;
            u();
        };
    }
}

export default function createPath(board: Board): Path {
    return new PathImpl(board);
}