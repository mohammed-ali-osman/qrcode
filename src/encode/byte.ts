import type { Pack } from "../types/core.ts";

/**
 * Converts a string into an array of its byte representations.
 * Each character in the string is converted to its binary representation
 * as an 8-bit byte.
 */

function byte(input: string | number): Pack[] {
    input = input.toString();
    const packs: Pack[] = [];

    for (let i = 0; i < input.length; i++) {
        // Get the numeric code (0-255)
        const value = input.charCodeAt(i);

        // Safety check: QR Byte mode is typically 8-bit (ISO-8859-1)
        if (value > 255) {
            // If you want to support UTF-8, we'd use TextEncoder
            // but for standard Latin-1, we throw or handle it:
            throw new Error(`Character at index ${i} is out of 8-bit range. Use UTF-8 encoding or stick to Latin-1.`);
        }

        packs.push([value, 8]);
    }

    return packs;
}

export { byte };