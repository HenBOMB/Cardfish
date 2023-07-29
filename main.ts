import { createMatch } from './src/match';
import { Torch, Guard, Traitor, Sneak, Door } from './src/cards/all';

const match = createMatch();

match.setDeck([
    Torch(), Guard(), Guard(), 
    Guard(), Traitor(), Sneak(), 
    Torch(), match.getThief(), Door()
]);
match.deal();

// < ^ ^ > v v> ^ ^
match.play([6, 3, 0, 1, 4, 8, 5, 2]);