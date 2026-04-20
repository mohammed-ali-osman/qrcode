import { assertEquals, assertThrows } from "@std/assert";
import { alpha } from "../../src/encode/alphanumeric.ts";

Deno.test("test out range characters", () => {
  const data = "a";
  assertThrows(() => {
    alpha(data);
  }, Error);
});

Deno.test("test the 1 digits", () => {
  const data = "A";
  assertEquals(alpha(data), ["001010"]);
});

Deno.test("test the 2 digits", () => {
  const data = "AB";
  assertEquals(alpha(data), ["00111001101"]);
});

