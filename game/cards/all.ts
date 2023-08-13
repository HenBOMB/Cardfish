import empty from './empty';
import guard from './guards/guard';
import door from './obstacles/door';
import exit from './misc/exit';
import torch from './obstacles/torch';
import sneak from './sneak/sneak';
import traitor from './sneak/traitor';
import hide from './sneak/hide';
import pouch from './treasure/pouch';
import chest from './treasure/chest';
import cloak from './equipment/cloak';

export function Door(lockDir: 0 | 1 | 2 | 3) { return new door(lockDir) };
export function Exit(lockDir: 0 | 1 | 2 | 3) { return new exit(lockDir) };

export function Guard(lookDir: 0 | 1 | 2 | 3, value: number = 1) { return guard(lookDir, value) };
export function Sneak(value: number = 1) { return new sneak(value) };
export function Traitor() { return new traitor() };
export function Hide() { return new hide() };
export function Torch() { return new torch() };
export function Empty() { return new empty() };
export function Pouch() { return new pouch() };
export function Chest() { return new chest() };

export function Cloak(value: number, level?: number) { return new cloak(value, level || 0) };

export const MAP = {
	'door': (..._) => Door(_[0]),
	'exit': (..._) => Exit(_[0]),
	'guard': (..._) => Guard(_[0], _[1]),
	'sneak': (..._) => Sneak(_[0]),
	'traitor': () => Traitor(), // ..._?:any[]
	'hide': () => Hide(),
	'torch': () => Torch(),
	'empty': () => Empty(),
	'pouch': () => Pouch(),
	'chest': () => Chest(),
	'cloak': (..._) => Cloak(_[0], _[1]),
}