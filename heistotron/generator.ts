import { Board, Card, Path } from "../game/types";

const MAP = [
    [1, 3, 4],
    [0, 2, 3, 4, 5],
    [1, 4, 5],
    [0, 1, 4, 6, 7],
    [0, 1, 2, 3, 5, 6, 7, 8],
    [1, 2, 4, 7, 8],
    [3, 4, 7],
    [3, 4, 5, 6, 8],
    [4, 5, 7],
];

export default function generate(board: Board, path: Path): number[] {
    const i = 
        path.getPath().slice(-1)[0] || 
        board.getCards().findIndex((card: Card) => card.is('thief'));
    
    // TODO maybe filter out bad moves?

    // ? -1 is end path
    return [...MAP[i]].filter(i => !path.getPath().some(j => j === i));
}