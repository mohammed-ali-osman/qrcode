import { assertEquals, assertThrows } from "@std/assert";
import { encode } from "../../src/encode/encode.ts";
import { Modes } from "../../src/core/constants.ts";

Deno.test("test out range integers", () => {
  const data = "a";

  assertThrows(() => {
    encode(data, Modes.Numeric);
  });
});

Deno.test("test 1 digit integers", () => {
  assertEquals(encode("1", Modes.Numeric), [[1, 4]]);
});

Deno.test("test 2 digit integers", () => {
  assertEquals(encode("12", Modes.Numeric), [[12, 7]]);
});

Deno.test("test 3 digit integers", () => {
  assertEquals(encode("123", Modes.Numeric), [[123, 10]]);
});

Deno.test("test 4 digit integers", () => {
  assertEquals(encode("1234", Modes.Numeric), [[123, 10], [4, 4]]);
});

Deno.test("test out range characters", () => {
  const data = "a";
  assertThrows(() => {
    encode(data, Modes.Alphanumeric);
  }, Error);
});

Deno.test("test the 1 digits", () => {
  const data = "A";
  assertEquals(encode(data, Modes.Alphanumeric), [[10, 6]]);
});

Deno.test("test the 2 digits", () => {
  const data = "AB";
  assertEquals(encode(data, Modes.Alphanumeric), [[461, 11]]);
});

Deno.test("byte test", () => {
  // "Hi" = 72, 73 in ASCII
  assertEquals(encode("Hi", Modes.Byte), [[72, 8], [105, 8]]);
});

Deno.test("kanji encodes characters in first range", () => {
  // U+3000 maps to 0x8140 per constants; should produce one 13-bit value
  const bits = encode("\u3000", Modes.Kanji);
  assertEquals(bits.length, 1);
  assertEquals(bits[0].length, 2);
});

Deno.test("kanji encodes characters in second range", () => {
  // U+6F3E maps to 0xE040 per constants; should produce one 13-bit value
  const bits = encode("\u6F3E", Modes.Kanji);
  assertEquals(bits.length, 1);
  assertEquals(bits[0].length, 2);
});

Deno.test("kanji returns empty for non-kanji characters", () => {
  const bits = encode("A", Modes.Kanji);
  assertEquals(bits.length, 0);
});

Deno.test("Unsupported mode", () => {
  assertThrows(() => {
    encode("123", 999 as Modes);
  });
});