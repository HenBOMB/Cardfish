export default class Card {
  id: string;
  cost: number;
  heat: number;
  
  constructor(id, cost, heat) {
    this.id = id;
  }
}

class Thief extends Card {
  
  constructor() {
    super('thief');
  }
}