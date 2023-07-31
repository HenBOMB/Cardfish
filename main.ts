import { createHeist } from './game/heist';
import { Torch, Guard, Traitor, Sneak, Door } from './game/cards/all';
import bestPath, { count } from './heistotron/bestPath';

const heist = createHeist(7, [
    Torch(), Guard(), Guard(), 
    Guard(), Traitor(), Sneak(), 
    Torch(), Door()
]);

// < ^ ^ > v v> ^ ^
/** ^ > ^
 *  ^ v ^
 *  < < >
 */
// [6, 3, 0, 1, 4, 8, 5, 2]

const [ score, path ] = bestPath(heist.board, 8);

console.log('score: ', score);
console.log('path: ', ...path);
console.log('count: ', count);
