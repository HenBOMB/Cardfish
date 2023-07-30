import { createMatch } from './src/match';
import { Torch, Guard, Traitor, Sneak, Door } from './src/cards/all';
import { createThief } from './src/cards/thief';

const match = createMatch();

match.begin(createThief(), [
    Torch(), Guard(), Guard(), 
    Guard(), Traitor(), Sneak(), 
    Torch(), Door()
]);

// move?
// match.thief.set()

console.log(match.hand.deal());

// < ^ ^ > v v> ^ ^
match.play([6, 3, 0, 1, 4, 8, 5, 2]);
