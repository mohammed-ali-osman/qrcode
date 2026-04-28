import { Modes } from "../core/constants.ts";
import type { Pack } from "../types/core.ts";

/**
 * This function calculates the character count for a given version and mode.
*/

function characterCount(version: number, mode: Modes, length: number): Pack {
    // A static map for O(1) size lookups
    // Structure: [Numeric, Alphanumeric, Byte, Kanji]
    const SIZES: number[][] = [
        [10, 9, 8, 8],  // Versions 1-9
        [12, 11, 16, 10], // Versions 10-26
        [14, 13, 16, 12]  // Versions 27-40
    ];

    // Determine the version range index
    const range = version > 0 ? version < 10 ? 0 : version < 27 ? 1 : version < 41 ? 2 : undefined : undefined;
    const m = mode == 1 ? 0 : mode == 2 ? 1 : mode == 4 ? 2 : mode == 8 ? 3 : undefined;

    if (range == undefined) {
        throw new Error("Invalid version number. Version must be between 1 and 40.");
    }

    if (m == undefined) {
        throw new Error("Unsupported mode");
    }

    const size = SIZES[range][m];

    return [length, size];
}

export { characterCount };