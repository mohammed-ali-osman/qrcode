import { numeric } from "./numeric.ts";
import { alpha } from "./alphanumeric.ts";
import { byte } from "./byte.ts";
import { kanji } from "./kanji.ts";
import { Modes } from "../core/constants.ts";
import type { Pack } from "../types/core.ts";

/**
 * Encodes a string in the specified mode for QR codes.
 * The encoding modes include Numeric, Alphanumeric, Byte, and Kanji.
 */

export function encode(input: string | number, mode: Modes): Pack[] {
    switch (mode) {
        case Modes.Numeric:
            return numeric(input);
        case Modes.Alphanumeric:
            return alpha(input);
        case Modes.Byte:
            return byte(input);
        case Modes.Kanji:
            return kanji(input);
        default:
            throw new Error(`Unsupported encoding mode: ${mode}`);
    }
}
