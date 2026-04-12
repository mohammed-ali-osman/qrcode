// character_count_bits.test.ts
import { assertEquals, assertThrows } from "jsr:@std/assert@1.0.13";
import { characterCount } from "../../src/character-count/character-count.ts";
import { Modes } from "../../src/core/constants.ts";

/**
 * Helper to generate expected binary string
 */

function expected(length: number, pad: number): string {
  return length.toString(2).padStart(pad, "0");
}

Deno.test("characterCount - valid cases", () => {
  const cases = [
    // Versions 1–9
    { version: 1,  mode: Modes.Numeric,      length: 5,  pad: 10 },
    { version: 1,  mode: Modes.Alphanumeric, length: 5,  pad: 9  },
    { version: 1,  mode: Modes.Byte,         length: 5,  pad: 8  },
    { version: 1,  mode: Modes.Kanji,        length: 5,  pad: 8  },
    { version: 9,  mode: Modes.Numeric,      length: 5,  pad: 10 },

    // Versions 10–26
    { version: 10, mode: Modes.Numeric,      length: 12, pad: 12 },
    { version: 10, mode: Modes.Alphanumeric, length: 12, pad: 11 },
    { version: 10, mode: Modes.Byte,         length: 12, pad: 16 },
    { version: 10, mode: Modes.Kanji,        length: 12, pad: 10 },
    { version: 26, mode: Modes.Numeric,      length: 12, pad: 12 },

    // Versions 27–40
    { version: 27, mode: Modes.Numeric,      length: 25, pad: 14 },
    { version: 27, mode: Modes.Alphanumeric, length: 25, pad: 13 },
    { version: 27, mode: Modes.Byte,         length: 25, pad: 16 },
    { version: 27, mode: Modes.Kanji,        length: 25, pad: 12 },
    { version: 40, mode: Modes.Numeric,      length: 25, pad: 14 },
  ];

  for (const { version, mode, length, pad } of cases) {
    assertEquals(
      characterCount(version, mode as Modes, length),
      expected(length, pad)
    );
  }
});

Deno.test("characterCount - invalid versions", () => {
  assertThrows(
    () => characterCount(0, Modes.Numeric, 5),
    Error,
    "Invalid version number"
  );

  assertThrows(
    () => characterCount(41, Modes.Numeric, 5),
    Error,
    "Invalid version number"
  );
});

