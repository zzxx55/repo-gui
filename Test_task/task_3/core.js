function getMatrix(columns, rows) {
    const matrix = []
    let idCounter = 1

    for (let y = 0; y < rows; y++) {
        const row = []
        for (let x = 0; x < columns; x++) {
            row.push({
                id: idCounter++,
                left: false,
                right: false,
                show: false,
                flag: false,
                mine: false,
                paten: false,
                number: 0,
                x: x,
                y: y
            })
        }
        matrix.push(row)
    }
    return matrix
}
function getRandomFreeCell(matrix) {
    const freeCells = []
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x]
            if (!cell.mine) {
                freeCells.push(cell)
            }
        }
    }
    const index = Math.floor(Math.random() * freeCells.length)

    return freeCells[index]
}


function setRandomMine(matrix) {
    const cell = getRandomFreeCell(matrix)
    const cells = getAroundCells(matrix, cell.x, cell.y)

    cell.mine = true;

    for (const cell of cells) {
        cell.number += 1
    }
}

function getCell(matrix, x, y) {
    if (!matrix[y] || !matrix[y][x]) {
        return false
    }
    return matrix[y][x]
}

function getAroundCells(matrix, x, y) {
    const cells = []
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) {
                continue
            }

            const cell = getCell(matrix, x + dx, y + dy)

            if (cell) {
                cells.push(cell)
            }

        }

    }
    return cells
}

function getCellById(matrix, id) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            const cell = matrix[y][x]
            if (cell.id === id) {
                return cell
            }
        }
    }
    return false
}

function matrixToHtml(matrix) {
    const gameElement = document.createElement('div')

    gameElement.classList.add('sapper')

    for (let y = 0; y < matrix.length; y++) {
        const rowElement = document.createElement('div')
        rowElement.classList.add('row')

        for (let x = 0; x < matrix[y].length; x++) {
            const cell = matrix[y][x]
            let imgElement = document.createElement('img')

            imgElement.draggable = false
            imgElement.setAttribute('data-cell-id', cell.id)
            imgElement.oncontextmenu = () => false

            rowElement.append(imgElement)
            if (cell.flag) {
                imgElement.src = 'assets/flag.png'
                continue
            }

            if (cell.paten) {
                imgElement.src = 'assets/paten.png'
                continue
            }
            if (!cell.show) {
                imgElement.src = 'assets/none.png'
                continue
            }

            if (cell.mine) {
                imgElement.src = 'assets/mine.png'
                continue
            }

            if (cell.number) {
                imgElement.src = 'assets/number' + cell.number + '.png'
                continue
            }
            imgElement.scr = 'assets/free.png'
        }
        gameElement.append(rowElement)
    }
    return gameElement
}

function forEach(matrix, handler) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            handler(matrix[y][x])
        }
    }
}

function showEmpty(matrix, x, y) {
    const cell = getCell(matrix, x, y)

    if (cell.flag || cell.number || cell.mine) {
        return
    }

    forEach(matrix, x => x._marked = false)

    cell._marked = true

    let flag = true
    while (flag) {
        flag = false

        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix.length; x++) {
                const cell = matrix[y][x]

                if (!cell._marked || cell.number) {
                    continue
                }

                const cells = getAroundCells(matrix, x, y)

                for (const cell of cells) {
                    if (cell._marked) {
                        continue
                    }
                    if (!cell.flag || !cell.mine) {
                        cell._marked = true
                        flag = true
                    }
                }
            }
        }

    }

    forEach(matrix, x => {
        if (x._marked) {
            x.show = true
        }
        delete x._marked
    })
}

function isWin() {
    const flags = []
    const mines = []

    forEach(matrix, cell => {
        if (cell.flag) {
            flags.push(cell)
        }
        if (cell.mine) {
            mines.push(cell)
        }
    })
    if (flags.length !== mines.length) {
        return false
    }

    for (const cell of mines) {
        if (!cell.flag) {
            return false
        }
    }
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            const cell = matrix[y][x]

            if (!cell.mine && !cell.show) {
                return false
            }
        }
    }
    return true
}

function isLosing(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix.length; x++) {
            const cell = matrix[y][x]

            if (cell.mine && cell.show) {
                return true
            }
        }
    }
    return false
}

function showMine(matrix) {
    forEach(matrix, cell => {

        cell.show = true

    })
}

function countTime() {
    let timer = document.getElementById('timer')
    let null_min = 0
    let null_sec = 0

    timeoutID = setInterval(() => {
        timer.innerHTML = `${null_min}:${null_sec}`
        null_sec++
        if (null_sec >= 60) {
            null_min++
            null_sec = 0;
        }
    }, 1000);
}

function clearTimer() {
    clearInterval(timeoutID)
    countTime()
}
