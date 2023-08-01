import { CardImpl } from '../card';
import { Board, Stealth, Undo } from '../../types';

export interface SneakInt extends Stealth {
	
}

export class SneakImpl extends CardImpl implements SneakInt {
	
	constructor() {
		super('sneak');
	}
	
	is(type: string): boolean {
		return super.is(type);
	}

	getValue(board: Board): number {
		return (this.isLit(board)? 0 :  2) * board.path.getDiff();
	}
	
	select(board: Board): Undo {
		const u = super.select(board);
		const uu = board.thief.setStealth(board.thief.getStealth() + this.getValue(board));
		return () => {
			u();
			uu();
		}
	}
}

export default function Sneak(): SneakInt {
	return new SneakImpl();
}
