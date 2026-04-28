import { reserved } from "../core/reserve.ts";
import type { Matrix } from "../types/matrix.ts";

/**
 * This module implements the data placement algorithm for QR code matrices. It defines a function, placement, that takes a QR code matrix, an array of data bits, and the size of the matrix as input. The function iterates through the matrix in a zigzag pattern, starting from the bottom-right corner and moving upwards and downwards alternately while traversing columns from right to left. For each module in the matrix, if it is not reserved for patterns or format information and is currently null, the function places the next data bit from the input array into that module. This process continues until all data bits are placed in the matrix, ensuring that the data is correctly encoded according to the QR code specifications.
 */

function placement(matrix: Matrix, bits: number[], size: number) {
    let offset = 0;

    for (const [r, c] of zigzag(size)) {
        const i = r * size + c;

        if (!reserved(r, c, size)) {
            matrix[i] = offset < bits.length ? bits[offset] : 0;
            offset++;
        }
    }
}

/**
 * This generator function produces the coordinates for placing data bits in a QR code matrix in a zigzag pattern. It iterates through the columns of the matrix from right to left, skipping the vertical timing pattern column at index 6. For each pair of columns, it alternates between moving upwards and downwards through the rows, yielding the coordinates of each module where data bits should be placed. This zigzag traversal ensures that the data is distributed correctly across the matrix according to QR code specifications.
 */

function* zigzag(size: number) {
    let upward = true;

    for (let col = size - 1; col > 0; col -= 2) {

        // Skip the vertical timing pattern column
        if (col === 6) col--;

        if (upward) {
            for (let row = size - 1; row >= 0; row--) {
                yield [row, col] as const;
                yield [row, col - 1] as const;
            }
        } else {
            for (let row = 0; row < size; row++) {
                yield [row, col] as const;
                yield [row, col - 1] as const;
            }
        }

        upward = !upward;
    }
}

export { placement, zigzag };