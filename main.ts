import { createHeist } from './game/heist';
import { Torch, Guard, Traitor, Sneak, Door } from './game/cards/all';
import { createThief } from './game/cards/thief';

const heist = createHeist();
const thief = createThief(7);

heist.begin(thief, [
    Torch(), Guard(), Guard(), 
    Guard(), Traitor(), Sneak(), 
    Torch(), Door()
]);

// < ^ ^ > v v> ^ ^
// [6, 3, 0, 1, 4, 8, 5, 2]
// heist.play();
