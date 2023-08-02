
import readlineSync from 'readline-sync';
import { Heist, Undo } from './game/types';
// import readline from 'readline';

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// function getUserInput(prompt: string): Promise<boolean> {
//   return new Promise((resolve) => {
//         rl.question(prompt, (answer) => {
//             resolve(answer === 'y');
//         });
//     });
// }

type State = {
    index: number;
    stealth: number;
    treasures: number;
    cards: { 
        id: string, 
        index: number, 
        value: number, 
        selectable: boolean 
    }[];
};

export default function Debug (
    heist: Heist, 
    state: [number[], number, number, number]
): void {
    const [ path, iS, iT ] = state;
    const board = heist.board;

    // ! Cache all states
    const states: State[] = [];
    const undos: Undo[] = [];
    const vals: { [key: string]: number } = { };

    for (let i = 0; i < path.length; i++) {
        const index = path[i];
        const card = board.getCard(index);
        const undo = board.path.select(board, card);

        if(undo) undos.push(undo);

        vals[index] = card.getValue(board);

        const stealth = heist.thief.getStealth();
        const treasures = heist.thief.getTreasures();
        const cards = Array(9).fill(null).map((e, i) => {
            const card = board.getCard(i);
            return {
                index: i,
                id: card.id,
                value: vals[i] || card.getValue(board),
                selectable: vals[i]? false : card.isSelectable(board),
            };
        });

        states.push({ index, stealth, treasures, cards });
    }

    undos.forEach(u => u());

    // ! Play with full control

    for (let i = 0; i < states.length;) 
    {
        const { index, stealth, treasures, cards } = states[i];
        
        console.clear();
        console.log(`Path ${path.map(h => h===index? `(${h})` : h).join(' > ')}`);

        // const sDiff = stealth - (states[i-1]?.stealth || 0);
        // states.slice(0,i).reduce((a, b) => a + b.stealth, 0);
        //const tDiff = treasures - (states[i-1]?.treasures || treasures);
        const tSum = '';//!tDiff? '' : `(${tDiff > 0? '+' + tDiff : '-' + Math.abs(tDiff)})`;
        console.log(`Stealth: ${stealth}/${path.length===9? iS < 10? 10 : iS : iS} | Treasures: ${treasures}/${iT} ${tSum}\n`);
        
        const _cards = cards.map(({ id, index, value, selectable }) => {
            if(id === 'thief') 
            {
                return `${id} [${stealth}, ${treasures}]`;
            }
            return `${id[0].toUpperCase() + id.slice(1, 5)} ${(path.slice(0,i+1).includes(index)? '<v>' : (selectable? '(v)' : `[v]`)).replace('v', value as any)}`;
        });

        console.log(_cards.slice(0,3).join('\t'));
        console.log(_cards.slice(3,6).join('\t'));
        console.log(_cards.slice(6,9).join('\t'));
        console.log("\nUse <←> / <→> to navigate path. <q> to quit.");
        
        let key = '';
        let arrow = '';

        while(true)
        {
            key = readlineSync.keyIn('', { hideEchoBack: true, mask: '' });
            if (key === '[') {
                const k = readlineSync.keyIn('', { hideEchoBack: true, mask: '' });
                // < = D, ^ = A, > = C, v = B
                if (k === 'D' || k === 'A' || k === 'C' || k === 'B') arrow = k;
            }
            break;
        }

        if(arrow === 'C') 
        { 
            i++;
        }
        else if(arrow === 'D' && i > 0) 
        {
            i--;
        }

        if(key === 'q') 
        {
            break;
        }
    }

    console.log('Debugger has ended.');
};