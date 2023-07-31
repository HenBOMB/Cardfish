import { Board, Path } from "../game/types";

const WEIGHTS: number[] = [
    10,
    1,
];

export default function evaluate(board: Board, path: Path, weights: number[] = WEIGHTS): number {
    const [ SxAa, SxAb, SxAc, SxAd, SxAe, SxAf ] = weights;
    const path_ = path.getPath();

    let _score = 0;

    _score += path_.length * SxAa;

    _score += path_.filter(i => board.getCard(i).is('treasure')).length * SxAb;

    if(path.isEnd()) { 
        _score += SxAc;
    }

    // ? This leads to higher path difficulty. More costly?
    _score = path_.length === 8? 999 : _score;//moves.length === 3? 3 : moves.length === 5? 2 : 1;

    // TODO ? penalize for ending on bad square

    return 0;
}