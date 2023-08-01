import empty from './empty';
import guard from './guards/guard';
import door from './obstacles/door';
import torch from './obstacles/torch';
import sneak from './sneak/sneak';
import traitor from './sneak/traitor';
import hide from './sneak/hide';
import pouch from './treasure/pouch';

export function Guard(lookIndex: 0 | 1 | 2 | 3) { return guard(lookIndex) };
export function Door() { return door() };
export function Sneak() { return sneak() };
export function Traitor() { return traitor() };
export function Hide() { return hide() };
export function Torch() { return torch() };
export function Empty() { return empty() };
export function Pouch() { return pouch() };