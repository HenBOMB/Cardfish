import { Path, Board, Undo } from "../game/types";
import evaluate from "./evaluator";
import generateMoves from "./generator";

export var count = 0;

function dfsWithBacktracking(board: Board, depth: number): [number, number[]] {
    const generated = generateMoves(board);

    if (depth === 0 || board.path.isEnd() || !generated.length) {
        return [evaluate(board, board.path), board.path.getPath()];
    }
    
    let _score = Number.NEGATIVE_INFINITY;
    let _path: number[] = [];

    for (let i = 0; i < generated.length; i++) {
        const j = generated[i];
        let u: Undo | false  = false;

        if(j === -1)
        {
            u = board.path.end();
        }
        else {
            u = board.path.select(board, j);
        } 

        if(!u) continue;

        count++;

        const [score, path_] = dfsWithBacktracking(board, depth - 1);
        
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
