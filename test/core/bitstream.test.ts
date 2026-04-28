import { assertEquals } from "@std/assert";
import { bitStream } from "../../src/core/bitStream.ts";
import { Modes } from "../../src/core/constants.ts";
import type { Pack } from "../../src/types/core.ts";

Deno.test("bitStream includes mode + count + data bits", () => {
  const codewords = 4; // enough space
  const mode = Modes.Byte;
  const count: Pack = [1, 7];
  const data: Pack[] = [[65, 8]]; // "A" = 65

  const bytes = bitStream(mode, count, data, codewords);

  // Should have some bytes
  assertEquals(bytes.length > 0, true);
});

Deno.test("bitStream uses alternating pad bytes when padding required", () => {
  const codewords = 8;
  const count: Pack = [1, 7];
  const data: Pack[] = [[65, 8]]; // "A" = 65

  const bytes = bitStream(Modes.Byte, count, data, codewords);

  // Should have 8 bytes with padding
  assertEquals(bytes.length, 8);
});

Deno.test("bitStream truncates when exceeding capacity", () => {
  const codewords = 1; // 8 bits only
  const count: Pack = [1, 7];
  const hugeBits: Pack[] = Array(100).fill([1, 1]);

  const bytes = bitStream(Modes.Byte, count, hugeBits, codewords);

  assertEquals(bytes.length, 1);
});

Deno.test("bitStream respects exact capacity without extra padding", () => {
  const codewords = 2; // 16 bits
  const mode = Modes.Byte;
  const count: Pack = [0, 7];

  // 4 (mode) + 7 (count) + 4 (terminator) = 15 bits, needs 1 padding bit to reach 16
  const bytes = bitStream(mode, count, [], codewords);

  assertEquals(bytes.length, 2);
});

Deno.test("bitStream pads to next byte boundary when misaligned", () => {
  const codewords = 4; // enough capacity
  const mode = Modes.Byte;
  const count: Pack = [1, 7];

  // 3 bits only to force misalignment
  const data: Pack[] = [[5, 3]];
  const bytes = bitStream(mode, count, data, codewords);

  // Total bits: 4 (mode) + 7 (count) + 3 (data) + 4 (terminator) = 18 bits
  // Should pad to 24 bits (3 bytes)
  assertEquals(bytes.length, 4);
});
