declare class HiveBoard {
    board: boolean[][];
    hive: HTMLDivElement;
    simButton: HTMLButtonElement;
    constructor(board: boolean[][], hive: HTMLDivElement, simButton: HTMLButtonElement);
    addBee(y: number, x: number): void;
    processStep(): boolean;
    simulate(): void;
    clickToAddBee(): void;
    clickToSimulate(): void;
    updateHive(): void;
}
declare const createLayout: () => boolean[][];
declare function enumerate(iterable: any): Generator<any[], void, unknown>;
declare function mapLayoutInitial(hiveElement: HTMLDivElement): void;
declare const hive: HTMLDivElement;
declare const simButton: HTMLButtonElement;
declare const new_layout: boolean[][];
declare const hiveBoard: HiveBoard;
