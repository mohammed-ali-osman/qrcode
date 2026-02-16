import { assertEquals } from "jsr:@std/assert@1.0.18";
import { reserved } from "../../src/core/reserve.ts";

Deno.test("Coverage: Dark Module (Line 32)", () => {
  const sizeV2 = 25; // v=2
  // Formula: 4*2 + 9 = 17. (17, 8) is outside the top-left 9x9 block.
  assertEquals(reserved(17, 8, sizeV2), true);
});

Deno.test("Coverage: Alignment Patterns (Line 23-26)", () => {
  const sizeV2 = 25;
  // Anchor at (18, 18). Math.abs(19-18) <= 2.
  assertEquals(reserved(19, 19, sizeV2), true);

  // Trigger the 'continue' (Line 20) by using an anchor that overlaps a finder
  // In V2, anchors are [6, 18]. (6, 6) overlaps the top-left finder area.
  // The loop will 'continue', but the module is still true due to timing/finders.
  assertEquals(reserved(6, 6, sizeV2), true);
});

Deno.test("Coverage: Format Info Strips (Lines 41 & 44)", () => {
  const sizeV1 = 21;
  // Line 41: r=8, c=13. 
  // r < 9 is true, BUT c >= size-8 (13) is also true. 
  // To hit Line 41, we need to bypass 'if (r < 9 && c >= size-8)' 
  // by using a coordinate that is NOT caught by the corner check.

  // Actually, in your current code, Line 41 and 44 are REDUNDANT. 
  // They are already covered by the "Top-right" and "Bottom-left" corner if-statements.
  // To force coverage, we test the exact boundaries:
  assertEquals(reserved(8, 13, sizeV1), true); // top-right strip
  assertEquals(reserved(13, 8, sizeV1), true); // bottom-left strip
});

Deno.test("Coverage: Version Info (Line 48-51)", () => {
  const sizeV7 = 45; // v=7
  // bottom-left (6x3): r=35, c=0
  assertEquals(reserved(35, 0, sizeV7), true);
  // top-right (3x6): r=0, c=35
  assertEquals(reserved(0, 35, sizeV7), true);
});

Deno.test("Coverage: The False Branch", () => {
  // A coordinate that misses every single IF statement
  assertEquals(reserved(10, 10, 21), false);
}); 

Deno.test("Coverage: Finder corners & Timing patterns", () => {
  const size = 21;
  // Finder corners
  assertEquals(reserved(0, 0, size), true);
  assertEquals(reserved(0, size - 1, size), true);
  assertEquals(reserved(size - 1, 0, size), true);

  // Timing patterns (row/column 6)
  assertEquals(reserved(6, 10, size), true);
  assertEquals(reserved(10, 6, size), true);
});

Deno.test("Coverage: Format info top-left area", () => {
  const size = 21;
  // r === 8 && c <= 8 && c !== 6
  assertEquals(reserved(8, 5, size), true);
  // c === 8 && r <= 8 && r !== 6
  assertEquals(reserved(5, 8, size), true);
});

Deno.test("Coverage: Alignment anchor (non-skipped)", () => {
  // version 7 has centers [6,22,38]; using size for v=7
  const sizeV7 = 45;
  // (22,22) is within 2 of an alignment center and not skipped by the overlap check
  assertEquals(reserved(22, 22, sizeV7), true);
});

Deno.test("Coverage: conditional operand combinations", () => {
  const size = 21;

  // r < 9 && c < 9 => true
  assertEquals(reserved(0, 0, size), true);
  // r < 9 true, c < 9 false
  assertEquals(reserved(0, 10, size), false);
  // r < 9 false, c < 9 true
  assertEquals(reserved(10, 0, size), false);

  // r < 9 && c >= size-8 => true
  assertEquals(reserved(0, size - 8, size), true);
  // r < 9 true, c >= size-8 false (already above)
  assertEquals(reserved(0, 12, size), false);
  // r < 9 false, c >= size-8 true
  assertEquals(reserved(12, size - 8, size), false);

  // r >= size-8 && c < 9 => true
  assertEquals(reserved(size - 1, 0, size), true);
  // combinations where one side is false
  assertEquals(reserved(size - 9, 0, size), false);
  assertEquals(reserved(size - 1, 9, size), false);

  // timing pattern OR combinations
  assertEquals(reserved(6, 6, size), true); // both true
  assertEquals(reserved(6, 10, size), true); // r===6 true
  assertEquals(reserved(10, 6, size), true); // c===6 true
  assertEquals(reserved(10, 10, size), false); // both false
});