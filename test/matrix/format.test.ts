import { assertEquals } from "@std/assert";
import { ErrorCorrectionBits } from "../../src/core/constants.ts";
import { module } from "../../src/matrix/pattern.ts"
import { format, apply } from "../../src/matrix/format.ts";

Deno.test("format produces 15-bit sequence and apply maps bits to matrix positions", () => {
  const size = 21;
  const fmt = format(ErrorCorrectionBits.M, 3);
  // ensure fmt is a number and within 15-bit range
  assertEquals(typeof fmt === "number", true);
  assertEquals(fmt <= 0x7fff, true);

  const matrix = new Uint8Array(size * size).fill(255);
  apply(matrix, fmt, size);

  // bit 0 (MSB) should be at matrix[8][0]
  const msb = (fmt >> 14) & 1;
  assertEquals(matrix[8 * size + 0], msb);

  // check a mid bit: i=7 maps to matrix[8][size-1-7]
  const midBit = (fmt >> (14 - 7)) & 1;
  assertEquals(matrix[8 * size + (size - 1 - 7)], midBit);

  module(matrix, 21);

  // dark module must be set
  assertEquals(matrix[(size - 8) * size + 8], 1);
});
