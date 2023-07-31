import guard from './guards/guard';
import door from './door';
import sneak from './sneak/sneak';
import { createThief } from './thief';
import torch from './obstacles/torch';
import empty from './empty';
import traitor from './sneak/traitor';

export function Guard() { return guard() };
export function Door() { return door() };
export function Sneak() { return sneak() };
export function Thief(i: number) { return createThief(i) };
export function Torch() { return torch() };
export function Traitor() { return traitor() };
export function Empty() { return empty() };