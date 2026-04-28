import { alpha as alphanumeric } from "../core/constants.ts";
import type { Pack } from "../types/core.ts";

/**
 * Encodes a string in alphanumeric mode for QR codes.
 * The alphanumeric encoding uses a specific mapping of characters to values.
 * Each pair of characters is encoded into an 11-bit binary string.
 */

function alpha(input: string | number): Pack[] {
    input = input.toString();

    // 1. Convert characters to their QR table values
    const corresponding: number[] = input.split("").map((char) => {
        const val = alphanumeric[char];
        if (val === undefined) {
            throw new Error(`Invalid alphanumeric character: ${char}`);
        }
        return val;
    });

    const packs: Pack[] = [];

    // 2. Process in pairs
    for (let i = 0; i < corresponding.length; i += 2) {
        if (i + 1 < corresponding.length) {
            // 2-character pair: (V1 * 45) + V2
            const value = corresponding[i] * 45 + corresponding[i + 1];
            packs.push([value, 11]);
        } else {
            // 1-character remaining: just the value
            const value = corresponding[i];
            packs.push([value, 6]);
        }
    }

    return packs;
}

export { alpha };