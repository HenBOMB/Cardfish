import empty from './empty';
import guard from './guards/guard';
import door from './obstacles/door';
import torch from './obstacles/torch';
import sneak from './sneak/sneak';
import traitor from './sneak/traitor';

export function Guard() { return guard() };
export function Door() { return door() };
export function Sneak() { return sneak() };
export function Torch() { return torch() };
export function Traitor() { return traitor() };
export function Empty() { return empty() };