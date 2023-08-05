import createPath from "../game/path";
import { Heist, Undo } from "../game/types";
import evaluate from "./evaluator";
import generateMoves from "./generator";
export var count = 0;

export type State = [number, number[][], Heist[]];

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

function dfsWithBacktracking(heist: Heist, depth: number, base?: boolean): State {
    const generated = generateMoves(heist);

    if (heist.path.isEnd() || !generated.length) {
        return [evaluate(heist), [heist.path.getPath()], [deepClone<Heist>(heist)]];
    }
    
    let _score = Number.NEGATIVE_INFINITY,
		_path: number[][] = [],
        _heist: Heist[] = [heist];

    for (let i = 0; i < generated.length; i++) {
		if(base) console.log(`\nGenerating... ${i+1}/${generated.length}`);

        const u: Undo | null  = heist.path.select(heist, generated[i]);

        if(!u) continue;

        count++;

        const [score, path, heist_] = dfsWithBacktracking(heist, depth);
        
        u();

        if (score > _score) 
        {
            _score = score;
			_path = path;
            _heist = heist_;
        }
    }

	if(depth > 0 && heist.path.getPath().length > 2)
    {
		const [score, path, heist_] = Array(3).fill(null).map<State>(() => {
			// ? Clone the entire object
			const clone = deepClone<Heist>(heist);

			// ? We must deal rng cards, not cards in the current deck
			clone.setDeck(clone.genCards(clone.path.getPath().length));
		
			const copy = deepClone<Heist>(heist);
			
			// ? Play the path on the clone
			clone.play(clone.path.getPath());

			// ! Potential score
			let [sc, pa] = dfsWithBacktracking(clone, depth - 1);

			// ! Risk formula?
			// Depth closer to 0, the riskier the path
			// ? This makes deeper paths less risky and more rewarding?

			sc *= .9 ** (depth+1);

			return [sc, pa, [copy]];
		}).sort((a: any, b: any) => b[0] - a[0])[0];

		if(score > _score && score > 0)
		{
			_score = score;
			_path = [heist.path.getPath(), ...path];
			_heist = [deepClone<Heist>(heist), ...heist_!];
		}
    }
    
    return [_score, _path, _heist];
}

export default function bestPath(heist: Heist, depth: number = 0): State {
    count = 0;
	
    heist.path = createPath(heist);

    const state = dfsWithBacktracking(heist, depth, true);

    return state;
}
