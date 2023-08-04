import { Heist, Undo, Card } from '../../types';
import { Equipment } from '../types';

export default class Cloak extends Equipment {

    constructor(value: number, level?: number) {
        super('cloak', value, level);
    }

    override use(heist: Heist, thief: Card | number): Undo | null {
        thief = typeof thief === 'number' ? heist.getCard(thief) : thief;
        if(!this._value || !thief.is('thief')) return null;
        
        const cloak = this;
        const value = cloak.getValue();
        const undo = thief.setValue(thief.getValue(heist) + value);
        cloak._value = 0;

        return () => {
            undo();
            cloak._value = value;
        }
    }
    
}
