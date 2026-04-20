import { assertEquals } from "@std/assert";
import { penalty, N1, N2, N3, N4 } from "../../src/mask/penalty.ts";

// N1: consecutive colors in rows and columns
Deno.test("N1 counts long horizontal runs", () => {
  const size = 5;
  // single row with five 1s, other rows alternating to avoid long streaks
  const matrix = Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => ((r + c) % 2)));
  matrix[0] = [1, 1, 1, 1, 1];

  // streak of 5 -> score 3 from row; other rows/columns avoid long streaks
  assertEquals(N1(matrix, size), 3);
});

Deno.test("N1 counts long vertical runs", () => {
  const size = 6;
  const matrix = Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => ((r + c) % 2)));

  // column 2 has six 1s -> streak 6 -> 3 + (6-5) = 4
  for (let r = 0; r < size; r++) matrix[r][2] = 1;

  assertEquals(N1(matrix, size), 4);
});

// N2: 2x2 blocks
Deno.test("N2 counts 2x2 blocks", () => {
  const size = 4;
  // start with a checkerboard pattern to avoid accidental 2x2 uniform blocks
  const matrix = Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => ((r + c) % 2)));

  // place a 2x2 block of ones at (0,0)
  matrix[0][0] = 1;
  matrix[0][1] = 1;
  matrix[1][0] = 1;
  matrix[1][1] = 1;

  // only the (0,0)-(1,1) block is uniform -> score 3
  assertEquals(N2(matrix, size), 3);
});

// N3: finder-like patterns horizontally and vertically
Deno.test("N3 detects horizontal finder-like pattern", () => {
  const size = 11;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));

  // pattern: [0,0,0,0,0,1,0,1,1,1,0,1]
  const pattern = [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  for (let i = 0; i < 11; i++) matrix[0][i] = pattern[i];

  assertEquals(N3(matrix, size), 40);
});

Deno.test("N3 detects vertical finder-like pattern", () => {
  const size = 11;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));

  const pattern = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  for (let i = 0; i < 11; i++) matrix[i][5] = pattern[i];

  assertEquals(N3(matrix, size), 40);
});

// N4: dark module ratio
Deno.test("N4 computes dark ratio penalty", () => {
  const size = 10; // 100 cells
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));

  // set 60 dark modules -> 60% -> deviation 10% -> steps = 2 -> score 20
  // set first 60 cells to 1
  let set = 0;
  for (let r = 0; r < size && set < 60; r++) {
    for (let c = 0; c < size && set < 60; c++) {
      matrix[r][c] = 1;
      set++;
    }
  }

  assertEquals(N4(matrix, size), 20);
});

// Integration sanity check for penalty() combining parts
Deno.test("penalty sums components", () => {
  const size = 11;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));

  // create one horizontal finder-like pattern (40) and one 2x2 block (3)
  const pattern = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  for (let i = 0; i < 11; i++) matrix[2][i] = pattern[i];
  matrix[5][5] = 1;
  matrix[5][6] = 1;
  matrix[6][5] = 1;
  matrix[6][6] = 1;

  // set dark ratio to exactly 50% to make N4 = 0
  // set 60 cells to 1 and clear 60 elsewhere to aim for 50% but keeping simple:
  // instead, compute expected as N1 + N2 + N3 + N4 by calling each exported fn
  const expected = N1(matrix, size) + N2(matrix, size) + N3(matrix, size) + N4(matrix, size);

  assertEquals(penalty(matrix, size), expected);
});
