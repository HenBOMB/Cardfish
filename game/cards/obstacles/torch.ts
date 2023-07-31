import { Board, Obstacle, Undo } from '../../types';

export interface TorchInt extends Obstacle {

}

export class TorchImpl implements TorchInt {
    id: string = 'torch';
    
    is(type: string): boolean {
        return type === this.id || type === 'obstacle';
    }

    trigger(board: Board): Undo {
        return () => {};
    }
}

export default function Torch(): TorchInt {
    return new TorchImpl();
}
