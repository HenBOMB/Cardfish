import createPath from "../game/path";
import { Heist, Undo } from "../game/types";
import evaluate, { potential } from "./evaluator";
import generateMoves from "./generator";

export var count = 0;
export var potential: any;

type Pot = [State, State];
type State = [number[], number, number];
export type Output = [number, State, Pot[][]];

export function deepClone<T>(obj: T, cache = new WeakMap()): T {
    // Handle non-object types and primitives
    if (obj === null || typeof obj !== 'object' || obj instanceof Date || obj instanceof RegExp) {
      return obj;
    }
  
    // Check if object has been cloned before
    if (cache.has(obj)) {
      return cache.get(obj);
    }
  
    // Handle arrays
    if (Array.isArray(obj)) {
      const cloneArray: any[] = [];
      cache.set(obj, cloneArray);
      obj.forEach((item) => {
        cloneArray.push(deepClone(item, cache));
      });
      return cloneArray as T;
    }
  
    // Handle objects (classes)
    const cloneObject = Object.create(Object.getPrototypeOf(obj));
    cache.set(obj, cloneObject);
  
    for (const key in obj) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor) {
          if (typeof descriptor.value === 'function') {
            cloneObject[key] = descriptor.value.bind(cloneObject) as any;
          } else {
            cloneObject[key] = deepClone(descriptor.value, cache);
          }
        }
    }
    return cloneObject;
}

function dfsWithBacktracking(heist: Heist, depth: number, chance: number): Output {
    const generated = generateMoves(heist);

    if (heist.path.isEnd() || !generated.length) 
    {
        return [evaluate(heist), heist.path.getState(), []];
    }
    
    let _score = Number.NEGATIVE_INFINITY, 
        _state: State,
        _pot: Pot[] = [];

    for (let i = 0; i < generated.length; i++) 
    {
        const u: Undo | null  = heist.path.select(heist, generated[i]);	

        if(!u) continue;

        count++;

        const [score, state, pot] = dfsWithBacktracking(heist, depth, chance);
        
        u();

        if (score > _score) 
        {
            _score = score;
            _state = state!;
            _pot = [...pot];
        }
    }

	if(depth > 0 && _score > 0 && heist.path.getPath().length > 2)
    {
    	// ! AI can predict cards 100% (if any)
    	const deck = heist.getDeck();
    	const path = heist.path.getPath();
    	const knows = deck.length >= path.length
		
		const pots = Array(chance).fill(null).map<Output>(() => {
			// ? Clone the entire object
			const clone = deepClone<Heist>(heist);
			
			// TODO or load from memory? 
			// here is were a nn comes into play
			!knows && clone.setDeck([...deck, ...clone.genCards(path.length)]);

			// ? Play the path on the clone
			clone.play(path);

			// ! Potential score
			const out = dfsWithBacktracking(clone, depth - 1, evaluate);

			// ! Risk formula?
			// Depth closer to 0, the riskier the path
			// ? This makes deeper paths less risky and more rewarding?

			out[0] *= .8 ** (depth - 1);

			return out;
		}).sort((a: any, b: any) => b[0] - a[0]);
		
		const best = pots.shift();
		//const worst = pots.pop() || null;
		const [ score, state, pot ] = best;
		
		if(score > _score && score > 0)
		{
			_score = score;
			_pot = [ best, ...pot ];
		}
    }
    
    return [_score, _state!, _pot];
}

export default function solve(heist: Heist, depth?: number = 1, chance?: number = 2): Output {
    count = 0;
    heist.path = createPath(heist);
	
    const [ score, state, pot ] = dfsWithBacktracking(heist, depth, chance || 1);

    return [score, state, pot];
}
