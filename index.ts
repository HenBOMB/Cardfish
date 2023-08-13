// ! WARNING: OUTDATED
import { Torch, Guard, Pouch, Sneak, Door, Exit, Traitor, Chest, Cloak, Hide } from './game/cards/all';
import solve from './heistotron/solver';
import Debug from './debug';
import { createHeist } from './game/heist';

const heist = createHeist(
	6, 
	[
		Cloak(5, 3)
	],
	[
		Pouch(), Guard(2), Torch(),
		Torch(), Traitor(), Guard(3),
		Sneak(), Guard(0),
		
		Guard(1), Torch(), Torch(),
		Door(3),  Guard(3),
		Pouch(), Guard(0), Sneak(),
		
		Torch(), Chest(), Sneak(2),
		Guard(1), Torch(), Guard(3, 2),
		Guard(0), Pouch(),

		Pouch(), Pouch(), Guard(3),
		Torch(), Sneak(2), Guard(3),
		Guard(1, 2), Torch(),

		Torch(), Hide(),
		Door(0), Torch(), Guard(3),
		Torch(), Torch(), Guard(0),

		Torch(), Guard(2), Exit(0), // ? Unknown lock dir
		Sneak(), Pouch(), Sneak(), 
		Torch(), Sneak()
	]       
);
	
console.clear();

heist.play([6, 7, 8, 5, 4, 2, 1, 0, 3]);

heist.play([3, 0, 1, 2, 4, 5, 8, 7, 6]);

heist.play([-3], [heist.thief._index]); //? cloak lvl 3

heist.play([6, 3, 7, 4, 0, 1, 2, 5, 8]);

heist.play([8, 5, 7, 6, 3, 0, 1, 4, 2]);

heist.play([2, 1, 5, 8, 4, 0, 3, 6, 7]);

// ? Manual evaluation

/*
Path (7) > 3 > 0 > 0 > 3 > 6 > 7 > 8 > 5 > 4 > 1 > 2

Stealth: 7 (0) | Treasures: 82 (0)
Difficulty: 1
Score: 21.25 (0)
*/

/*
*/

console.log('Waiting...');
// var state: any = solve(heist, 2);
// const state = [
//   [
//     7, 6, 3, 0, 0, 3, 6,
//     7, 8, 5, 4, 1, 1, 0,
//     3, 6, 4, 2, 5, 7, 8
//   ],
//   2,
//   106,
//   464
// ];

heist.setDeck([
	Guard(1), Torch(), Torch()
]);

heist.play([7, 6, 3, 0]);

var state: any = solve(heist, 0);
//console.log(state);

Debug(heist, state as any);