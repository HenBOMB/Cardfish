import { Match, Card, Undo } from '../types';

export interface SneakInt {

}

export class SneakImpl implements SneakInt, Card {
    id: string = 'sneak';
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export default function Sneak(): SneakInt {
    return new SneakImpl();
}
