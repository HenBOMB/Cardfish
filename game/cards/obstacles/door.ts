import { Heist, Undo } from '../../types';
import { Lockable } from '../types';

export default class Door extends Lockable {

    constructor(lockDir: number) {
        super('door', lockDir);
    }

    select(heist: Heist): Undo {
        const value = this.getValue(heist);

        const u = super.select(heist);
        const uu = heist.thief.setValue(heist.thief.getValue() - value);

        return () => {
            u();
            uu();
        }
    }
}
