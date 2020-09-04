class HiveBoard {
    constructor(board, hive, simButton, updateList = []) {
        this.board = board;
        this.hive = hive;
        this.simButton = simButton;
        this.updateList = updateList;
    }
    addBee(y, x) {
        this.board[y][x] = true;
        this.updateList.push([y, x]);
    }
    processStep() {
        let addedBee = false;
        for (let [count, row] of utilities.enumerate(this.board)) {
            row.forEach((tile, index) => {
                if (!tile) {
                    let adjacent_tile_count = 0;
                    let up_index = (count > 5) ? index + 1 : index - 1;
                    let down_index = (count > 4) ? index - 1 : index + 1;
                    if (this.board[count - 1] != undefined && this.board[count - 1][index]) {
                        adjacent_tile_count += 1;
                    }
                    if (this.board[count - 1] != undefined && this.board[count - 1][up_index]) {
                        adjacent_tile_count += 1;
                    }
                    if (this.board[count][index - 1]) {
                        adjacent_tile_count += 1;
                    }
                    if (this.board[count][index + 1]) {
                        adjacent_tile_count += 1;
                    }
                    if (this.board[count + 1] != undefined && this.board[count + 1][index]) {
                        adjacent_tile_count += 1;
                    }
                    if (this.board[count + 1] != undefined && this.board[count + 1][down_index]) {
                        adjacent_tile_count += 1;
                    }
                    if (adjacent_tile_count >= 3) {
                        this.addBee(count, index);
                        addedBee = true;
                    }
                }
            });
        }
        ;
        if (addedBee) {
            this.updateHive();
        }
        return addedBee;
    }
    async simulate() {
        while (true) {
            await utilities.sleep(1000);
            if (!this.processStep())
                break;
        }
    }
    clickToAddBee() {
        this.hive.addEventListener("click", (event) => {
            const element = event.target;
            if (element.classList.contains('hexagon')) {
                let y_coordinate = parseInt(element.getAttribute('data-y-coordinate'));
                let x_coordinate = parseInt(element.getAttribute('data-x-coordinate'));
                this.addBee(y_coordinate, x_coordinate);
                this.updateHive();
            }
        });
    }
    clickToSimulate() {
        this.simButton.addEventListener("click", (event) => {
            this.simulate();
        });
    }
    updateHive() {
        for (let entry of this.updateList) {
            let selector = `div[data-y-coordinate="${entry[0]}"][data-x-coordinate="${entry[1]}"]`;
            let board_tile = this.hive.querySelector(selector);
            board_tile.setAttribute('class', 'hexagon buzz');
        }
        this.updateList.length = 0;
    }
}
class GameSession {
    constructor(beesAdded, turnsTaken) {
        this.beesAdded = beesAdded;
        this.turnsTaken = turnsTaken;
        this.createLayout = function () {
            const board = [];
            let reverse = false;
            let base_number = 11;
            for (let i = 0; i < 11; i++) { // rows
                let row = [];
                for (let j = 0; j < base_number; j++) { // tiles
                    row.push(false);
                }
                board.push(row);
                if (base_number < 16 && !reverse) {
                    base_number += 1;
                }
                else if (base_number === 16) {
                    reverse = true;
                    base_number -= 1;
                }
                else {
                    base_number -= 1;
                }
            }
            return board;
        };
    }
}
const utilities = {
    sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    },
    *enumerate(iterable) {
        let i = 0;
        for (const x of iterable) {
            yield [i, x];
            i++;
        }
    }
};
const setup = {
    hive: document.querySelector('.hive'),
    simButton: document.querySelector('.sim-button'),
    beeCounter: document.querySelector('.bee-counter'),
    gameSession: new GameSession(0, 0),
    gameLayout: null,
    hiveBoard: null,
    mapLayoutInitial(hive, layout) {
        for (let [count, row] of utilities.enumerate(layout)) {
            let hive_row = document.createElement('div');
            hive_row.setAttribute('class', 'row');
            hive.appendChild(hive_row);
            row.forEach((tile, index) => {
                let hive_tile = document.createElement('div');
                hive_tile.setAttribute('class', 'hexagon');
                hive_tile.setAttribute('data-y-coordinate', count);
                hive_tile.setAttribute('data-x-coordinate', index.toString());
                hive_row.appendChild(hive_tile);
            });
        }
    },
    startGame() {
        this.gameLayout = this.gameSession.createLayout();
        this.mapLayoutInitial(this.hive, this.gameLayout);
        this.hiveBoard = new HiveBoard(this.gameLayout, this.hive, this.simButton);
        this.hiveBoard.clickToAddBee();
        this.hiveBoard.clickToSimulate();
    }
};
// const hive: HTMLDivElement = document.querySelector('.hive');
// const simButton: HTMLButtonElement = document.querySelector('.sim-button');
// const gameSession = new GameSession(1,2)
// const new_layout = game_session.createLayout();
// setup.mapLayoutInitial(hive, new_layout);
// const update_list: number[][] = []
// const hiveBoard = new HiveBoard(new_layout, hive, simButton, update_list);
// hiveBoard.clickToAddBee();
// hiveBoard.clickToSimulate();
setup.startGame();
