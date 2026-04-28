import { reserved } from "../core/reserve.ts";
import { penalty } from "./penalty.ts";
import type { Matrix } from "../types/matrix.ts";

const masks: ((r: number, c: number) => boolean)[] = [
    (r, c) => (r + c) % 2 === 0,
    (r, _c) => r % 2 === 0,
    (_r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
];

/**
 * This function determines the optimal mask pattern for a given QR code matrix by applying each of the eight standard mask patterns and calculating the resulting penalty score for each. It iterates through each mask pattern, applies it to a clone of the original matrix, and uses the penalty function to evaluate the quality of the masked matrix. The mask pattern that yields the lowest penalty score is selected as the best choice for encoding the QR code, ensuring that the final code is as scannable and error-resistant as possible.
 */

function mask(matrix: Matrix, size: number): number {
    let score = Infinity;
    let maskId = 0;

    // Use entry index to track which mask (0-7) is being tested
    masks.forEach((maskFn, index) => {
        const clone = matrix.slice(); // clone

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (reserved(r, c, size)) continue;

                const i = r * size + c;

                if (maskFn(r, c)) {
                    clone[i] ^= 1;
                }
            }
        }

        const p = penalty(clone, size);
        if (p < score) {
            score = p;
            maskId = index;
        }
    });

    return maskId;
}

function apply(matrix: Matrix, maskId: number, size: number) {

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {

            if (reserved(r, c, size)) continue;

            const i = r * size + c;
            if (masks[maskId](r, c)) {
                (matrix[i] as number) ^= 1;
            }
        }
    }

}

export { masks, mask, apply };