import { Board, Card, Guard, Undo } from '../../types';
import { CardImpl } from '../card';

const KDI: { [key: string]: number } = {
    '-3': 0,
    '1': 1,
    '3': 2,
    '-1': 3
};

class GuardImpl extends CardImpl implements Guard {
    
    // ? 0, 1, 2, 3
    private lookDir: number;
	private value: number;
    
    constructor(lookDir: number, value: number) {
        super('guard');
        this.lookDir = lookDir;
        this.value = value;
    }
    
    is(type: string): boolean {
        return super.is(type);
    }

    isNocturnal(): boolean {
        return false;
    }

    isFacing(board: Board, card: Card): boolean {
        const i = this.index + [-3, 1, 3, -1][this.lookDir];
        const facing = i < 0 || i > 8? null : board.getCard(i);
        return facing?.is(card) ?? false;
    }

    isBackside(board: Board, card: Card): boolean {
        const i = this.index + [3, -1, -3, 1][this.lookDir];
        return board.getCard(i)?.is(card) ?? false;
    }

    getValue(board: Board): number {
        const value = (
            this.value + 
            (this.isLit(board)? 1 : 0) + 
            (this.isWatched(board)? 1 : 0) + 
            this.getModifier('alert') +
            this.getModifier('intruder')
        ) * board.path.getDiff();
        return value;
    }

    setLook(card: Card): Undo {
        const guard = this;
        const old = guard.lookDir;
        const s = card.index - guard.index;
        guard.lookDir = KDI[s];
        return () => {
            guard.lookDir = old;
        }
    }

    select(board: Board): Undo {
        const cost = this.getValue(board);
        const undos = [super.select(board)];

        // ? If a guard's value is higher than your remaining stealth points, he will capture you.
        if(cost > board.thief.getStealth()) {
            undos.push(board.thief.setCaught());
            undos.push(board.thief.setStealth(board.thief.getStealth() - cost));
            return () => {
                undos.forEach(undo => undo());
            }
        }

        const last = board.getCard(board.path.getPath()[board.path.getPath().length - 2]!);

        if(this.isLit(board))
        {
            // ? If you approach a guard from his front, all other guards get +1 permanently.
            
            if(this.isFacing(board, last)) {
                undos.push(...board.getGuards(this.index).map(g => g.setModifier('intruder', 1)));
            }

            undos.push(board.thief.setStealth(board.thief.getStealth() - cost));
        }
        else
        {
            // ? If you approach a guard in the shadow, stealth points are consumed.
            // ? But, if from his backside, you don't have to spend any stealth points. 
            // ! Gives you treasure for taken stealth points.

            if(!this.isBackside(board, last))
            {
                undos.push(board.thief.setStealth(board.thief.getStealth() - cost));
            }

            undos.push(board.thief.setTreasures(board.thief.getTreasures() + cost));
        }

        return () => {
            undos.forEach(undo => undo());
        }
    }
}

export default function Common(lookDir: number, value: number): Guard {
    return new GuardImpl(lookDir, value);
}
