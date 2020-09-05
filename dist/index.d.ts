declare class HiveBoard {
    board: boolean[][];
    hive: HTMLDivElement;
    simButton: HTMLButtonElement;
    beeCounter: HTMLParagraphElement;
    turnCounter: HTMLParagraphElement;
    gameSession: GameSession;
    private updateList;
    constructor(board: boolean[][], hive: HTMLDivElement, simButton: HTMLButtonElement, beeCounter: HTMLParagraphElement, turnCounter: HTMLParagraphElement, gameSession: GameSession, updateList?: number[][]);
    addBee(y: number, x: number): void;
    removeBee(y: number, x: number): void;
    processStep(): boolean;
    simulate(): Promise<void>;
    clickToAddRemoveBee(): void;
    clickToSimulate(): void;
    updateBeeCounter(removed?: boolean): void;
    incrementTurnCounter(): void;
    updateHive(): void;
    resetBoard(): void;
}
declare class GameSession {
    beesAdded: number;
    turnsTaken: number;
    constructor(beesAdded: number, turnsTaken: number);
    createLayout(): boolean[][];
    reset(): boolean[][];
}
declare const utilities: {
    sleep(milliseconds: number): Promise<unknown>;
    enumerate(iterable: any): Generator<any[], void, unknown>;
};
declare type Setup = {
    hive: HTMLDivElement;
    simButton: HTMLButtonElement;
    beeCounter: HTMLParagraphElement;
    turnCounter: HTMLParagraphElement;
    gameSession: GameSession;
    gameLayout: boolean[][];
    hiveBoard: HiveBoard;
    mapLayoutInitial(hive: HTMLDivElement, layout: boolean[][]): void;
    startGame(): void;
};
declare const setup: Setup;
