import { assertEquals } from "@std/assert";
import { placement, zigzag } from "../../src/matrix/placement.ts";
import { reserved } from "../../src/core/reserve.ts";

Deno.test("zigzag yields expected first and last coordinates for size=6", () => {
	const size = 6;
	const it = zigzag(size);
	const first = it.next().value;
	const second = it.next().value;
	// first yields [5,5], second yields [5,4]
	assertEquals(first, [5, 5]);
	assertEquals(second, [5, 4]);

	// consume to the end and get the last pair for column 1
	let last;
	for (const v of zigzag(size)) last = v;
	// last yielded coordinate for size=6 should be [0,0]
	assertEquals(last, [0, 0]);
});

Deno.test("placement fills non-reserved null modules in zigzag order", () => {
	const size = 12;
	const matrix = Array.from({ length: size }, () => Array(size).fill(null as number | null));

	// mark reserved modules with 0 so placement won't overwrite them
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			if (reserved(r, c, size)) matrix[r][c] = 0;
		}
	}

	// Count data modules (null & not reserved)
	const coords: [number, number][] = [];
	for (const [r, c] of zigzag(size)) {
		if (matrix[r][c] === null) coords.push([r, c]);
	}

	const bits = coords.map((_, i) => (i % 2)); // 0/1 alternating

	placement(matrix, bits, size);

	// Verify bits were placed in the order of coords
	for (let i = 0; i < coords.length; i++) {
		const [r, c] = coords[i];
		assertEquals(matrix[r][c], bits[i]);
	}
});

