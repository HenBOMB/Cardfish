import empty from './empty';
import guard from './guards/guard';
import door from './obstacles/door';
import torch from './obstacles/torch';
import sneak from './sneak/sneak';
import traitor from './sneak/traitor';
import hide from './sneak/hide';
import pouch from './treasure/pouch';
import chest from './treasure/chest';

export function Guard(lookDir: 0 | 1 | 2 | 3, value: number = 1) { return guard(lookDir, value) };
export function Door(lockDir: 0 | 1 | 2 | 3) { return door(lockDir) };
export function Sneak(value: number = 1) { return sneak(value) };
export function Traitor() { return traitor() };
export function Hide() { return hide() };
export function Torch() { return torch() };
export function Empty() { return empty() };
export function Pouch() { return pouch() };
export function Chest() { return chest() };