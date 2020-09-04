declare class HiveBoard {
    board: boolean[][];
    constructor(board: boolean[][]);
    addBee(y: number, x: number): void;
    processStep(): boolean;
    simulate(): void;
}
declare const createLayout: () => boolean[][];
declare function enumerate(iterable: any): Generator<any[], void, unknown>;
declare function mapLayoutInitial(): void;
