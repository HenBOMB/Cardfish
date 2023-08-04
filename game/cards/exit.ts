import { Heist, Undo } from '../types';
import { Lockable } from './types';

export default class Door extends Lockable {

    constructor(lockDir: number) {
        super('exit', lockDir);
    }

    select(heist: Heist): Undo {
        const undo = heist.thief.setEscape();

        return () => {
            undo();
        }
    }
}
