import { Board, Card, Undo } from '../../types';

export interface SneakInt extends Card {

}

export class SneakImpl implements SneakInt {
    id: string = 'sneak';
    
    is(type: string): boolean {
        return type === 'sneak';
    }

    trigger(board: Board): Undo {
        return () => {};
    }
}

export default function Sneak(): SneakInt {
    return new SneakImpl();
}
