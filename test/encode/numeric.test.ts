import { assertEquals, assertThrows } from "jsr:@std/assert@1.0.18";
import { numeric } from "../../src/encode/numeric.ts";

Deno.test("test out range integers", () => {
  const data = "a";

  assertThrows(() => {
    numeric(data);
  });
});

Deno.test("test 1 digit integers", () => {
  assertEquals(numeric(1), ["0001"]);
});

Deno.test("test 2 digit integers", () => {
  assertEquals(numeric("12"), ["0001100"]);
});

Deno.test("test 3 digit integers", () => {
  assertEquals(numeric(123), ["0001111011"]);
});

Deno.test("test 4 digit integers", () => {
  assertEquals(numeric(1234), ["0001111011", "0100"]);
});
