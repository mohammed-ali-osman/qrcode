import { ErrorCorrectionTable } from "./codeword.ts";
import { ErrorCorrectionLevel } from "./constants.ts";

type Groups = ErrorCorrectionTable[number][ErrorCorrectionLevel]["groups"];
export type Blocks = Uint8Array;

/**
 * This function takes the raw data bytes and divides them into blocks according to the specified group structure for the QR code version and error correction level. It then interleaves the bytes from these blocks to create a single sequence of bytes that can be encoded into the QR code. The interleaving process ensures that the data is distributed across the QR code in a way that maximizes error correction capabilities, allowing for better recovery of data if parts of the QR code are damaged or obscured.
 */

export function block(data: Uint8Array, groups: Groups): Blocks[] {
    const blocks: Uint8Array[] = [];
    let offset = 0;

    for (const group of groups) {
        for (let i = 0; i < group.blocks; i++) {
            blocks.push(data.slice(offset, offset + group.dataCodewords));
            offset += group.dataCodewords;
        }
    }

    return blocks;
}

/**
 * This function takes the blocks of data bytes and interleaves them according to the specified length. It iterates through each byte position up to the given length and collects bytes from each block at that position, effectively mixing the bytes from different blocks together. The resulting interleaved byte sequence is returned as a Uint8Array, which can then be used for encoding into the QR code. This interleaving process is crucial for enhancing the error correction capabilities of the QR code, as it allows for better distribution of data across the code's modules.
 */

export function interleave(blocks: Blocks[], length: number): Uint8Array {
    const result: number[] = [];

    for (let i = 0; i < length; i++) {
        for (const block of blocks) {
            if (i < block.length) {
                result.push(block[i]);
            }
        }
    }

    return new Uint8Array(result);
}
