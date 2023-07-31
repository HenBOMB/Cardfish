import { Path, Board, Undo, Card } from './types';

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
    private _end: boolean;

    constructor(board: Board) {
        this.board = board;
        this.initStealth = board.thief.getStealth();
        this.diffMask = MASK[board.thief.getStartPos()];
        this._diff = 1;
        this._path = [];
        this._end = false;
    }

    // TODO Add isCaught in return
    isEnd(): boolean {
        return this._end || this._path.length === 8;
    }

    getDiff(): number {
        return this._diff;
    }

    getPath(): number[] {
        return this._path;
    }

    getLast(board: Board): Card | null {
        const i = this._path.slice(-1)[0];
        if(!i) return null;
        return board.getCard(i);
    }

    getInitStealth(): number {
        return this.initStealth;
    }

    select(board: Board, i: number): Undo | false {
        const c = board.getCard(i);
        if(this.isEnd()) return false;
        if(this._path.some(j => j === i)) return false;

        const p = this;
        const d = p._diff;
        
        p._path.push(i);
        const u = c.select(board);

        if(this.diffMask.some(j => j === i)) {
            p._diff++;
        }

        return () => {
            p._path.pop();
            u();
            p._diff = d;
        };
    }

    end(): Undo {
        const path = this;
        path._end = true;
        return () => {
            path._end = false;
        };
    }
}

export default function createPath(board: Board): Path {
    return new PathImpl(board);
}