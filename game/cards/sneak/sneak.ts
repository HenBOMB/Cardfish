import { CardImpl } from '../card';
import { Board, Stealth, Undo } from '../../types';

export interface SneakInt extends Stealth {
	
}

export class SneakImpl extends CardImpl implements SneakInt {
	
	private value: number;

	constructor(value: number = 1) {
		super('sneak');
		this.value = value;
	}
	
	is(type: string): boolean {
		return super.is(type);
	}

	getValue(board: Board): number {
		return (this.isLit(board)? 0 :  this.value) * board.path.getDiff();
	}
	
	select(board: Board): Undo {
		const uu = board.thief.setStealth(board.thief.getStealth() + this.getValue(board));
		const u = super.select(board);
		return () => {
			u();
			uu();
		}
	}
}

export default function Sneak(value: number = 1): SneakInt {
	return new SneakImpl(value);
}
