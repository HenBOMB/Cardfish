import { Match, Card, Undo } from '../types';

export interface TorchInt extends Card {

}

export class TorchImpl implements TorchInt {
    id: string = 'torch';
    
    public trigger(match: Match): Undo {
        return () => {};
    }
}

export default function Torch(): TorchInt {
    return new TorchImpl();
}
