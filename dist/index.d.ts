declare class HiveBoard {
    board: boolean[][];
    hive: HTMLDivElement;
    simButton: HTMLButtonElement;
    updateList: number[][];
    constructor(board: boolean[][], hive: HTMLDivElement, simButton: HTMLButtonElement, updateList: number[][]);
    addBee(y: number, x: number): void;
    processStep(): boolean;
    simulate(): Promise<void>;
    clickToAddBee(): void;
    clickToSimulate(): void;
    updateHive(): void;
}
declare class GameSession {
    beesAdded: number;
    turnsTaken: number;
    constructor(beesAdded: number, turnsTaken: number);
    createLayout: () => boolean[][];
}
declare const utilities: {
    sleep(milliseconds: number): Promise<unknown>;
    enumerate(iterable: any): Generator<any[], void, unknown>;
};
declare type Setup = {
    hive: HTMLDivElement;
    simButton: HTMLButtonElement;
    beeCounter: HTMLParagraphElement;
    updateList: number[][];
    gameSession: GameSession;
    gameLayout: boolean[][];
    hiveBoard: HiveBoard;
    mapLayoutInitial(hive: HTMLDivElement, layout: boolean[][]): void;
    startGame(): void;
};
declare const setup: Setup;
