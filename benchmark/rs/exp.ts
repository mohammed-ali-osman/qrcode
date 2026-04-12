export function exp(exponent: number): number {
  let buffer = 1;
  for (let i = 0; i < exponent; i++) {
    buffer <<= 1;

    if (buffer >= 256) {
      buffer ^= 285;
    }
  }

  return buffer;
}
