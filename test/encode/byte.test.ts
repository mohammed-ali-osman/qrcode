import { assertEquals } from "@std/assert";
import { byte } from "../../src/encode/byte.ts";

Deno.test("byte test", ()=>{
    assertEquals(byte("😀"), ["1101100000111101"])
})