import { assertEquals } from "jsr:@std/assert@1.0.18";
import { byte } from "../../src/encode/byte.ts";

Deno.test("byte test", ()=>{
    assertEquals(byte("😀"), ["1101100000111101"])
})