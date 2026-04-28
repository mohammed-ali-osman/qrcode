import { Modes, capacities } from "./constants.ts";
import type { Capacity, ErrorCorrectionLevel } from "../types/core.ts";

/**
 * This function calculates the appropriate QR code version and error correction level based on the length of the input data, the encoding mode, and optionally specified version and error correction level. It checks the capacity table to ensure that the data can fit within the constraints of the chosen version and error correction level, throwing errors if the data is too long for the specified parameters or for any QR code version.
 */

function capacity(length: number, mode: Modes, version?: number, ec?: ErrorCorrectionLevel): Capacity {
  if (length < 0) throw new RangeError("Length cannot be negative.");

  if (version && ec) {
    const limit = capacities[version]?.[ec]?.[mode];

    if (limit === undefined || length > limit) {
      throw new Error(
        `Data too long for version ${version} and error correction level ${ec}. Maximum character is ${limit}.`
      );
    }
    return { version, ec, mode, capacity: limit };
  }

  if (version) {
    for (const ecLevel of ["H", "Q", "M", "L"] as const) {
      const limit = capacities[version]?.[ecLevel]?.[mode];

      if (limit !== undefined && limit >= length) {
        return { version, ec: ecLevel, mode, capacity: limit };
      }
    }
    throw new Error(`Data too long for version ${version}.`);
  }

  if (ec) {
    for (let v = 1; v < 41; v++) {
      const limit = capacities[v]?.[ec]?.[mode];

      if (limit !== undefined && limit >= length) {
        return { version: v, ec: ec, mode, capacity: limit };
      }
    }
    throw new Error(`Data too long for Error correction ${ec}.`);
  }

  for (let v = 1; v < 41; v++) {
    for (const ecLevel of ["H", "Q", "M", "L"] as const) {
      const limit = capacities[v]?.[ecLevel]?.[mode];

      if (limit !== undefined && limit >= length) {
        return { version: v, ec: ecLevel, mode, capacity: limit };
      }
    }
  }

  throw new Error(`Data too long for any QR version. Maximum character for mode ${mode} is ${capacities[40]["L"][mode]} (Version 40, EC "L")`);
}

export { capacity };