import { createMatch } from './src/match';
import { Torch, Guard, Traitor, Sneak, Door } from './src/cards/all';
import { createThief } from './src/cards/thief';

const match = createMatch();
const thief = createThief(7);

match.begin(thief, [
    Torch(), Guard(), Guard(), 
    Guard(), Traitor(), Sneak(), 
    Torch(), Door()
]);

console.log(match.hand.deal());

// < ^ ^ > v v> ^ ^
match.play([6, 3, 0, 1, 4, 8, 5, 2]);
