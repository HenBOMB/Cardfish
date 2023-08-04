import { CardImpl } from '../card';
import { Heist, Card, Undo } from '../../types';

export default class Hide extends CardImpl {

    constructor() {
        super('hide');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'sneak';
    }

    getValue(heist: Heist): number {
        return this.isLit(heist)? 0: 10;
    }

    select(heist: Heist): Undo {
        return super.select(heist);
        
        const value = this.getValue(heist);

        if(!value)
        {
            return super.select(heist);
        }

		const uu = heist.thief.setValue(heist.thief.getValue() + value);
		const u = super.select(heist);

		return () => {
			u();
			uu();
		}
	}
}
