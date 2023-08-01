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

export default function evaluate(board: Board, weights: number[] = WEIGHTS): number {

    if(board.thief.isCaught()) {
        return -999;
    }

    const [ SxAa, SxAb, SxAc, SxAd, SxAe, SxAf ] = weights;

    const full = board.path.getPath().length === 9;
    const stealth = board.thief.getStealth();
    const treasures = board.thief.getTreasures();
    
    let _score = 0;

    if(board.path.isEnd() && !full) { 
        _score += (stealth - board.path.getInitStealth()) * SxAc;
    }

    _score += (full? stealth > 10? stealth : 10 : stealth) * SxAd;

    _score += treasures * SxAe;

    // ? Dodgy
    _score += (36 - board.getDeck().length) * SxAf;

    // ? This leads to higher path difficulty. More costly?
    _score += full? 999 : 0;//moves.length === 3? 3 : moves.length === 5? 2 : 1;
    
    // TODO ? penalize for ending on bad square

    return _score;
}