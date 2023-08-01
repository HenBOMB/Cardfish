import { createHeist } from './game/heist';
import { Torch, Guard, Pouch, Sneak, Door } from './game/cards/all';
import bestPath, { count } from './heistotron/bestPath';
import generate from './heistotron/generator';

const heist = createHeist(5, [
    Pouch(), Guard(2), Torch(),
    Sneak(2), Torch(), 
    Guard(1), Pouch(), Guard(3) 
]);

/*
* 0 1 2
* 3 4 5
* 6 7 8
*/

console.clear();
console.log('=======================')

// * path: 5, 4, 2, 1, 0, 3, 6, 7, 8 / s: 2 / t: 14 / s: 1042.8
const [ path, stealth, treasures, score ] = bestPath(heist);

console.log('s: ', score);
console.log('p: ', path);
console.log('s: ', stealth);
console.log('t: ', treasures);

// ? Useful for debugging.
console.log(path.slice(1).map(i => {
    const u = heist.board.path.select(heist.board, i);
    const s = heist.thief.getStealth();
    const t = heist.thief.getTreasures();
    const cards = heist.board.getCards().map(c => [c.id[0], c.getValue(heist.board)].join(': ')).join(', ');
    return `${i}) s: ${s} t: ${t}\n${cards}`;
}).join('\n\n'));

// heist.play(path);