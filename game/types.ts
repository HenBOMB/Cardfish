export type Undo = () => void;

export interface Heist {
    thief: Thief;
    board: Board;
    
    /**
     * Plays a specified path of actions.
     * @param path - An array of numbers representing the sequence of actions to be played.
     */
    play: (path: Path) => void;

    /**
     * Undoes the last action performed.
     */
    undo: () => void;
}

export interface Board {
    thief: Thief;

    /**
     * Shuffles the deck randomly.
     */
    shuffle: () => void;

    /**
     * Deals as many cards as possible and returns the number of cards dealt.
     * @returns The number of cards dealt.
     */
    deal: () => number;

    /**
     * Retrieves a card from the current hand using its index.
     * @param i - The index of the card to retrieve.
     * @returns The card at the specified index.
     */
    getCard: (i: number) => Card;

    /**
     * Sets a card in the current hand using its index.
     * @param i - The index of the card to set.
     * @param card - The card to set.
     * @returns An undo function that restores the previous card.
     */
    setCard: (i: number, card?: Card) => Undo;

    /**
     * Retrieves all the cards from the hand.
     * @returns An array of Card objects representing the used deck.
     */
    getCards: () => Card[];
    
    /**
     * Retrieves the entire current deck of cards.
     * @returns An array containing all the cards in the current deck.
     */
    getDeck: () => Card[];
}

export interface Path {
    end(): Undo;
    isEnd(): boolean;
    getDiff: () => number;
    getPath: () => number[];
    getLast: (board: Board) => Card | null;
    getInitStealth: () => number;
    select: (board: Board, i: number) => Undo | false;
}

// ? CARD TYPES

export interface Card {
    id: string;
    is(type: string): boolean;
    isLit(board: Board): boolean;
    select(board: Board): Undo;
    getValue(path: Path): number;
}

export interface Thief extends Card {
    getStealth(): number;
    getTreasures(): number;
    getStartPos: () => number;
}

export interface Guard extends Card {

}

export interface Equipment extends Card {

}

export interface Obstacle extends Card {

}

export interface Torch extends Card {

}

export interface Stealth extends Card {

}

export interface Treasure extends Card {

}

export interface Trap extends Card {

}
