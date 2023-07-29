interface MatchInt {
    play: (path: number[]) => void;
    undo: () => void;
    deal: () => void;
    getCard: (i: number) => Card;
    getDeck: () => Card[];
    getThief: () => Thief;
    setDeck(deck: Card[]);
}

interface CardInt {
    id: string;
    trigger(match: Match): Undo;
}

interface ThiefInt extends CardInt {

}

export type Undo = () => void;

export type Match = MatchInt;
export type Card = CardInt;
export type Thief = ThiefInt;