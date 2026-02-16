import { assertEquals } from "jsr:@std/assert@1.0.18";
import { format, apply as applyFormat, ErrorCorrectionBits } from "../../src/matrix/format.ts";

Deno.test("format produces 15-bit sequence and apply maps bits to matrix positions", () => {
  const size = 21;
  const fmt = format(ErrorCorrectionBits.M, 3);
  // ensure fmt is a number and within 15-bit range
  assertEquals(typeof fmt === "number", true);
  assertEquals(fmt <= 0x7fff, true);

  const matrix: number[][] = Array.from({ length: size }, () => Array(size).fill(null));
  applyFormat(matrix, fmt, size);

  // bit 0 (MSB) should be at matrix[8][0]
  const msb = (fmt >> 14) & 1;
  assertEquals(matrix[8][0], msb);

  // check a mid bit: i=7 maps to matrix[8][size-1-7]
  const midBit = (fmt >> (14 - 7)) & 1;
  assertEquals(matrix[8][size - 1 - 7], midBit);

  // dark module must be set
  assertEquals(matrix[size - 8][8], 1);
});
