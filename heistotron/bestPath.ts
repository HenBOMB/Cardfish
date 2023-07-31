import { Path, Board } from "../game/types";
import evaluate from "./evaluator";
import createPath from "../game/path";
import generateMoves from "./generator";

function dfsWithBacktracking(board: Board, depth: number, _path: Path | null = null): [number, Path] {
    _path = _path || createPath(board);

    if (depth === 0) {
        return [evaluate(board, _path), _path];
    }
    
    let _score = Number.NEGATIVE_INFINITY;
    
    const generated = generateMoves(board);

    for (let i = 0; i < generated.length; i++) {
        const j = generated[i];
        let end: Undo  = false;

        if(i === -1)
        {
            end = _path.end();
        }

        const u = _path.grab(board, j);
        
        if(!u) continue;

        const [score, path] = dfsWithBacktracking(board, depth - 1, _path);
        
        u();
        end && end();
        
        if (score > _score) {
            _score = score;
            //_path = path;
        }
    }
    
    return [_score, _path];
}

export default function bestPath(board: Board, maxDepth: number): [number, Path] {
    return dfsWithBacktracking(board, maxDepth);
}
