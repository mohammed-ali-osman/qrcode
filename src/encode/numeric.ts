import type { Pack } from "../types/core.ts"

/**
 * This module encodes numeric input into binary strings.
 * It takes a string or number input, validates it, and returns an array of binary strings
*/

function numeric(input: string | number): Pack[] {

    if (!/^[0-9]+$/.test(`${input}`)) {
        throw new Error('Input must be a number or numeric string');
    }

    const groups = input.toString().match(/\d{1,3}/g) as RegExpMatchArray;

    return groups.map(group => {
        const value = parseInt(group, 10);
        const size = group.length === 3 ? 10 : group.length === 2 ? 7 : 4;

        return [value, size];
    });
}

export { numeric };