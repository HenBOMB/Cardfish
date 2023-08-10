import { Heist, Path } from "../game/types";

const WEIGHTS: number[][] = [
    [
        // ? Full path worth.
        100,
        // ? Exit card worth.
        200,
        // ? Stealth worth.
        0.5,
        // ? Treasure worth.
        0.25,
    ],
    [
        100,
        200,
        0.2,
        1.5,
    ]
];

const P_WEIGHTS: number[] = [
    // ? Start - end penalty worth.
    0.2,
    // ? Torch worth.
    1.0
];

export default function evaluate(heist: Heist, weights: number[][] = WEIGHTS): number {
    if(heist.thief.isCaught()) 
    {
        return -999;
    }
    
    const last = heist.path.getLast(heist);
    const isFull = heist.path.getPath().length === 9;
    const isEnd = last.is('exit');
    const stealth = heist.thief.getValue();

    const x = 1;//isFull? 1 : 0;

    const [ SxAa, SxAb, SxAc, SxAd ] = weights[x];
    
    let _score = 0;

    // ? Full path worth.
    // ! Potential
    _score += isFull? SxAa : 0;

    // ? Exit card worth.
    _score += isEnd? SxAb : 0;

    // ? Stealth worth.
    _score += (isFull? stealth > 10? stealth : 10 : stealth) * SxAc;

    // ? Treasure worth.
    _score += heist.thief.getScore() * SxAd;

    _score += heist.path.getPath().filter(i => heist.getCard(i).is('torch')).length * 1;

    // ? Dodgy
    //_score += (36 - heist.getDeck().length) * SxAf;

    // ? This leads to higher path difficulty. More costly?
    
    // ? Start - end penalty worth.
    // if(heist.path.isEnd() && !full) { 
    //     _score += (stealth - heist.path.getInitStealth()) * SxAc;
    // }

    // ! More diff (+1) paths, more costly but more score?.

    // TODO ? penalize for ending on bad square

    return _score;
}

export function potential(heist: Heist, weights: number[] = P_WEIGHTS): number {
    let _score = evaluate(heist, WEIGHTS);

    // ! Play the path and deal random cards.

    /**
     * If the heist has an exit card. Then we can calculate the potential score:
     * 
     * Calc pot score of landing on edge.
     * Bad when ending path in middle of heist.
     */



    return _score;
}