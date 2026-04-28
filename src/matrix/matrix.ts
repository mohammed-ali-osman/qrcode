import * as pattern from "./pattern.ts";
import { placement } from "./placement.ts"
import { mask, apply as masker } from "../mask/mask.ts";
import { ErrorCorrectionBits } from "../core/constants.ts";
import { format, apply as formatter } from "./format.ts"
import { apply as versioning } from "./version.ts";
import type { ErrorCorrectionLevel } from "../types/core.ts";
import type { Matrix } from "../types/matrix.ts";


/**
 * This function generates a QR code matrix based on the provided message, error correction level, size, and optional mask ID. It initializes an empty matrix and encodes the message into bits. The function then applies the necessary patterns (finder, separator, timing, alignment, and dark module) to the matrix. After placing the data bits into the matrix, it determines the optimal mask pattern (if not provided) and applies it to the matrix. Finally, it formats the matrix with the appropriate format bits and version information (for versions >= 7) before returning the completed QR code matrix.
 */

function matrix(message: Matrix, ec: ErrorCorrectionLevel, size: number, maskID?: number): Uint8Array {
    const grid = new Uint8Array(size * size).fill(255);
    const bits = Array.from(message).flatMap(byte => byte.toString(2).padStart(8, '0').split('').map(Number));

    pattern.finder(grid, size);
    pattern.separator(grid, size);
    pattern.timing(grid, size);
    pattern.alignment(grid, size);
    pattern.module(grid, size);


    placement(grid, bits, size);

    const maskId = maskID ?? mask(grid, size);

    // apply mask
    masker(grid, maskId, size);

    // apply format bits (always)
    formatter(grid, format(ErrorCorrectionBits[ec] || ErrorCorrectionBits["L"], maskId), size);

    // apply version information for versions >= 7
    const version = (size - 17) / 4;
    if (version >= 7) {
        versioning(grid, size, version);
    }

    return grid;
}

export { matrix };