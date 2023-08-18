import { Equipment } from "./cards/types";

export type Undo = () => void;

export interface Heist {
    thief: Thief;

    path: Path;

    /**
     * Shuffles the deck randomly.
     */
    shuffle: () => void;

    /**
     * Deals as many cards as possible and returns the number of cards dealt.
     */
    deal: () => void;

    play: (path: number[], other?: number[]) => void;

    /**
     * Retrieves a card from the current hand using its index.
     * @param i - The index of the card to retrieve.
     * @returns The card at the specified index.
     */
    getCard: (i: number) => Card;

    getEquipment(i: number): Equipment;

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
    getCards: (all?: boolean) => Card[];
    
    genCards: (count: number) => Card[];

    /**
     * Sets the current deck of cards.
     * @param deck - An array of Card objects representing the new deck.
     */
    setDeck: (deck: Card[]) => void;

    /**
     * Retrieves the entire current deck of cards.
     * @returns An array containing all the cards in the current deck.
     */
    getDeck: () => Card[];

    getGuards: (exclude?: number) => Guard[];

    getAdj: (card: Card) => Card[];

    getPerp: (card: Card) => Card[];
}

export interface Path {
    isEnd(): boolean;
    isIn(index: number): boolean;
    getDiff: () => number;
    getPath: () => number[];
    getLast: (heist: Heist) => Card;
    getInitStealth: () => number;
    getState: () => [number[], number, number];
    select: (heist: Heist, i: Card | number) => Undo | null;
}

// ? CARD TYPES

export interface Card {
    getValue(heist?: Heist): number;
    id: string;
    _index: number;

    is(type: Card | string): boolean;
    isLit(heist: Heist): boolean;
    isWatched(heist: Heist): boolean;
    isSelectable(heist: Heist): boolean;
	getValue(heist: Heist): number;
	setValue(value: number): Undo;
    getModifier(key: string): number;
    setModifier(key: string, value: number): Undo;
    place(heist: Heist, index: number): void;
    select(heist: Heist): Undo;
}
