import { EC } from "./constants.ts";
import type { Codeword, ErrorCorrectionLevel } from "../types/core.ts";

/**
 * Get codeword information for a specific QR version and error correction level.
 */

function codeword(version: number, level: ErrorCorrectionLevel): Codeword {
  if (version < 1 || version > 40) {
    throw new RangeError(`QR version must be between 1 and 40. Received: ${version}`);
  }

  const data = EC[version]?.[level];

  if (!data) {
    throw new Error(`Unsupported Version ${version} with EC Level ${level}. Ensure version is within 1-40 and level is one of L, M, Q, H.`);
  }

  return data;
}

export { codeword }