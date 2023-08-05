
import readlineSync from 'readline-sync';
import evaluate from './heistotron/evaluator';
import { deepClone, State as Output } from './heistotron/bestPath';
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
    const [ fSc, paths, heists ] = state;

    const iSc = evaluate(heist);
    const iS = heist.thief.getValue();
    const iT = heist.thief.getScore();

	const fH = heists.pop()!;
	const fS = fH.thief.getValue();
    const fT = fH.thief.getScore();
	
	heists.push(fH);
	
    // ! Cache all states

	// Argument of type 'any[]' is not assignable to parameter of type '(previousValue: State, currentValue: State[], currentIndex: number, array: State[][]) => State'.
    // Type 'any[]' provides no match for the signature '(previousValue: State, currentValue: State[], currentIndex: number, array: State[][]): State'.
    const statess: State[][] = paths.map<State[]>((path, h) => {
		const vals: { [key: string]: number } = { };
		const heist = heists[h];
		
		return path.map(index => {
			const card = heist.getCard(index);
	
			vals[index] = card.getValue(heist);
		  
			heist.path.select(heist, card);
			
			const score = evaluate(heist);
			const diff = heist.path.getDiff();
			const stealth = heist.thief.getValue();
			const treasures = heist.thief.getScore();
			const cards = heist.getCards(true).map(card => {
				const index = card._index;
				return {
					id: card.id,
					value: vals[index] || card.getValue(heist),
					selectable: vals[index]? false : card.isSelectable(heist),
					selected: heist.path.getPath().includes(index)
				};
			});

			return { index, score, diff, stealth, treasures, cards };
		    })
		});
    
    // ! Play with full control

	const states = statess[0];
	
    for (let i = 0; i < states.length;) 
    {
		const path = paths[0];
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