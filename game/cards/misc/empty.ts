import { CardImpl } from '../card';

export default class Empty extends CardImpl {
	constructor() {
		super('empty');
	}
	
	isSelectable(_): boolean {
		return false;
	}
}