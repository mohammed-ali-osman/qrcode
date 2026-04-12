import { exp as exponent } from "./rs/exp.wasm";
import { exp } from "./rs/exp.ts";
import { exponent as table } from "./rs/lookup.ts";

Deno.bench("precomputed values function", { baseline: true }, () => {
  table(100);
});

Deno.bench("wasm function", () => {
  exponent(100);
});

Deno.bench("typscript function", () => {
  exp(100);
});
