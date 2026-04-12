import { Codeword } from "./codeword.ts";
import { Modes } from "./constants.ts";

/** 
This function constructs the bit stream for a QR code segment. It takes the mode, character count, data bits, and the number of codewords to determine how to format the bit stream correctly. The function ensures that the bit stream is properly terminated, padded to byte boundaries, and filled with pad bytes if necessary to reach the required length for the QR code version being generated.
*/

export function bitStream(mode: Modes, count: string, bits: string[], codeword: Codeword["codewords"]): string[] {
    const bytes: string[] = [];
    const PAD_BYTES = ['11101100', '00010001'];

    const capacity = codeword * 8;

    let container = "";
    container += mode.toString(2).padStart(4, '0');
    container += count;
    container += bits.join('');

    // Terminator: up to 4 zero bits but don't exceed capacity
    const terminator = Math.min(4, Math.max(0, capacity - container.length));
    container += '0'.repeat(terminator);

    // Pad to next byte boundary (but not beyond capacity)
    if (container.length % 8 !== 0) {
        const padBits = Math.min(8 - (container.length % 8), capacity - container.length);
        container += '0'.repeat(padBits);
    }

    // If exceeded capacity (shouldn't normally happen), truncate
    if (container.length > capacity) {
        container = container.slice(0, capacity);
    }

    // Add pad bytes until full
    const remainingBytes = (capacity - container.length) / 8;
    for (let i = 0; i < remainingBytes; i++) {
        container += PAD_BYTES[i % 2];
    }

    for (let i = 0; i < capacity; i += 8) {
        bytes.push(container.slice(i, i + 8));
    }

    return bytes;
};