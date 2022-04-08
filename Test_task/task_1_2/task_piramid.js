const pyramid = (pyramidTop) => {
    let arr = [[]]

    arr[0].push(pyramidTop)
    for (let i = 1; i < pyramidTop; i++) {
        let before = pyramidTop - i;
        for (let j = 1; j <= i; j++) {
            arr[0].unshift(before)
            arr[0].push(before)
        }
    }
    return arr
}

console.log(pyramid(3))