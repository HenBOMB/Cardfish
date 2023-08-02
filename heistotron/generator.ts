import { Board, Card, Path } from "../game/types";

class Point {
    x: number;
    y: number;
  
    constructor (x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }
  
    is(other: Point): boolean {
        return this.x === other.x && this.y === other.y;
    }
  
    static from(index: number): Point {
        return [
            new Point(0, 0),
            new Point(1, 0),
            new Point(2, 0),
            new Point(0, 1),
            new Point(1, 1),
            new Point(2, 1),
            new Point(0, 2),
            new Point(1, 2),
            new Point(2, 2),
        ][index];
    }
}

const MAP = [
    [1, 3, 4],
    [0, 2, 3, 4, 5],
    [1, 4, 5],
    [0, 1, 4, 6, 7],
    [0, 1, 2, 3, 5, 6, 7, 8],
    [1, 2, 4, 7, 8],
    [3, 4, 7],
    [3, 4, 5, 6, 8],
    [4, 5, 7],
];

function segmentsIntersect (
    p0: Point, p1: Point,
    p2: Point, p3: Point,
    i: Point | null = null
): boolean {
    const s10x = p1.x - p0.x, s10y = p1.y - p0.y;
    const s32x = p3.x - p2.x, s32y = p3.y - p2.y;
  
    const denom = s10x * s32y - s32x * s10y;
    if (denom === 0) return false;
  
    const s02x = p0.x - p2.x, s02y = p0.y - p2.y;
    const s_numer = s10x * s02y - s10y * s02x;
    if ((s_numer < 0) === (denom > 0)) return false;
  
    const t_numer = s32x * s02y - s32y * s02x;
    if ((t_numer < 0) === (denom > 0)) return false;
  
    if (((s_numer > denom) === (denom > 0)) || ((t_numer > denom) === (denom > 0))) return false;
  
    // Collision detected
    if (i !== null) {
      i.x = p0.x + (t_numer / denom) * s10x;
      i.y = p0.y + (t_numer / denom) * s10y;
    }
  
    return true;
}

function pathsIntersect (
      p0: Point[],
      p1: Point[]
  ): boolean {
    
    if(p0.length < 2 || p1.length < 2)
    {
        return false;
    }
    
    if(!p0[p0.length-1])
    {
        return false;
    }
    
    // ? if path p0 ends with start of path p1, remove end
    if(p0[p0.length-1].is(p1[0]))
    {
        p0.pop();
    }
  
    for(let i = 0; i < p0.length-1; i++)
    {
        const a = p0[i], b = p0[i+1];
        
        if(a.x === b.x || a.y === b.y)
        {
            continue;
        }
        
        for(let j = 0; j < p1.length-1; j++)
        {
            const c = p1[j], d = p1[j+1];
            
            if(c.x === d.x || c.y === d.y)
            {
                continue;
            }
            
            if(segmentsIntersect(a, b, c, d))
            {
                return true;
            }
        }
    }
  
    return false;
}
  
export default function generate(board: Board): number[] {
    const i = board.path.getPath().slice(-1)[0];
    const points = board.path.getPath().map(i => Point.from(i));

    return MAP[i].filter(i => 
        board.getCard(i).isSelectable(board) &&
        !pathsIntersect(
            points, 
            [Point.from(board.path.getLast(board).index), Point.from(i)]
        )
    );
}