import { assertEquals, assertThrows } from "@std/assert";
import { numeric } from "../../src/encode/numeric.ts";

Deno.test("test out range integers", () => {
  const data = "a";

  assertThrows(() => {
    numeric(data);
  });
});

Deno.test("test 1 digit integers", () => {
  assertEquals(numeric(1), [[1, 4]]);
});

Deno.test("test 2 digit integers", () => {
  assertEquals(numeric("12"), [[12, 7]]);
});

Deno.test("test 3 digit integers", () => {
  assertEquals(numeric(123), [[123, 10]]);
});

Deno.test("test 4 digit integers", () => {
  assertEquals(numeric(1234), [[123, 10], [4, 4]]);
});
