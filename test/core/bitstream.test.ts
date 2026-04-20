import { assertEquals } from "@std/assert";
import { bitStream } from "../../src/core/bitStream.ts";
import { Modes } from "../../src/core/constants.ts";

Deno.test("bitStream includes mode + count + data bits", () => {
  const codewords = 4; // enough space
  const mode = Modes.Byte;
  const count = "00000001";
  const data = ["01000001"];

  const bytes = bitStream(mode, count, data, codewords);

  const fullBitStream = bytes.join("");

  const expectedStart =
    mode.toString(2).padStart(4, "0") +
    count +
    data.join("");

  // It must start with the structural bits
  assertEquals(
    fullBitStream.startsWith(expectedStart),
    true
  );
});

Deno.test("bitStream uses alternating pad bytes when padding required", () => {
  const codewords = 8;
  const bytes = bitStream(Modes.Byte, "00000001", ["01000001"], codewords);

  const PAD_BYTES = ["11101100", "00010001"];

  // find first pad byte
  const paddingStartIndex = bytes.findIndex(b => PAD_BYTES.includes(b));

  if (paddingStartIndex !== -1) {
    for (let i = paddingStartIndex; i < bytes.length; i++) {
      assertEquals(bytes[i], PAD_BYTES[(i - paddingStartIndex) % 2]);
    }
  }
});

Deno.test("bitStream truncates when exceeding capacity", () => {
  const codewords = 1; // 8 bits only
  const hugeBits = Array(100).fill("1");

  const bytes = bitStream(Modes.Byte, "00000001", hugeBits, codewords);

  assertEquals(bytes.length, 1);
});

Deno.test("bitStream respects exact capacity without extra padding", () => {
  const codewords = 2; // 16 bits
  const mode = Modes.Byte;
  const count = "00000000";

  // 4 (mode) + 8 (count) + 4 (terminator) = 16 exactly
  const bytes = bitStream(mode, count, [], codewords);

  assertEquals(bytes.length, 2);
});

Deno.test("bitStream pads to next byte boundary when misaligned", () => {
  const codewords = 4; // enough capacity
  const mode = Modes.Byte;
  const count = "00000001";

  // 3 bits only to force misalignment
  const data = ["101"];
  const bytes = bitStream(mode, count, data, codewords);
  const full = bytes.join("");

  // ensure alignment occurred
  assertEquals(full.length % 8, 0);
});
