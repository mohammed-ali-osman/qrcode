function array1D(n: number) {
    const arr = new Uint8Array(n * n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            arr[i * 100 + j] = i * j;
        }
    }
}

function array2D(n: number) {
    const arr: number[][] = [];
    for (let i = 0; i < n; i++) {
        arr[i] = [];
        for (let j = 0; j < n; j++) {
            arr[i][j] = i * j;
        }
    }
}

export { array1D, array2D };