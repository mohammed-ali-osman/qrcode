import { analyze } from "./analyze/analyze.ts";
import { Capacity, capacity } from "./core/capacity.ts";
import { encode } from "./encode/encode.ts";
import { division, generator } from "./ec/rs.ts";
import { ErrorCorrectionLevel, Modes } from "./core/constants.ts";
import { characterCount } from "./character-count/character-count.ts";
import { codewords } from "./core/codeword.ts";
import { bitStream } from "./core/bitStream.ts";
import { block, interleave } from "./core/interleave.ts";
import { matrix } from "./matrix/matrix.ts";
import { svg, canvas, png, jpg } from "./render/render.ts";
import { Matrix } from "./types/matrix.ts";

interface Options {
    version?: number;
    ec?: ErrorCorrectionLevel;
    mask?: number;
    render: RenderOptions;
}

export class QRcode {
    input: string;
    mode: Modes;
    version: number;
    ec: ErrorCorrectionLevel;
    modules: number;
    options: Options | undefined;
    matrix: Matrix;

    constructor(input: string, options?: Options) {
        this.input = input;
        this.mode = analyze(input).mode;

        const cap: Capacity = capacity(input.length, this.mode, options?.version, options?.ec);
        this.version = options?.version ?? cap.version;
        this.ec = options?.ec ?? cap.ec;
        this.modules = this.version * 4 + 17;

        this.options = options;
        this.matrix = [];

    }

    public build() {
        const count = characterCount(this.version, this.mode, this.input.length);
        const data = encode(this.input, this.mode);

        const cw = codewords(this.version, this.ec);
        const bytes = bitStream(this.mode, count, data, cw.codewords);

        const dataBlocks = block(new Uint8Array(bytes.map(b => parseInt(b, 2))), cw.groups);
        const ecBlocks = dataBlocks.map(b => division(b, generator(cw.ecCodewords)));

        const interleavedData = interleave(dataBlocks, cw.codewords);
        const interleavedEC = interleave(ecBlocks, cw.ecCodewords);

        const message = new Uint8Array([...interleavedData, ...interleavedEC]);

        this.matrix.push(...matrix(message, this.ec, this.modules, this.options?.mask));

        return this;
    }

    public render() {
        let element;

        switch (this.options?.render.type) {
            case "svg":
                element = svg(this.matrix, this.modules, this.options.render);
                break
            case "canvas":
                element = canvas(this.matrix, this.modules, this.options.render);
                break
            case "png":
                element = png(this.matrix, this.modules, this.options.render);
                break
            case "jpg":
                element = jpg(this.matrix, this.modules, this.options.render);
                break
            default:
                throw new Error("Please choose an output format type by passing options.");
        }

        return element;
    }
}
