interface HiveBoardInterface {
    board: boolean[][],
    hive: HTMLDivElement,
    simButton: HTMLButtonElement,
    beeCounter: HTMLParagraphElement,
    turnCounter: HTMLParagraphElement,
    playAgainButton: HTMLButtonElement,
    gameSession: GameSession,
    addBee(y: number, x: number): void,
    removeBee(y: number, x: number): void,
    processStep(): boolean,
    simulate(): Promise<void>,
    clickToAddRemoveBee(): void,
    clickToSimulate(): void,
    clickToPlayAgain(): void,
    updateBeeCounter(removed: boolean): void,
    incrementTurnCounter(): void,
    updateHive(): void,
    calculateScore(): number,
    simulationOver(): void,
    playAgain(): void,
    resetBoard(): void
}

type SetupType = {
    hive: HTMLDivElement,
    simButton: HTMLButtonElement,
    beeCounter: HTMLParagraphElement,
    turnCounter: HTMLParagraphElement,
    overlay: HTMLDivElement,
    playAgainButton: HTMLButtonElement,
    gameSession: GameSession,
    gameLayout: boolean[][],
    hiveBoard: HiveBoard,
    mapLayoutInitial(hive: HTMLDivElement, layout: boolean[][]): void,
    startGame(): void,
}

class HiveBoard implements HiveBoardInterface {

    constructor(
        public board: boolean[][],
        public hive: HTMLDivElement,
        public simButton: HTMLButtonElement,
        public beeCounter: HTMLParagraphElement,
        public turnCounter: HTMLParagraphElement,
        public playAgainButton: HTMLButtonElement,
        public gameSession: GameSession,
        private clickLock: boolean=false,
        private updateList: number[][]=[]) {
        // autofilled
    }

    addBee(y: number, x: number): void {
        this.board[y][x] = true
        this.updateList.push([y,x])
    }

    removeBee(y: number, x: number): void {
        this.board[y][x] = false
        let selector = `div[data-y-coordinate="${y}"][data-x-coordinate="${x}"]`
        let board_tile = this.hive.querySelector(selector);
        board_tile.setAttribute('class', 'hexagon');
    }

    processStep(): boolean {
        let addedBee: boolean = false
        for (let [count, row] of utilities.enumerate(this.board)) {
            row.forEach((tile: boolean, index: number) => {
                if (!tile) {
                    let adjacent_tile_count: number = 0
                    let up_index: number = (count > 5) ? index + 1 : index - 1
                    let down_index: number = (count > 4) ? index - 1 : index + 1
                    if (this.board[count - 1] != undefined && this.board[count - 1][index]) {
                        adjacent_tile_count+= 1
                    }
                    if (this.board[count - 1] != undefined && this.board[count - 1][up_index]) {
                        adjacent_tile_count+= 1
                    }
                    if (this.board[count][index - 1]) {
                        adjacent_tile_count+= 1
                    }
                    if (this.board[count][index + 1]) {
                        adjacent_tile_count+= 1
                    }
                    if (this.board[count + 1] != undefined && this.board[count + 1][index]) {
                        adjacent_tile_count+= 1
                    }
                    if (this.board[count + 1] != undefined && this.board[count + 1][down_index]) {
                        adjacent_tile_count+= 1
                    }
                    if (adjacent_tile_count >= 3) {
                        this.addBee(count, index)
                        addedBee = true
                    }
                }
            })
        };
        if (addedBee) {
            this.incrementTurnCounter()
            this.updateHive()
        }

        return addedBee
    }

    async simulate(): Promise<void> {
        this.clickLock = true
        while (true) {
            await utilities.sleep(850)
            if (!this.processStep()) {
                break
            }
        }
        this.simulationOver()
    }

    clickToAddRemoveBee(): void {
        this.hive.addEventListener("click", (event) => {
            if (this.clickLock) {
                return
            }
            const element = event.target as HTMLDivElement;
            if (element.classList.contains('hexagon')) {
                let y_coordinate: number = parseInt(element.getAttribute('data-y-coordinate')!);
                let x_coordinate: number = parseInt(element.getAttribute('data-x-coordinate')!);
                if (this.board[y_coordinate][x_coordinate]) {
                    this.removeBee(y_coordinate, x_coordinate)
                    this.updateBeeCounter(true)
                } else {
                    this.addBee(y_coordinate, x_coordinate);
                    this.updateBeeCounter()
                    this.updateHive()
                }
            }
        });
    }

    clickToSimulate(): void {
        this.simButton.addEventListener("click", (event) => {
            this.simulate();
        });
    }

    clickToPlayAgain(): void {
        this.playAgainButton.addEventListener("click", (event) => {
            this.playAgain()
        })
    }

    updateBeeCounter(removed: boolean=false): void {
        if (removed) {
            this.gameSession.beesAdded -= 1
        } else {
            this.gameSession.beesAdded += 1
        }
        this.beeCounter.innerHTML = `Bees Placed: ${this.gameSession.beesAdded}`
    }

    incrementTurnCounter(): void {
        this.gameSession.turnsTaken += 1
        this.turnCounter.innerHTML = `Rounds Passed: ${this.gameSession.turnsTaken}`
    }

    updateHive(): void {
        for (let entry of this.updateList) {
            let selector = `div[data-y-coordinate="${entry[0]}"][data-x-coordinate="${entry[1]}"]`
            let board_tile = this.hive.querySelector(selector);
            board_tile.setAttribute('class', 'hexagon buzz');
        }
        this.updateList.length = 0
    }
    calculateScore(): number {
        let totalActiveTiles = 0
        for (let row of this.board) {
            for (let tile of row) {
                if (tile) {
                    totalActiveTiles+= 1
                }
            }
        }
        let missedTiles = 146 - totalActiveTiles
        let beeScore = 146 - (this.gameSession.beesAdded * 2)
        let turnScore = (100 - this.gameSession.turnsTaken - (missedTiles * 2))
        return beeScore + turnScore
    }
    simulationOver(): void {
        let score = this.calculateScore()
        let puzzleBees = document.querySelector('#puzzle-bees')
        let puzzleTurns = document.querySelector('#puzzle-turns')
        let puzzleScore = document.querySelector('#puzzle-score')
        puzzleBees.innerHTML = `Bees Placed: ${this.gameSession.beesAdded}`
        puzzleTurns.innerHTML = `Rounds Passed: ${this.gameSession.turnsTaken}`
        puzzleScore.innerHTML = `Score: ${score}`
        setup.overlay.setAttribute('class', 'overlay overlay-slidedown open');
    }
    playAgain(): void {
        this.resetBoard()
        this.clickLock = false
        setup.overlay.setAttribute('class', 'overlay overlay-slidedown');
    }
    resetBoard(): void {
        this.board = this.gameSession.reset()
        let tile_rows = this.hive.children
        for (let tile_row of tile_rows) {
            for (let tile of tile_row.children) {
                if (tile.classList.contains('buzz')) {
                    tile.setAttribute('class', 'hexagon');
                }
            }
        }
        this.beeCounter.innerHTML = 'Bees Placed: 0'
        this.turnCounter.innerHTML = 'Rounds Passed: 0'
    }
}

class GameSession {

    constructor(public beesAdded: number, public turnsTaken: number) {
        // autofilled
    }

    createLayout(): boolean[][] {
        const board = []
        let reverse = false
        let base_number = 11
        for (let i = 0; i < 11; i++) { // rows
            let row = []
            for (let j = 0; j < base_number; j++) { // tiles
                row.push(false)
            }
            board.push(row)
            if (base_number < 16 && !reverse) {
                base_number+= 1
            } else if (base_number === 16) {
                reverse = true;
                base_number-= 1
            } else {
                base_number-= 1
            }
        }
        return board
    }

    reset(): boolean[][] {
        this.beesAdded = 0
        this.turnsTaken = 0
        return this.createLayout()
    }
}

const utilities = { 

    sleep(milliseconds: number) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    },

    *enumerate(iterable: any) {
        let i = 0;

        for (const x of iterable) {
            yield [i, x];
            i++;
        }
    }
}

const setup: SetupType = {

    hive: document.querySelector('.hive'),
    simButton: document.querySelector('.sim-button'),
    beeCounter: document.querySelector('.bee-counter'),
    turnCounter: document.querySelector('.turn-counter'),
    overlay: document.querySelector('.overlay'),
    playAgainButton: document.querySelector('#play-again'),
    gameSession: new GameSession(0,0),
    gameLayout: null,
    hiveBoard: null,


    mapLayoutInitial(hive, layout) {
        for (let [count, row] of utilities.enumerate(layout)) {
            let hive_row = document.createElement('div'); 
            hive_row.setAttribute('class', 'row');
            hive.appendChild(hive_row);
            row.forEach((tile: boolean, index: number) => {
                let hive_tile = document.createElement('div');
                hive_tile.setAttribute('class', 'hexagon');
                hive_tile.setAttribute('data-y-coordinate', count);
                hive_tile.setAttribute('data-x-coordinate', index.toString());
                hive_row.appendChild(hive_tile);
            })
        }
    }, 

    startGame() {
        this.gameLayout = this.gameSession.createLayout();
        this.mapLayoutInitial(this.hive, this.gameLayout)
        this.hiveBoard = new HiveBoard(this.gameLayout, this.hive, this.simButton, this.beeCounter, this.turnCounter, this.playAgainButton, this.gameSession);
        this.hiveBoard.clickToAddRemoveBee();
        this.hiveBoard.clickToSimulate();
        this.hiveBoard.clickToPlayAgain();
    }
}

setup.startGame()