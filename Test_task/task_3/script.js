let matrix = null
let running = null
let flagCount = null
let timeoutID = null

init(20, 20, 24)

document
    .querySelector('button')
    .addEventListener('click', () => init(20, 20, 24))

function init(columns, rows, mines) {
    matrix = getMatrix(columns, rows)
    running = true
    flagCount = mines * 2
    document
        .getElementById('flagCount')
        .innerHTML = `Флагов:${flagCount}`

    for (let i = 0; i < mines; i++) {
        setRandomMine(matrix)
    }
    clearTimer()
    update()
}

function update() {
    if (!running) {
        return
    }
    const gameElement = matrixToHtml(matrix)

    const appElement = document.querySelector('#app')
    appElement.innerHTML = "";
    appElement.append(gameElement)

    appElement
        .querySelectorAll('img')
        .forEach(imgElement => {
            imgElement.addEventListener('mousedown', mousedownHandler)
            imgElement.addEventListener('mouseup', mouseupHandler)
            imgElement.addEventListener('mouseleave', mouseleaveHandler)
        })

    if (isLosing(matrix)) {

        alert('Вы проиграли')
        running = false
    }
    if (isWin(matrix)) {
        alert('Вы победили')
        running = false
    }
}

function mousedownHandler(event) {
    const { cell, left, right } = getInfo(event)

    if (left) {
        cell.left = true;
    }
    if (right) {
        cell.right = true;
    }
    if (cell.left && cell.right) {
        bothClick(cell)
    }
    update()
}

function mouseupHandler(event) {
    const { cell, left, right } = getInfo(event)
    const both = cell.right && cell.left && (left || right)
    const leftMouse = !both && cell.left && left
    const rightMouse = !both && cell.right && right

    if (both) {
        forEach(matrix, x => x.paten = false)
    }
    if (left) {
        cell.left = false;
    }
    if (right) {
        cell.right = false;
    }
    if (leftMouse) {
        leftClick(cell)
    }
    else if (rightMouse) {
        rightClick(cell)
    }
    update()
}

function mouseleaveHandler(event) {
    const { cell, left, right } = getInfo(event)
    cell.right = false;
    cell.left = false;

    update()
}

function getInfo(event) {
    const element = event.target
    const cellId = parseInt(element.getAttribute('data-cell-id'))

    return {
        left: event.which === 1,
        right: event.which === 3,
        cell: getCellById(matrix, cellId)
    }
}

function leftClick(cell) {

    if (cell.show || cell.flag) {
        return
    }
    cell.show = true

    if (!cell.mine && !cell.number) {
        showEmpty(matrix, cell.x, cell.y)

    }
    if (cell.mine) {
        showMine(matrix)
    }
}

function rightClick(cell) {
    if (!cell.show) {
        cell.flag = !cell.flag
        countFlag(cell)
    }
    return
}

function bothClick(cell) {
    if (!cell.show || !cell.number) {
        return
    }

    const cells = getAroundCells(matrix, cell.x, cell.y)
    const flags = cells.filter(x => x.flag).length

    if (flags === cell.number) {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(x => {
                x.show = true
                showEmpty(matrix, cell.x, cell.y)
            })

    } else {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => cell.paten = true)
    }
}

function countFlag(cell) {


    if (cell.flag) {
        --flagCount

    }
    else {
        ++flagCount
    }
    document
        .getElementById('flagCount')
        .innerHTML = `Флагов:${flagCount}`

}


