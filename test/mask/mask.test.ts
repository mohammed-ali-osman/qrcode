import { assert, assertEquals } from "@std/assert";
import { mask, masks, apply } from "../../src/mask/mask.ts";
import { Matrix } from "../../src/types/matrix.ts";

// import { masks, toEcBits, mask, apply } from "./mask.ts";
// import { ErrorCorrectionBits } from "../matrix/format.ts";

// ─────────────────────────────────────────────
// masks[] tests
// ─────────────────────────────────────────────

Deno.test("masks array contains 8 mask functions", () => {
  assertEquals(masks.length, 8);
});

Deno.test("mask[0] (r+c)%2 === 0", () => {
  assert(masks[0](0, 0)); // 0+0 = 0
  assert(!masks[0](0, 1)); // 0+1 = 1
});

Deno.test("mask[1] r%2 === 0", () => {
  assert(masks[1](2, 5));
  assert(!masks[1](3, 5));
});

Deno.test("mask[2] c%3 === 0", () => {
  assert(masks[2](1, 3));
  assert(!masks[2](1, 4));
});

Deno.test("mask[3] (r+c)%3 === 0", () => {
  assert(masks[3](1, 2)); // 3 % 3 === 0
  assert(!masks[3](1, 1));
});

Deno.test("mask[4] floor(r/2)+floor(c/3) even", () => {
  assert(masks[4](0, 0));
  assert(!masks[4](2, 0));
});

Deno.test("mask[5] complex rule", () => {
  const result = masks[5](2, 3);
  assert(typeof result === "boolean");
});

Deno.test("mask[6] complex rule", () => {
  const result = masks[6](2, 3);
  assert(typeof result === "boolean");
});

Deno.test("mask[7] complex rule", () => {
  const result = masks[7](2, 3);
  assert(typeof result === "boolean");
});

// ─────────────────────────────────────────────
// apply() tests
// ─────────────────────────────────────────────

Deno.test("apply flips bits when mask condition is true", () => {
  // Use a larger matrix so reserved() does not mark our test cells
  const size = 12;
  const matrix = Array.from({ length: size }, () => Array(size).fill(1));

  // Use mask 0: (r + c) % 2 === 0
  // Choose non-reserved coordinates in the bottom-right quadrant
  matrix[11][11] = 1; // 11+11 = 22 even -> should flip
  matrix[10][10] = 1; // 10+10 = 20 even -> should flip

  apply(matrix, 0, size);

  assertEquals(matrix[11][11], 0);
  assertEquals(matrix[10][10], 0);
});

Deno.test("apply skips null cells", () => {
  const size = 12;
  const matrix = Array.from({ length: size }, () => Array(size).fill(1 as number | null));

  // place a null in a non-reserved cell
  matrix[11][10] = null;

  apply(matrix, 0, size);

  assertEquals(matrix[11][10], null);
});


// ─────────────────────────────────────────────
// mask() selection test (lightweight integration)
// ─────────────────────────────────────────────

Deno.test("mask returns a valid mask index 0-7", () => {
  // Use a realistic QR size (version 1 -> 21x21) so format bits can be written
  const size = 21;
  const matrix = Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => ((r + c) % 2 ? 0 : 1)));

  const result = mask(matrix, size);

  assert(result >= 0 && result <= 7);
});

Deno.test("mask skips null cells during evaluation and uses default ec", () => {
  const size = 21;
  const matrix = Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => ((r + c) % 2 ? 0 : 1)));

  // Place a null in a non-reserved cell to trigger the internal null-skip branch
  (matrix as Matrix)[11][11] = null;

  const result = mask(matrix, size); // omit ec to exercise default
  assert(result >= 0 && result <= 7);
});
