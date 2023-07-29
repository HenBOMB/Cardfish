import { Match, Card, Undo } from '../types';

export interface SneakInt extends Card {

}

export class SneakImpl implements SneakInt {
    id: string = 'sneak';
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export default function Sneak(): SneakInt {
    return new SneakImpl();
}
