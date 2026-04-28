import { assert, assertEquals, assertThrows } from "@std/assert";
import { capacity } from "../../src/core/capacity.ts";
import { capacities } from "../../src/core/constants.ts";
import { Modes } from "../../src/core/constants.ts";
import type { ErrorCorrectionLevel } from "../../src/types/core.ts";


// Negative length
Deno.test("capacity throws on negative length", () => {
  assertThrows(() => capacity(-1, Modes.Byte), RangeError);
});

// Version + EC provided, valid
Deno.test("capacity returns correct version + ec when valid", () => {
  const result = capacity(10, Modes.Byte, 1, "L");
  assertEquals(result.version, 1);
  assertEquals(result.ec, "L");
  assertEquals(result.mode, Modes.Byte);
  assertEquals(result.capacity, capacities[1]["L"][Modes.Byte]);
});

// Version + EC provided, too long
Deno.test("capacity throws if length exceeds version + EC", () => {
  const limit = capacities[1]["L"][Modes.Byte];
  assertThrows(() => capacity(limit + 1, Modes.Byte, 1, "L"), Error);
});

// Version only, finds first EC that fits
Deno.test("capacity finds first valid EC for given version", () => {
  const length = 10;
  const result = capacity(length, Modes.Byte, 1);
  assertEquals(result.version, 1);
  // ec should be first in H, Q, M, L order that fits
  const ecOrder = ["H", "Q", "M", "L"] as const;
  const ecIndex = ecOrder.indexOf(result.ec);
  const foundIndex = ecOrder.findIndex(ec => capacities[1][ec][Modes.Byte] >= length);
  assertEquals(ecIndex, foundIndex);
});

// Version only, length too long for version
Deno.test("capacity throws if version cannot fit length", () => {
  const maxV1 = Math.max(...Object.values(capacities[1]).flatMap(ec => Object.values(ec)));
  assertThrows(() => capacity(maxV1 + 1, Modes.Byte, 1), Error);
});

// Auto version selection (smallest valid)
Deno.test("capacity auto-selects smallest version that fits", () => {
  const length = 10;
  const result = capacity(length, Modes.Byte);
  assertEquals(result.version, 1); // smallest version that can fit
  assert(result.capacity >= length);
});

// Too large for any version
Deno.test("capacity throws if length too large for all versions", () => {
  const maxGlobal = Math.max(
    ...Object.values(capacities as Record<number, Record<ErrorCorrectionLevel, Record<Modes, number>>>)
      .flatMap(v => Object.values(v))
      .flatMap(ec => Object.values(ec))
  );

  assertThrows(() => capacity(maxGlobal + 1, Modes.Byte), Error);
});

// Version provided but invalid (undefined limit)
Deno.test("capacity throws if version is invalid", () => {
  assertThrows(() => capacity(10, Modes.Byte, 999, "L"), Error);
});
