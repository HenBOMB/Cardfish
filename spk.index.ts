import { Torch, Guard, Pouch, Sneak, Door, Exit, Traitor, Chest, Cloak, Hide } from './game/cards/all';
import bestPath from './heistotron/bestPath';
import evaluate from './heistotron/evaluator';
import Debug from './debug';
import { createHeist } from './game/heist';
import createPath from './game/path';

function display(c)
{
	console.log(c.slice(0, 3));
	console.log(c.slice(3, 6));
	console.log(c.slice(6, 9));
}

function test(heist: Heist, path: number[]): void {
	heist.path = createPath(heist);
	const u = path.slice(1).map(i => heist.path.select(heist, i));
	console.log(evaluate(heist), heist.thief.getValue(), heist.thief.getScore());
	u.forEach(u => u());
}

async function read(path: string, cb: (data: object) => void): void
{
	fetch(path).then(async (r) => cb(await r.json()))
}

async function load(id: number): Heist {
	
}

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
		Door(3), Guard(3),
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
		Torch(), Sneak(),
		
		Guard(1), Torch(), Torch(),
		
		Guard(1), Guard(2),
		Guard(1), Torch(), Torch(),
		Guard(3)
	]
);

console.clear();

console.log(heist._deck.map(c=>c.id).join("\", \""));

return


// Finished with score 80

read('./data/games.json', (data) => {
	
});

return;

var [ score, state ]: any = bestPath(heist, 1);

console.log('score', score);
console.log('state', ...state);

return
console.log('best', ...state[1][0]);
console.log('wost', ...state[1][1]);
