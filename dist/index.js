"use strict";
class HiveBoard {
    constructor(board) {
        this.board = board;
    }
    addBee(y, x) {
        this.board[y][x] = true;
    }
    processStep() {
        let addedBee = false;
        for (let [count, row] of enumerate(this.board)) {
            row.forEach((tile, index) => {
                console.log(`${count}, ${index}`);
                if (!tile) {
                    let adjacent_tile_count = 0;
                    let up_index = (count > 5) ? index + 1 : index - 1;
                    let down_index = (count > 4) ? index - 1 : index + 1;
                    if (this.board[count - 1] != undefined && this.board[count - 1][index]) {
                        adjacent_tile_count += 1;
                        console.log(`hit ${count - 1} ${index} t`);
                    }
                    if (this.board[count - 1] != undefined && this.board[count - 1][up_index]) {
                        adjacent_tile_count += 1;
                        console.log(`hit ${count - 1} ${up_index} t`);
                    }
                    if (this.board[count][index - 1]) {
                        adjacent_tile_count += 1;
                        console.log(`hit ${count} ${index - 1} l`);
                    }
                    if (this.board[count][index + 1]) {
                        adjacent_tile_count += 1;
                        console.log(`hit ${count} ${index + 1} r`);
                    }
                    if (this.board[count + 1] != undefined && this.board[count + 1][index]) {
                        adjacent_tile_count += 1;
                        console.log(`hit ${count + 1} ${index} b`);
                    }
                    if (this.board[count + 1] != undefined && this.board[count + 1][down_index]) {
                        adjacent_tile_count += 1;
                        console.log(`hit ${count + 1} ${down_index} b`);
                    }
                    if (adjacent_tile_count >= 3) {
                        console.log(`New Bee ${count} ${index}`);
                        this.addBee(count, index);
                        addedBee = true;
                    }
                }
            });
        }
        ;
        return addedBee;
    }
    simulate() {
        while (true) {
            if (!this.processStep())
                break;
        }
    }
}
const createLayout = function () {
    const board = [];
    let reverse = false;
    let base_number = 11;
    for (let i = 0; i < 11; i++) {
        let row = [];
        for (let j = 0; j < base_number; j++) {
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
function* enumerate(iterable) {
    let i = 0;
    for (const x of iterable) {
        yield [i, x];
        i++;
    }
}
function mapLayoutInitial() {
    let hive = document.querySelector('.hive');
    let layout = createLayout();
    for (let [count, row] of enumerate(layout)) {
        let hive_row = document.createElement('div');
        hive_row.setAttribute('class', 'row');
        hive.appendChild(hive_row);
        row.forEach((tile, index) => {
            let hive_tile = document.createElement('div');
            hive_tile.setAttribute('class', 'hexagon');
            hive_tile.setAttribute('data-y-coordinate', index.toString());
            hive_tile.setAttribute('data-x-coordinate', count);
            hive_row.appendChild(hive_tile);
        });
    }
}
mapLayoutInitial();
// const new_layout = createLayout()
// let theBoard = new HiveBoard(new_layout)
// theBoard.addBee(0, 1)
// theBoard.addBee(1, 1)
// theBoard.addBee(1, 2)
// theBoard.addBee(1, 3)
// theBoard.addBee(2, 1)
// theBoard.addBee(3, 1)
// theBoard.addBee(4, 1)
// theBoard.addBee(5, 1)
// theBoard.addBee(3, 2)
// theBoard.simulate()
// console.log(theBoard)
