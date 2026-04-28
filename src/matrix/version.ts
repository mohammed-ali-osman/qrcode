import type { Matrix } from "../types/matrix.ts";

/**
 * Compute the 18-bit version information value for versions >= 7.
 * The value is composed of the 6-bit version number followed by 12 BCH bits
 * computed using the generator polynomial 0x1f25 (degree 12).
 */

function versions(version: number): number {
    if (version < 7 || version > 40) throw new Error("version only valid for versions 7..40");

    const v = version << 12; // append 12 zero bits
    let rem = v;

    // Perform polynomial division using generator 0x1f25
    const G = 0x1f25;

    // Perform long division: reduce remainder until degree < 12
    while ((rem >> 12) !== 0) {
        const shift = Math.floor(Math.log2(rem)) - 12;
        rem ^= (G << shift);
    }

    return (version << 12) | (rem & 0xfff);
}


/**
 * Applies the version information bits (18 bits) to the matrix for versions >= 7.
 * Bits are placed in two 3x6 areas: adjacent to the top-right and bottom-left
 * finder patterns as specified by the QR Code standard.
 */

function apply(matrix: Matrix, size: number, version: number) {
    const vBits = versions(version);
    const idx = (r: number, c: number) => r * size + c;

    // Only applies for version >= 7 (you should guard this externally or here)
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
            const bitIndex = 17 - (i * 3 + j); // MSB first
            const bit = (vBits >> bitIndex) & 1;

            // Top-right block
            matrix[idx(i, size - 11 + j)] = bit;

            // Bottom-left block (mirrored)
            matrix[idx(size - 11 + j, i)] = bit;
        }
    }
}

export { versions, apply };