import { Path, Board, Undo } from "../game/types";
import evaluate from "./evaluator";
import createPath from "../game/path";
import generateMoves from "./generator";

export var count = 0;

function dfsWithBacktracking(board: Board, depth: number, path: Path | null = null): [number, number[]] {
    path = path || createPath(board);
    const generated = generateMoves(board, path);

    if (depth === 0 || path.isEnd() || !generated.length) {
        return [evaluate(board, path), path.getPath()];
    }
    
    let _score = Number.NEGATIVE_INFINITY;
    let _path: number[] = [];

    for (let i = 0; i < generated.length; i++) {
        const j = generated[i];
        let u: Undo | false  = false;

        if(j === -1)
        {
            u = path.end();
        }
        else {
            u = path.select(board, j);
        } 

        if(!u) continue;

        count++;

        const [score, path_] = dfsWithBacktracking(board, depth - 1, path);
        
        u();
        
        if(score === 999) {
            return [score, [...path_]];
        }

        if (score > _score) {
            _score = score;
            _path = [...path_];
        }
    }
    
    return [_score, _path];
}

export default function bestPath(board: Board, maxDepth: number): [number, number[]] {
    count = 0;
    return dfsWithBacktracking(board, maxDepth);
}
