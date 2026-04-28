import { Modes } from "../core/constants.ts"
import { RenderOptions } from "./render.ts";

interface Options {
    version?: number;
    ec?: ErrorCorrectionLevel;
    mask?: number;
    render?: RenderOptions;
}

type Pack = [number, number];

interface CapacityTable {
    readonly [version: number]: {
        [ec in ErrorCorrectionLevel]: {
            [mode in Modes]: number;
        };
    };
}

interface Capacity {
    readonly version: number,
    readonly ec: ErrorCorrectionLevel,
    readonly mode: Modes,
    readonly capacity: number
}

interface Codeword {
    codewords: number;
    ecCodewords: number;
    groups: {
        blocks: number;
        dataCodewords: number;
    }[];
}

/**
 * A range of error correction levels used in QR codes.
*/
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface ErrorCorrectionTable {
    readonly [version: number]: { [ec in ErrorCorrectionLevel]: { codewords: number, ecCodewords: number, groups: { blocks: number, dataCodewords: number }[] } }
}

type Groups = ErrorCorrectionTable[number][ErrorCorrectionLevel]["groups"];
type Blocks = Uint8Array;

export type { Options, Pack, Modes, CapacityTable, Capacity, Codeword, ErrorCorrectionLevel, ErrorCorrectionTable, Groups, Blocks };