import { assertEquals } from "@std/assert";
import { kanji } from "../../src/encode/kanji.ts";

Deno.test("kanji encodes characters in first range", () => {
  // U+3000 maps to 0x8140 per constants; should produce one 13-bit value
  const bits = kanji("\u3000");
  assertEquals(bits.length, 1);
  assertEquals(bits[0].length, 13);
});

Deno.test("kanji encodes characters in second range", () => {
  // U+6F3E maps to 0xE040 per constants; should produce one 13-bit value
  const bits = kanji("\u6F3E");
  assertEquals(bits.length, 1);
  assertEquals(bits[0].length, 13);
});

Deno.test("kanji returns empty for non-kanji characters", () => {
  const bits = kanji("A");
  assertEquals(bits.length, 0);
});
