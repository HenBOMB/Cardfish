import { createBoard } from './board';
import { createThief } from './cards/thief';
import { Heist, Card, Undo, Thief, Board, Path } from './types';

class HeistImpl implements Heist {
    thief: Thief;
    board: Board;
    
    private _undos: (() => void)[];
    
    constructor(i: number, deck: Card[]) {
        this._undos = [];
        this.thief = createThief(i);
        this.board = createBoard(this.thief, deck);
        this.board.deal();
        this.thief.select(this.board);
    }

    // ? Getting rid of card costs stealth points.

    /** THE PATH
     * For every card in your path that is not adjacent to your Thief, the path diff increases by 1.
     * A card that increases the path diff has a little arrow icon ^.
     * All card values are multiplied with the current path diff.
     * stealth > 0 = invisible
     */

    // TODO

    /** SNEAK
     * Gets multiplied if it can increase.
     * Returns stealth points.
     */

    /** HIDE
     * Hide cards restore your stealth to 10 points.
     * In order to hide you have to end your path on the hide card.
     */

    /** LIGHT
     * Torches illuminate cards next to them and influence their value.
     * Illuminated enemies become stronger (+1) and hide cards become useless.
     */

    /** GUARDS
     * If they see you and you have 0 stealth points left they will capture you!
     * Obstacles like torches or doors can not capture you even if your stealth has run out.
     * A guard's facing direction is indicated by the view cone icon on its border.
     * The opposite side of a guards facing direction is it's backside.
     * If you approach a guard in the shadow from his backside, you don't have to spend any stealth points. Gives you treasure instead.
     * Cards that are watched by a guard have an eye icon on their bottom.
     * If you select a card that was watched by a guard, the guard is alerted (!) and gets +1 permanently.
     * Selecting an illuminated adjacent card makes a guard suspicious (?) and turns him into that card's direction.
     * If a guard's value is higher than your remaining stealth points, he will capture you.
     * When you deselect cards, guards will restore their initial state.
     */

    /** EQUIPMENT
     * Each heist you can take equipment cards with you. (3)
     * Your inventory can hold up to 3 cards.
     * Equipment cards are used becore you start your path.
     */

    /** TREASURES
     * The total amount of treasure stolen is the game's highscore.
     * Each castle deck has a limited amount of treasure cards.
     * To pickpocket guards they have to be standing in the shadow.
     */

    /** CHESTS
     * Finally, each gameyou have to steal the castles chest card.
     * You find the chest card when half the deck is dealt.
     * You need a free inventory slot to carry the chest out of the castle.
     * Chests will become more valuable the longer they stay on the board.
     * After a turn their value will increase by +1 and the potential for better opened loot will increase.
     * Picking up a chest will also grant you a treasure bonus.
     * The chest bonus equals the current chest value multiplied by the path difficulty.
     */
    
    play(path: number[]): void {
        if(this.thief.isCaught()) {
            return;
        }

        path.forEach(i => this.board.path.select(this.board, i));
        
        if(this.board.path.isEnd()) {
            this.thief.setStealth(this.thief.getStealth() < 10? 10 : this.thief.getStealth());
        }

        this.board.deal();
    }
    
    undo(): void {
        this._undos.length && this._undos.shift()!();
    }
}


export function createHeist(i: number, deck: Card[]): Heist {
    return new HeistImpl(i, deck);
}