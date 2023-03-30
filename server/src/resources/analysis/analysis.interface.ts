 interface Analysis {
    columns: Array<string>;
    rows: Array<string>;
    data: Array<Array<number>>;
}

interface Point {
    // row: string;
    // column: string;
    row: number;
    column: number;
    data: number;
}

interface Assignment {
    maxTotalDamage: number;
    result: Point[];
}

export {Analysis, Point, Assignment}