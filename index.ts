import { createHeist } from './game/heist';
import { Torch, Guard, Pouch, Sneak, Door, Traitor, Chest } from './game/cards/all';
import bestPath from './heistotron/bestPath';

import readline from 'readline';
import readlineSync from 'readline-sync';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getUserInput(prompt: string): Promise<boolean> {
  return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer === 'y');
        });
    });
}
function readChar(): string {
  const key = readlineSync.keyIn('', { hideEchoBack: true, mask: '' });
  return key;
}

const heist = createHeist(6, [
    Pouch(), Guard(2), Torch(),
    Torch(), Traitor(), Guard(3),
    Sneak(), Guard(0),

    Guard(1), Torch(), Torch(),
            Door(3),  Guard(3),
    Pouch(), Guard(0), Sneak(),

    Torch(), Chest(), Sneak(2),
    Guard(1), Torch(), Guard(3),
            Guard(0), Pouch()

]);

console.clear();
console.log('=======================')

// var state = bestPath(heist);
// ? 6, 7, 8, 5, 4, 2, 1, 0, 3
heist.play([6, 7, 8, 5, 4, 2, 1, 0, 3]);

// var state = bestPath(heist);
heist.play([3, 0, 1, 2, 4, 5, 8, 7, 6]);

var state = bestPath(heist);

// ? Useful for debugging
(async (state: [number[], number, number, number]) => {
    const [ iPath, iS, iT ] = state;
    const board = heist.board;
    const path = [...iPath];
    const values: { [i: number]: number } = {};
    let j = 0;

    while(path.length > 0) {
        const index = path.shift()!;
        const value = board.getCard(index).getValue(board);
        values[index] = value;

        if(index !== heist.thief.index) board.path.select(board, index);
        
        const s = heist.thief.getStealth();
        const t = heist.thief.getTreasures();

        console.clear();
        console.log(`Path ${iPath.map(h => h===index? `(${h})` : h).join(' > ')}`);
        console.log(`Stealth: ${s}/${iPath.length===9? iS < 10? 10 : iS : iS} | Treasures: ${t}/${iT}\n`);
        
        const cards = Array(9).fill(null).map((e, i) => {
            const c = board.getCard(i);
            if(c.is('thief')) return `${c.id[0].toUpperCase()+c.id.slice(1)} [${s}, ${t}]`;
            const z = (board.path.isIn(c.index)? '{v}' : (c.isSelectable(board)? '(v)' : `[v]`)).replace('v', (board.path.isIn(c.index)? values[c.index as any] : c.getValue(board)) as any);
            return `${c.id[0].toUpperCase()+c.id.slice(1, 5)} ${z}`;
        });

        console.log(cards.slice(0,3).join('\t'));
        console.log(cards.slice(3,6).join('\t'));
        console.log(cards.slice(6,9).join('\t'));
        
        console.log("\nMatches? y/n");
        let c = '';

        while(true)
        {
            c = readChar();
            break;
        }

        if(c === 'n' || c === 'q') 
        {
            break;
        }

        j++;
    }

    console.log('Debugger has ended.');
    console.log(`Results: ${j}/${iPath.length}`);
})(state as any);
