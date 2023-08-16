import { MAP, Torch, Guard, Pouch, Sneak, Door, Exit, Traitor, Chest, Cloak, Hide } from './game/cards/all';
import solve from './heistotron/solver';
import evaluate from './heistotron/evaluator';
import Debug from './debug';
import createHeist from './game/heist';
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

function read(path: string, cb: (data: object) => void): void
{
	fetch(path).then(async (r) => cb(await r.json()))
}

function load(i: number): Promise<Heist> {
	const cb = ix => {
		const args = ix.split(':');
		const cb = MAP[args[0]];
		const card = cb(...args.slice(1));
		if (!card) console.log('Missing', ix);
		return card;
	}
	return new Promise(res => {
		read('./data/games.json', (data) => {
			const { deck, plays, equip } = data[i];
			res(createHeist(
				plays[0][0],
				equip.map(cb),
				deck.map(cb)
			));
		});
	});
}

async: {
	const heist = await load(0);
	
	var [score, state, pot]: any = solve(heist, 1, 1);
	console.log(state);
	console.log('score', score);
	console.log('path', state[0]);
	console.log('stealth', state[1], 'treasures', state[2]);

	if(!pot) return;
	[score, state, pot] = pot[0];
	
	console.log('best');
	
	console.log('score', score);
	console.log('path', state[0]);
	console.log('stealth', state[1], 'treasures', state[2]);
	
}
