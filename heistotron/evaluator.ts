import { Board, Path } from "../game/types";

const WEIGHTS: number[] = [
    // ? Unknown
    0.0,
    // ? Unknown
    0.0,
    // ? Start - end penalty worth.
    0.2,
    // ? Stealth worth.
    0.5,
    // ? Treasure worth.
    0.2,
    // ? Card worth.
    1.0
];

export default function evaluate(board: Board, path: Path, weights: number[] = WEIGHTS): number {

    if(board.thief.isCaught()) {
        return -999;
    }

    const [ SxAa, SxAb, SxAc, SxAd, SxAe, SxAf ] = weights;
    const path_ = path.getPath();

    let _score = 0;

    if(path.isEnd()) { 
        _score += (board.thief.getStealth() - path.getInitStealth()) * SxAc;
    }

    _score += board.thief.getStealth() * SxAd;

    _score += board.thief.getTreasures() * SxAe;

    // ? Dodgy
    _score += (36 - board.getDeck().length) * SxAf;

    // ? This leads to higher path difficulty. More costly?
    _score = path_.length === 9? 999 : _score;//moves.length === 3? 3 : moves.length === 5? 2 : 1;

    // TODO ? penalize for ending on bad square

    return _score;
}