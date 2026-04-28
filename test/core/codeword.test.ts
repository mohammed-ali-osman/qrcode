import { assertEquals, assertThrows } from "@std/assert";
import { codeword } from "../../src/core/codeword.ts";
import type { ErrorCorrectionLevel } from "../../src/types/core.ts";

Deno.test("codeword returns correct table entry for version 1 L", () => {
	const cw = codeword(1, "L");
	assertEquals(cw.codewords, 19);
	assertEquals(cw.ecCodewords, 7);
	assertEquals(cw.groups.length, 1);
	assertEquals(cw.groups[0].blocks, 1);
	assertEquals(cw.groups[0].dataCodewords, 19);
});

Deno.test("codeword throws for invalid version or level", () => {
	assertThrows(() => codeword(0, "L"));
	assertThrows(() => codeword(1, "Z" as unknown as ErrorCorrectionLevel));
});
