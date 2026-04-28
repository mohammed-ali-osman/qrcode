import { Modes } from "./constants.ts";
import type { Pack } from "../types/core.ts";

/** 
This function constructs the bit stream for a QR code segment. It takes the mode, character count, data bits, and the number of codewords to determine how to format the bit stream correctly. The function ensures that the bit stream is properly terminated, padded to byte boundaries, and filled with pad bytes if necessary to reach the required length for the QR code version being generated.
*/

function bitStream(mode: Modes, count: Pack, data: Pack[], codeword: number): Uint8Array {
    const bytes = new Uint8Array(codeword);
    const capacity = codeword * 8;
    const PAD_BYTES = [236, 17];

    let offset = 0;

    const pack = (value: number, size: number) => {
        for (let i = size - 1; i >= 0; i--) {
            if (offset >= capacity) return;

            const bit = (value >> i) & 1;
            if (bit === 1) {
                const byteIdx = offset >> 3;
                const bitOffset = 7 - (offset % 8);
                bytes[byteIdx] |= (1 << bitOffset);
            }
            offset++;
        }
    };

    // 1. Write Mode Indicator (4 bits)
    pack(mode, 4);

    // 2. Write Character Count Indicator
    pack(count[0], count[1]);

    // 3. Write Data Bits (The Fix)
    // We iterate through the packs and use their specific sizes (10, 11, 13, etc.)
    for (const [val, size] of data) {
        pack(val, size);
    }

    // 4. Terminator (Up to 4 zero bits)
    const terminator = Math.min(4, capacity - offset);
    offset += terminator;

    // 5. Pad to next Byte Boundary
    while (offset % 8 !== 0 && offset < capacity) {
        offset++;
    }

    // 6. Fill remaining capacity with PAD_BYTES
    let toggle = 0;
    while (offset + 8 <= capacity) {
        bytes[offset >> 3] = PAD_BYTES[toggle % 2];
        offset += 8;
        toggle++;
    }

    return bytes;
};

export { bitStream };