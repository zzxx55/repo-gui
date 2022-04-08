const matrix = (size) => {
    let mainArr = new Array(size)
    let count = 1;

    for (let i = 0; i < size; i++) {
        mainArr[i] = new Array()

        if (i % 2 == 0) {
            for (let j = 0; j < size; j++) {
                mainArr[i].push(count)
                count++
            }
        } else {
            for (let j = 0; j < size; j++) {
                mainArr[i].unshift(count)
                count++
            }
        }
    }

    return mainArr
}

console.log(matrix(4))