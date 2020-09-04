declare class HiveBoard {
    board: boolean[][];
    hive: HTMLDivElement;
    simButton: HTMLButtonElement;
    constructor(board: boolean[][], hive: HTMLDivElement, simButton: HTMLButtonElement);
    addBee(y: number, x: number): void;
    processStep(): boolean;
    simulate(): Promise<void>;
    clickToAddBee(): void;
    clickToSimulate(): void;
    updateHive(): void;
}
declare const createLayout: () => boolean[][];
declare function enumerate(iterable: any): Generator<any[], void, unknown>;
declare const sleep: (milliseconds: number) => Promise<unknown>;
declare function mapLayoutInitial(hive: HTMLDivElement, layout: boolean[][]): void;
declare const hive: HTMLDivElement;
declare const simButton: HTMLButtonElement;
declare const new_layout: boolean[][];
declare const hiveBoard: HiveBoard;
