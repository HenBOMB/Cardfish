import { Heist, Card, Undo } from "../types";
import { CardImpl } from "./card";

export interface EquipmentInt {
    is(type: string): boolean;
    getValue(): number;
    use(heist: Heist, card: Card | number): Undo | null;
}

export class Equipment implements EquipmentInt {
    
    id: string;

	protected _value: number;
    protected _level: number;

    constructor(id: string, value: number, level?: number) {
        this.id = id;
        this._value = value;
        this._level = level || 0;
    }

    is(type: string): boolean {
        return type === this.id || type === 'equipment';
    }

    getValue(): number {
        return this._value + this._level;
    }

    use(heist: Heist, card: Card | number): Undo | null {
        return null;
    }
}

export class Lockable extends CardImpl {
    private lockDir: number;

    constructor(id: string, lockDir: number) {
        super(id);
        this.lockDir  = lockDir;
    }

    is(type: string): boolean {
        return super.is(type) || type === 'obstacle';
    }

    // ? If illuminated only passable from the lock direction.
    // ? If visible impassible

    isSelectable(heist: Heist): boolean {
        const i = this._index + [-3, 1, 3, -1][this.lockDir];
        const facing = i < 0 || i > 8? null : heist.getCard(i);
        return super.isSelectable(heist) && 
            // ? If visible impassible
            !this.isWatched(heist) &&
            // If illuminated only passable from the lock direction.
            (!this.isLit(heist) || (facing? true : false) && heist.path.getLast(heist).is(facing!));
    }

    getValue(heist: Heist): number {
        return (
            (this.isLit(heist)? 1 : 0) + 
            (this.isWatched(heist)? 1 : 0)
        ) * heist.path.getDiff();
    }
}
