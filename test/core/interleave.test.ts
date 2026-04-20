import { assertEquals } from "@std/assert";
import { interleave, block } from "../../src/core/interleave.ts";

// fake data structure like your ErrorCorrectionTable output
const groups = [
  { blocks: 2, dataCodewords: 3 },
  { blocks: 1, dataCodewords: 2 },
];

Deno.test("block splits data into blocks correctly", () => {
  const data = new Uint8Array([1,2,3,4,5,6,7,8]);
  const blocks = block(data, groups);

  // should create 3 blocks: 2 of size 3, 1 of size 2
  assertEquals(blocks.length, 3);
  assertEquals(blocks[0], new Uint8Array([1,2,3]));
  assertEquals(blocks[1], new Uint8Array([4,5,6]));
  assertEquals(blocks[2], new Uint8Array([7,8]));
});

Deno.test("block returns empty array if no groups", () => {
  const data = new Uint8Array([]);
  const blocks = block(data, []);
  assertEquals(blocks.length, 0);
});

Deno.test("interleave interleaves blocks correctly", () => {
  const blocks = [
    new Uint8Array([1,2,3]),
    new Uint8Array([4,5,6]),
    new Uint8Array([7,8])
  ];

  const result = interleave(blocks, 3);

  // interleaving: take 1st byte from each, then 2nd, etc.
  // expected: [1,4,7, 2,5,8, 3,6]
  assertEquals(result, new Uint8Array([1,4,7,2,5,8,3,6]));
});

Deno.test("interleave handles shorter blocks", () => {
  const blocks = [
    new Uint8Array([1,2]),
    new Uint8Array([3]),
  ];

  const result = interleave(blocks, 3);
  // step by step:
  // i=0: 1,3
  // i=1: 2
  // i=2: nothing (both blocks too short)
  assertEquals(result, new Uint8Array([1,3,2]));
});

Deno.test("interleave returns empty if no blocks", () => {
  const result = interleave([], 5);
  assertEquals(result.length, 0);
});

