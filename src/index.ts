class HiveBoard {

    constructor(public board: boolean[][], public hive: HTMLDivElement, public simButton: HTMLButtonElement, public updateList: number[][]) {

    }

    addBee(y: number, x: number): void {
        this.board[y][x] = true
        this.updateList.push([y,x])
    }

    processStep(): boolean {
        let addedBee: boolean = false
        for (let [count, row] of enumerate(this.board)) {
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
                this.updateHive()
        }

        return addedBee
    }

    async simulate(): Promise<void> {
        while (true) {
            await sleep(1000)
            if (!this.processStep())
                break
        }
    }

    clickToAddBee(): void {
        this.hive.addEventListener("click", (event) => {
            const element = event.target as HTMLDivElement;
            if (element.classList.contains('hexagon')) {
                let y_coordinate: number = parseInt(element.getAttribute('data-y-coordinate')!);
                let x_coordinate: number = parseInt(element.getAttribute('data-x-coordinate')!);
                this.addBee(y_coordinate, x_coordinate);
                this.updateHive()
            }
        });
    }

    clickToSimulate(): void {
        this.simButton.addEventListener("click", (event) => {
            this.simulate();
        });
    }

    updateHive(): void {
        // for (let [count, row] of enumerate(this.board)) { // innefficient
        //     row.forEach((tile: boolean, index: number)  => {
        //         if (tile) {
        //             let selector = `div[data-y-coordinate="${count}"][data-x-coordinate="${index}"]`
        //             let board_tile = this.hive.querySelector(selector);
        //             board_tile!.setAttribute('class', 'hexagon buzz');
        //         }
        //     });
        // }
        for (let entry of this.updateList) {
            let selector = `div[data-y-coordinate="${entry[0]}"][data-x-coordinate="${entry[1]}"]`
            let board_tile = this.hive.querySelector(selector);
            board_tile!.setAttribute('class', 'hexagon buzz');
        }
        this.updateList.length = 0
    }
}
/**
 * 
 */
const createLayout = function(): boolean[][] {
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

function* enumerate(iterable: any) {
    let i = 0;

    for (const x of iterable) {
        yield [i, x];
        i++;
    }
}

const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  

function mapLayoutInitial(hive: HTMLDivElement, layout: boolean[][]) {
    for (let [count, row] of enumerate(layout)) {
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
}

const hive: HTMLDivElement = document.querySelector('.hive');
const simButton: HTMLButtonElement = document.querySelector('.sim-button');
const new_layout = createLayout();
mapLayoutInitial(hive, new_layout);
const update_list: number[][] = []
const hiveBoard = new HiveBoard(new_layout, hive, simButton, update_list);
hiveBoard.clickToAddBee();
hiveBoard.clickToSimulate();