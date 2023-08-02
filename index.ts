import { createHeist } from './game/heist';
import { Torch, Guard, Pouch, Sneak, Door, Traitor, Chest } from './game/cards/all';
import bestPath from './heistotron/bestPath';
import Debug from './debug';

const heist = createHeist(6, [
    Pouch(), Guard(2), Torch(),
    Torch(), Traitor(), Guard(3),
    Sneak(), Guard(0),

    Guard(1), Torch(), Torch(),
            Door(3),  Guard(3),
    Pouch(), Guard(0), Sneak(),

    Torch(), Chest(), Sneak(2),
    Guard(1), Torch(), Guard(3, 2),
            Guard(0), Pouch()
]);

console.clear();
console.log('=======================');

// var state = bestPath(heist);
heist.play([6, 7, 8, 5, 4, 2, 1, 0, 3]);

// var state = bestPath(heist);
heist.play([3, 0, 1, 2, 4, 5, 8, 7, 6]);

var state: any = bestPath(heist);

Debug(heist, state);