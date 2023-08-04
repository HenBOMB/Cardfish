import { CardImpl } from '../card';
import { Heist, Stealth, Undo } from '../../types';

export default class SneakImpl extends CardImpl {
	
	constructor(value: number = 1) {
		super('sneak', value);
	}
	
	is(type: string): boolean {
		return super.is(type);
	}

	getValue(heist: Heist): number {
		return (this.isLit(heist)? 0 :  this._value) * heist.path.getDiff();
	}
	
	select(heist: Heist): Undo {
		const u0 = heist.thief.setValue(heist.thief.getValue() + this.getValue(heist));
		const u1 = super.select(heist);
		return () => {
			u0();
			u1();
		}
	}
}
