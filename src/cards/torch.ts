import { Match, Card, Undo } from '../types';

export interface TorchInt {

}

export class TorchImpl implements TorchInt, Card {
    id: string = 'torch';
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export default function Torch(): TorchInt {
    return new TorchImpl();
}
