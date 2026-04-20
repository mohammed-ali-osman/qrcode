import { assertEquals, assertThrows } from "@std/assert";
import { codewords } from "../../src/core/codeword.ts";
import { ErrorCorrectionLevel } from "../../src/core/constants.ts";

Deno.test("codewords returns correct table entry for version 1 L", () => {
	const cw = codewords(1, "L");
	assertEquals(cw.codewords, 19);
	assertEquals(cw.ecCodewords, 7);
	assertEquals(cw.groups.length, 1);
	assertEquals(cw.groups[0].blocks, 1);
	assertEquals(cw.groups[0].dataCodewords, 19);
});

Deno.test("codewords throws for invalid version or level", () => {
	assertThrows(() => codewords(0, "L"));
	assertThrows(() => codewords(1, "Z" as unknown as ErrorCorrectionLevel));
});
