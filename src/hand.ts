export default class Hand {
  
  _cards: Card[] = [];
  _undo: () => void = [];
  
  constructor() {
    
  }
  
  play(path: number[]): boolean {
    const undo = () => {
      
    };
    this._undo = [...this._undo, undo];
  }
  
  undo(): boolean {
    return this._undo.length && this._undo.shift()();
  }
}