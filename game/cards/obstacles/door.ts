import { Board, Obstacle, Undo } from '../../types';

export interface DoorInt extends Obstacle {

}

export class DoorImpl implements DoorInt {
    id: string = 'door';
    
    is(type: string): boolean {
        return type === this.id || type === 'obstacle';
    }
    
    trigger(board: Board): Undo {
        return () => {};
    }
}

export default function Door(): DoorInt {
    return new DoorImpl();
}
