import guard, { GuardInt } from './guard';
import door from './door';
import sneak from './sneak';
import { createThief } from './thief';
import torch from './torch';
import empty from './empty';
import traitor from './traitor';

export function Guard() { return guard() };
export function Door() { return door() };
export function Sneak() { return sneak() };
export function Thief() { return createThief() };
export function Torch() { return torch() };
export function Traitor() { return traitor() };
export function Empty() { return empty() };