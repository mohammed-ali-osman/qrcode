import { Matrix } from "../types/matrix.ts";

/**
 * This module implements the penalty scoring system for QR code masking. It defines four functions (N1, N2, N3, N4) that calculate different types of penalties based on the patterns and distribution of modules in the QR code matrix. The main function, penalty, combines the scores from these four functions to provide an overall penalty score for a given masked matrix. This scoring system is used to evaluate the effectiveness of different mask patterns and select the one that minimizes the penalty, thereby optimizing the readability and error resistance of the final QR code. 
 */

export function penalty(matrix: Matrix, size: number): number {
    return (
        N1(matrix, size) +
        N2(matrix, size) +
        N3(matrix, size) +
        N4(matrix, size)
    )
}

/**
 * This function calculates the penalty score for consecutive modules of the same color in both rows and columns of the QR code matrix. It iterates through each row and column, counting streaks of identical modules. If a streak of five or more is found, it adds a penalty score based on the length of the streak. The longer the streak, the higher the penalty, which encourages a more balanced distribution of dark and light modules in the QR code.
 */

export function N1(matrix: Matrix, size: number): number {
    let score: number = 0;

    // consecutive colors

    for (let r = 0; r < size; r++) {
        let color = matrix[r][0];
        let streak = 1;

        for (let c = 1; c < size; c++) {
            if (matrix[r][c] === color) {
                streak++;
            } else {
                if (streak >= 5) {
                    score += 3 + (streak - 5);
                }
                color = matrix[r][c];
                streak = 1;
            }
        }

        if (streak >= 5) {
            score += 3 + (streak - 5);
        }
    }

    for (let c = 0; c < size; c++) {
        let color = matrix[0][c];
        let streak = 1;

        for (let r = 1; r < size; r++) {
            if (matrix[r][c] === color) {
                streak++;
            } else {
                if (streak >= 5) {
                    score += 3 + (streak - 5);
                }
                color = matrix[r][c];
                streak = 1;
            }
        }

        // End-of-row check
        if (streak >= 5) {
            score += 3 + (streak - 5);
        }
    }

    return score;
}

/**
 * This module implements the 2x2 block penalty scoring for QR code masking. It iterates through the QR code matrix and checks for 2x2 blocks of modules that are all the same color (either all dark or all light). For each 2x2 block found, it adds a penalty score of 3 to the total score. This encourages a more varied distribution of modules in the QR code, which can improve readability and reduce the likelihood of scanning errors.
 */

export function N2(matrix: Matrix, size: number): number {
    let score = 0;

    // 2x2 Block

    for (let r = 0; r < size - 1; r++) {
        for (let c = 0; c < size - 1; c++) {
            if (
                matrix[r][c] === matrix[r][c + 1] &&
                matrix[r][c] === matrix[r + 1][c] &&
                matrix[r][c] === matrix[r + 1][c + 1]
            ) score += 3;
        }
    }

    return score;
}

/**
 * This module implements the finder-like pattern penalty scoring for QR code masking. It defines specific patterns that resemble the finder patterns used in QR codes and iterates through the matrix to detect these patterns in both horizontal and vertical orientations. If a pattern is found, it adds a penalty score of 40 to the total score. This encourages the mask to avoid creating patterns that could be confused with the finder patterns, which are crucial for the correct scanning and decoding of the QR code.
 */

export function N3(matrix: Matrix, size: number): number {
    let score = 0;
    const PATTERNS = [
        [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
    ] as const;

    // Finder-like Patterns

    // Horizontal
    for (let r = 0; r < size; r++) {
        for (let c = 0; c <= size - 11; c++) {
            for (const pattern of PATTERNS) {
                let match = true;

                for (let i = 0; i < 11; i++) {
                    if (matrix[r][c + i] !== pattern[i]) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    score += 40;
                }
            }
        }
    }

    // Vertical
    for (let c = 0; c < size; c++) {
        for (let r = 0; r <= size - 11; r++) {
            for (const pattern of PATTERNS) {
                let match = true;

                for (let i = 0; i < 11; i++) {
                    if (matrix[r + i][c] !== pattern[i]) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    score += 40;
                }
            }
        }
    }

    return score;
}

/**
 * This module implements the dark module ratio penalty scoring for QR code masking. It calculates the percentage of dark modules in the QR code matrix and compares it to the ideal ratio of 50%. The function counts the total number of modules and the number of dark modules, then computes the percentage of dark modules. It calculates the deviation from 50% and assigns a penalty score based on how far the percentage is from the ideal ratio, with higher penalties for greater deviations. This encourages a balanced distribution of dark and light modules in the QR code, which can enhance readability and reduce scanning errors.
 */

export function N4(matrix: Matrix, size: number): number {
    let dark = 0;
    const total = size * size;

    // Dark Module Ratio

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c] === 1) {
                dark++;
            }
        }
    }

    const percentage = (dark * 100) / total;
    const deviation = Math.abs(percentage - 50);
    const steps = Math.floor(deviation / 5);

    return steps * 10;
}
