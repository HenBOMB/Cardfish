import { createHeist } from './game/heist';
import { Torch, Guard, Pouch, Sneak, Door } from './game/cards/all';
import bestPath, { count } from './heistotron/bestPath';
import generate from './heistotron/generator';

const heist = createHeist(5, [
    Pouch(), Guard(2), Torch(),
    Sneak(), Torch(), 
    Guard(1), Pouch(), Guard(3) 
]);
/**
* 0 1 2
* 3 4 5
* 6 7 8
*/
// ? Set each guard's looking direction
/** Best path possibilities:
* 5, 2, 4, 8, 7, 6, 3, 1, 0. stealth: 7, treasures: 9 (+9).
* ? this path ends with a potential 5 diff path.
* 
* 5, 2, 1, 4, 8, 7, 6, 3, 0. stealth: 6 (-4), treasures: 8 (+8).
* 
*/

// heist.board.path.select(heist.board, heist.board.getCard(4));
// console.log(heist.board.getCards().map(c => [c.id, c.getValue(heist.board)]));

console.clear();

const [ score, path ] = bestPath(heist.board);

console.log('score: ', score);
console.log('path: ', path);
console.log('found: ', count);