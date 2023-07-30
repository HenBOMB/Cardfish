interface MatchInt {
    thief: Thief;
    hand: Hand;
    
    begin: (thief: Thief, deck: Card[]) => void;

    /**
     * Plays a specified path of actions.
     * @param path - An array of numbers representing the sequence of actions to be played.
     */
    play: (path: number[]) => void;

    /**
     * Undoes the last action performed.
     */
    undo: () => void;
}

interface HandInt {
    thief: Thief;

    isFull: () => boolean;

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

interface CardInt {
    /** The unique identifier of the card. */
    id: string;

    /**
     * Triggers the card's effect when attempted to grab and returns an object that allows undoing the action.
     * @param match - The ongoing match where the card's effect is triggered.
     * @returns An object representing the action that can be undone.
     */
    trigger(match: Match): Undo;
}

interface ThiefInt extends CardInt {
    _stealth: number;
    _treasures: number;
}

export type Undo = () => void;

export type Match = MatchInt;
export type Hand = HandInt;
export type Card = CardInt;
export type Thief = ThiefInt;