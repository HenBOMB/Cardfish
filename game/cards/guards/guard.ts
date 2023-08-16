import { Heist, Card, Undo } from '../../types';
import { CardImpl } from '../card';
import { Guard } from '../types';

const KDI: {
	[key: string]: number } = {
	'-3': 0,
	'1': 1,
	'3': 2,
	'-1': 3
};

class GuardImpl extends CardImpl implements Guard {

	// ? 0, 1, 2, 3
	private lookDir: number;
	private value: number;

	constructor(lookDir: number, value: number) {
		super('guard');
		this.lookDir = lookDir;
		this.value = value;
	}

	is(type: string): boolean {
		return super.is(type);
	}
	
	isIdle(): boolean {
		return !this.getModifier('sus') && !this.getModifier('alert');
	}

	isNocturnal(): boolean {
		return false;
	}

	isFacing(heist: Heist, card: Card): boolean {
		return card.is(this.getFacing(heist));
	}

	isBackside(heist: Heist, card: Card): boolean {
		const i = this._index + [3, -1, -3, 1][this.lookDir];
		return heist.getCard(i)?.is(card) ?? false;
	}

	getValue(heist: Heist): number {
		const value = (
			this.value +
			(this.isLit(heist) ? 1 : 0) +
			(this.isWatched(heist) ? 1 : 0) +
			this.getModifier('alert') +
			this.getModifier('intruder')
		) * heist.path.getDiff();
		return value;
	}

	getFacing(heist: Heist): Card | null {
		const i = this._index + [-3, 1, 3, -1][this.lookDir];
		const facing = i < 0 || i > 8 ? null : heist.getCard(i);
		return facing;
	}

	setLook(card: Card): Undo {
		const guard = this;
		const old = guard.lookDir;
		const s = card._index - guard._index;
		guard.lookDir = KDI[s];
		return () => {
			guard.lookDir = old;
		}
	}

	select(heist: Heist): Undo {
		const cost = this.getValue(heist);
		const undos = [super.select(heist)];
		const last = heist.getCard(heist.path.getPath()[heist.path.getPath().length - 2] !);
		
		if (this.isLit(heist))
		{
			// ? If you approach a guard from his front, all other guards get +1 permanently.

			if (this.isFacing(heist, last)) {
				undos.push(...heist.getGuards(this._index).map(g => g.setModifier('intruder', 1)));
			}

			undos.push(heist.thief.setValue(heist.thief.getValue() - cost));
		}
		else
		{
			// ? If you approach a guard in the shadow, stealth points are consumed.
			// ? But, if from his backside, you don't have to spend any stealth points. 
			// ! Gives you treasure for taken stealth points.

			if (!this.isBackside(heist, last))
			{
				undos.push(heist.thief.setValue(heist.thief.getValue() - cost));
			}

			undos.push(heist.thief.setScore(heist.thief.getScore() + cost));
		}
		
		// ? If a guard 's value is higher than your remaining stealth points, he will capture you.
		if (heist.thief.getValue() < 1)
		{
			undos.push(heist.thief.setCaught());
		}

		return () => {
			undos.forEach(undo => undo());
		}
	}
}

export default function Common(lookDir: number, value: number): Guard {
	return new GuardImpl(lookDir, value);
}