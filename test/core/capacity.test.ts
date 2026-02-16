import { assert, assertEquals, assertThrows } from "jsr:@std/assert@1.0.18";
import { capacity, capacities } from "../../src/core/capacity.ts";
import { Modes, quality } from "../../src/core/constants.ts";


// 1️⃣ Negative length
Deno.test("capacity throws on negative length", () => {
  assertThrows(() => capacity(-1, Modes.Byte), RangeError);
});

// 2️⃣ Version + EC provided, valid
Deno.test("capacity returns correct version + ec when valid", () => {
  const result = capacity(10, Modes.Byte, 1, "L");
  assertEquals(result.version, 1);
  assertEquals(result.ec, "L");
  assertEquals(result.mode, Modes.Byte);
  assertEquals(result.capacity, capacities[1]["L"][Modes.Byte]);
});

// 3️⃣ Version + EC provided, too long
Deno.test("capacity throws if length exceeds version + EC", () => {
  const limit = capacities[1]["L"][Modes.Byte];
  assertThrows(() => capacity(limit + 1, Modes.Byte, 1, "L"), Error);
});

// 4️⃣ Version only, finds first EC that fits
Deno.test("capacity finds first valid EC for given version", () => {
  const length = 10;
  const result = capacity(length, Modes.Byte, 1);
  assertEquals(result.version, 1);
  // ec should be first in quality list that fits
  const ecIndex = quality.indexOf(result.ec);
  const foundIndex = quality.findIndex(ec => capacities[1][ec][Modes.Byte] >= length);
  assertEquals(ecIndex, foundIndex);
});

// 5️⃣ Version only, length too long for version
Deno.test("capacity throws if version cannot fit length", () => {
  const maxV1 = Math.max(...Object.values(capacities[1]).flatMap(ec => Object.values(ec)));
  assertThrows(() => capacity(maxV1 + 1, Modes.Byte, 1), Error);
});

// 6️⃣ Auto version selection (smallest valid)
Deno.test("capacity auto-selects smallest version that fits", () => {
  const length = 10;
  const result = capacity(length, Modes.Byte);
  assertEquals(result.version, 1); // smallest version that can fit
  assert(result.capacity >= length);
});

// 7️⃣ Too large for any version
Deno.test("capacity throws if length too large for all versions", () => {
  const maxGlobal = Math.max(
    ...Object.values(capacities)
      .flatMap(v => Object.values(v))
      .flatMap(ec => Object.values(ec))
  );
  assertThrows(() => capacity(maxGlobal + 1, Modes.Byte), Error);
});

// 8️⃣ Version provided but invalid (undefined limit)
Deno.test("capacity throws if version is invalid", () => {
  assertThrows(() => capacity(10, Modes.Byte, 999, "L"), Error);
});
