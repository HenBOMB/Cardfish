import { Path, Board, Undo, Thief } from './types';

class PathImpl implements Path {
    private initStealth: number;

    private _diff: number;
    private _path: number[];
    private _end: boolean;

    constructor(board: Board) {
        this.initStealth = board.thief.getStealth();
        this._diff = 1;
        this._path = [];
        this._end = false;
    }

    isEnd(): boolean {
        return this._end;
    }

    getDiff(): number {
        return this._diff;
    }

    getPath(): number[] {
        return this._path;
    }

    getInitStealth(): number {
        return this.initStealth;
    }

    grab(board: Board, i: number): Undo | false {
        if(this.isEnd()) {
            return false;
        }

        const p = this;
        const c = board.getCard(i);

        p._path.push(i);
        const t = c.trigger(board)
        const s = board.setCard(i);

        return () => {
            p._path.pop();
            t();
            s();
        };
    }

    end(): Undo {
        this._end = true;
        return () => {
            this._end = false;
        };
    }
}

export default function createPath(board: Board): Path {
    return new PathImpl(board);
}