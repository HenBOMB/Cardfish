import { CardImpl } from './card';
import { Card } from '../types';

export default class Empty extends CardImpl implements Card {
    constructor() {
        super('empty');
    }
}
