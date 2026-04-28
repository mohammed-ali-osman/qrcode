import { Modes, range } from '../core/constants.ts';

/**
 * This function analyzes the input data and returns an object containing the mode.
 */

function analyze(input: string | number): [Modes, number] {
    input = input.toString();
    const length: number = input.length;

    // 1. Numeric check
    if (/^[0-9]+$/.test(input as string)) {
        return [Modes.Numeric, length];
    }

    // 2. Alphanumeric check
    if (/^[0-9A-Z $%*+\-./:]+$/.test(input)) {
        return [Modes.Alphanumeric, length];
    }

    // 3. Byte check (Latin-1 / ISO-8859-1)
    if (/^[\u0020-\u007E\u00A0-\u00FF]+$/.test(input)) {
        return [Modes.Byte, length];
    }

    // 4. Kanji check using the range registry
    if (input.split('').every(char => char.codePointAt(0)! in range)) {
        return [Modes.Kanji, length];
    }

    throw new Error('Unsupported input format');
}

export { analyze };