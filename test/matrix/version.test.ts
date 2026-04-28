import { assertEquals, assertThrows } from "@std/assert";
import { versions, apply } from "../../src/matrix/version.ts";

Deno.test("throws for versions < 7", () => {
  assertThrows(() => versions(6));
  assertThrows(() => versions(1));
  assertThrows(() => versions(0));
});

Deno.test("throws for versions > 40", () => {
  assertThrows(() => versions(41));
  assertThrows(() => versions(100));
});

Deno.test("version 7 produces correct 18-bit value", () => {
  // Known correct value from QR spec
  // Version 7 => 0x07C94
  assertEquals(versions(7), 0x07c94);
});

Deno.test("version 8 produces correct 18-bit value", () => {
  // Version 8 => 0x085BC
  assertEquals(versions(8), 0x085bc);
});

Deno.test("result is always 18 bits", () => {
  for (let v = 7; v <= 40; v++) {
    const result = versions(v);

    // Must be <= 18 bits
    const bitLength = 32 - Math.clz32(result);
    assertEquals(bitLength <= 18, true);
  }
});

Deno.test("version.apply throws for versions outside 7..40", () => {
  const size = 21;
  const m = new Uint8Array(size * size).fill(255);
  // below range
  assertThrows(() => apply(m, size, 6));
  // above range
  const m2 = new Uint8Array(100).fill(255);
  assertThrows(() => apply(m2, 100, 41));
});

Deno.test("applying for 7..40", () => {
  const size = 45;
  const m = new Uint8Array(size * size).fill(255);

  assertEquals(apply(m, size, 7), undefined);
});
