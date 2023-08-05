
import readlineSync from 'readline-sync';
import evaluate from './heistotron/evaluator';
import { Output, deepClone } from './heistotron/bestPath';
import { Heist } from './game/types';
import createPath from './game/path';
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
    diff: number;
    stealth: number;
    treasures: number;
    score: number;
    cards: { 
        id: string, 
        value: number, 
        selectable: boolean,
        selected: boolean 
    }[];
};

export default function Debug (
    heist: Heist, 
    state: Output
): void {
    heist = deepClone(heist);
    const [ fSc, fState ] = state;
    const [ path, fS, fT ] = fState;

    const iSc = evaluate(heist);
    const iS = heist.thief.getValue();
    const iT = heist.thief.getScore();

    // ! Cache all states
    
    let vals: { [key: string]: number } = { };
    let prev = -1;

    const states: State[] = Array(path.length).fill(null).map((_, i) => {
        const index = path[i];

        if(prev === index)
        {
            // ? TODO: We must deal the same rng cards we used before to find this path.
			// clone.setDeck([]);

            if(heist.path.isEnd()) 
            {
                heist.thief.setValue(heist.thief.getValue() < 10? 10 : heist.thief.getValue());
            }

            const path = heist.path.getPath();

            path.forEach(i => heist.setCard(i));

            heist.setCard(heist.thief._index);
            heist.thief._index = path[path.length-1];
            heist.setCard(heist.thief._index, heist.thief);

            heist.path = createPath(heist);
            heist.deal();
            vals = {};
        }

        prev = index;

        const card = heist.getCard(index);

        vals[index] = card.getValue(heist);
      
        heist.path.select(heist, card);
        
        const score = evaluate(heist);
        const diff = heist.path.getDiff();
        const stealth = heist.thief.getValue();
        const treasures = heist.thief.getScore();
        const cards = Array(9).fill(null).map((e, i) => {
            const card = heist.getCard(i);
            return {
                id: card.id,
                value: vals[i] || card.getValue(heist),
                selectable: vals[i]? false : card.isSelectable(heist),
                selected: heist.path.getPath().includes(i)
            };
        });

        return { index, score, diff, stealth, treasures, cards };
    });
    
    // ! Play with full control

    for (let i = 0; i < states.length;) 
    {
        const { score, diff, stealth, treasures, cards } = states[i];
        
        console.clear();
        console.log(`Path ${path.map((h, j) => i===j? `(${h})` : h).join(' > ')}`);

        const dSc = Math.round((score - iSc)*100)/100;
        const dS = stealth - iS;
        const dT = treasures - iT;
        // console.log(`Stealth: ${stealth}/${path.length===9? fS < 10? 10 : fS : fS} | Treasures: (${dT > 0? '+' : '-'}${dT})`);
        console.log(`\nStealth: ${fS} (${dS > 0? '+' : ''}${dS}) | Treasures: ${fT} (${dT > 0? '+' : ''}${dT})`);
        console.log(`Difficulty: ${diff}`);
        console.log(`Score: ${Math.round(score*100)/100} (${dSc > 0? '+' : ''}${dSc}/${fSc})\n`);

        const _cards = cards.map(({ id, value, selectable, selected }) => {
            if(id === 'thief') 
            {
                return `${id} {${stealth}, ${treasures}}`;
            }
            return `${id[0].toUpperCase() + id.slice(1, 5)} ${(selected? '<v>' : (selectable? '(v)' : `[v]`)).replace('v', value as any)}`;
        });

        console.log(_cards.slice(0,3).join('\t'));
        console.log(_cards.slice(3,6).join('\t'));
        console.log(_cards.slice(6,9).join('\t'));
        console.log("\nUse <←> / <a> / <→> / <d> to navigate path. <q> to quit.");
        
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

        if(arrow === 'C' || key === 'd') 
        { 
            i++;
        }
        else if((arrow === 'D' || key === 'a') && i > 0) 
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

function logState(state: State)
{

}