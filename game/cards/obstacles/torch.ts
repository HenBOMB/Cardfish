import { CardImpl } from '../card';
import { Board, Card, Undo } from '../../types';

export interface TorchInt extends Card {

}

export class TorchImpl extends CardImpl implements TorchInt {

    constructor() {
        super('torch');
    }

    is(type: string): boolean {
        return super.is(type) || type === 'obstacle';
    }
}

export default function Torch(): TorchInt {
    return new TorchImpl();
}
