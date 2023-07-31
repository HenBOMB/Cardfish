import { Board, Card } from "../game/types";

const MAP = {
    0: [1, 3, 4],
    1: [0, 2, 3, 4, 5],
    2: [1, 4, 5],
    3: [0, 1, 4, 6, 7],
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    5: [1, 2, 4, 7, 8],
    6: [3, 4, 7],
    7: [3, 4, 5, 6, 8],
    8: [4, 5, 7],
}

export default function generate(board: Board): number[] {
    const cards = board.getCards();
    const adj = MAP[cards.findIndex(card => card.id === 'thief')];
    
    // TODO maybe filter out bad moves?

    // ? -1 is end path
    return [adj, -1];//.map((i: number) => cards[i]);
}