import * as pattern from "./pattern.ts";
import { placement } from "./placement.ts"
import { ErrorCorrectionBits } from "../core/constants.ts";
import { mask, apply as masker } from "../mask/mask.ts";
import { format, apply as formatter} from "./format.ts"
import { ErrorCorrectionLevel } from "../core/constants.ts";
import { apply as versioning } from "./version.ts";
import { Matrix } from "../types/matrix.ts";


/**
 * This function generates a QR code matrix based on the provided message, error correction level, size, and optional mask ID. It initializes an empty matrix and encodes the message into bits. The function then applies the necessary patterns (finder, separator, timing, alignment, and dark module) to the matrix. After placing the data bits into the matrix, it determines the optimal mask pattern (if not provided) and applies it to the matrix. Finally, it formats the matrix with the appropriate format bits and version information (for versions >= 7) before returning the completed QR code matrix.
 */

export function matrix(message: Uint8Array, ec: ErrorCorrectionLevel, size: number, maskID?: number): Matrix {

    const matrix: Matrix = Array.from({ length: size }, () => Array(size).fill(null));
    const bits = Array.from(message).flatMap(byte => byte.toString(2).padStart(8, '0')
        .split('').map(Number));

    pattern.finder(matrix, size);
    pattern.separator(matrix, size);
    pattern.timing(matrix, size);
    pattern.alignment(matrix, size);
    pattern.module(matrix, size);

    placement(matrix, bits, size);

    const maskId = maskID ?? mask(matrix, size);

    // apply mask
    masker(matrix, maskId, size);

    // apply format bits (always)
    formatter(matrix, format(ErrorCorrectionBits[ec] || ErrorCorrectionBits["L"], maskId), size);

    // apply version information for versions >= 7
    const version = (size - 17) / 4;
    if (version >= 7) {
        versioning(matrix, size, version);
    }

    return matrix;
}
