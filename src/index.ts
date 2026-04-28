import { analyze } from "./analyze/analyze.ts";
import { characterCount } from "./character-count/character-count.ts";
import { bitStream } from "./core/bitStream.ts";
import { capacity } from "./core/capacity.ts";
import { encode } from "./encode/encode.ts";
import { codeword } from "./core/codeword.ts";
import { Modes } from "./core/constants.ts";
import { division, generator } from "./ec/rs.ts";
import { block, interleave } from "./core/interleave.ts";
import { matrix } from "./matrix/matrix.ts";
import * as Render from "./render/render.ts";
import type { Options } from "./types/core.ts";
import type { Capacity, ErrorCorrectionLevel } from "./types/core.ts";
import type { Matrix } from "./types/matrix.ts";

/**
 * This class represents a QR code generator. It takes an input string and optional configuration options to create a QR code matrix. The class includes methods to build the QR code by encoding the input data, applying error correction, and generating the final matrix. It also provides a render method to output the QR code in various formats such as SVG, canvas, PNG, or JPEG based on the specified rendering options.
 */

class QRcode {
  input: string | number;
  mode: Modes;
  version: number;
  ec: ErrorCorrectionLevel;
  modules: number;
  length: number;
  options: Options | undefined;
  matrix: Matrix;

  constructor(input: string | number, options?: Options) {
    this.input = input;
    const [mode, length] = analyze(input);
    this.mode = mode;
    this.length = length;

    const cap: Capacity = capacity(length, this.mode, options?.version, options?.ec);

    this.version = options?.version ?? cap.version;
    this.ec = options?.ec ?? cap.ec;
    this.modules = this.version * 4 + 17;

    this.options = options;
    this.matrix = new Uint8Array(this.modules * this.modules);
  }

  public build() {
    const count = characterCount(this.version, this.mode, this.length);
    const data = encode(this.input, this.mode);

    const cw = codeword(this.version, this.ec);
    const bytes = bitStream(this.mode, count, data, cw.codewords);

    const dataBlocks = block(bytes, cw.groups);

    const ecBlocks = dataBlocks.map((b) =>
      division(b, generator(cw.ecCodewords))
    );

    const interleaved = {
      data: interleave(dataBlocks, cw.codewords),
      ec: interleave(ecBlocks, cw.ecCodewords)
    }

    const message = new Uint8Array([...interleaved.data, ...interleaved.ec]);

    this.matrix.set(matrix(message, this.ec, this.modules, this.options?.mask));

    return this;
  }

  public render() {
    let element;

    switch (this.options?.render?.type) {
      case "svg":
        element = Render.svg(this.matrix, this.modules, { ...this.options.render, content: this.options.render.content || this.input as string });
        break;
      case "canvas":
        element = Render.canvas(this.matrix, this.modules, this.options.render);
        break;
      case "png":
        element = Render.png(this.matrix, this.modules, this.options.render);
        break;
      case "jpg":
        element = Render.jpg(this.matrix, this.modules, this.options.render);
        break;
      default:
        throw new Error("Please choose an output format type by passing options.");
    }

    return element;
  }
}

export { QRcode };