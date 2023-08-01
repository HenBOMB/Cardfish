import createPath from "../game/path";
import { Path, Board, Undo, Heist } from "../game/types";
import evaluate from "./evaluator";
import generateMoves from "./generator";

export var count = 0;

type State = [number[], number, number, number?];

function dfsWithBacktracking(board: Board): [number, State | null] {
    const generated = generateMoves(board);

    if (board.path.isEnd() || !generated.length) {
        return [evaluate(board), board.path.getState()];
    }
    
    let _score = Number.NEGATIVE_INFINITY;
    let _state: State | null = null;

    for (let i = 0; i < generated.length; i++) {
        const j = generated[i];
        let u: Undo | false  = board.path.select(board, j);

        if(!u) continue;

        count++;

        const [score, state] = dfsWithBacktracking(board);
        
        u();
        
        if(score === 999) {
            return [score, state];
        }

        if (score > _score) {
            _score = score;
            _state = state!;
        }
    }
    
    return [_score, _state];
}

export default function bestPath(heist: Heist): State {
    count = 0;
    heist.board.path = createPath(heist.board);

    const [ score, state ] = dfsWithBacktracking(heist.board);

    return [state![0], state![1], state![2], score];
}
