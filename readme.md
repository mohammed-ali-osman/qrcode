# Peno

A high-performance, fully customizable TypeScript library for generating QR
codes. Designed for browser and Node.js environments, this library supports all
QR code standards, advanced rendering, and flexible integration.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Rendering Options](#rendering-options)
- [Advanced Usage](#advanced-usage)
- [Development](#development)
- [Test](#test)
- [License](#license)

## Features

- **Full QR Code Support:** Numeric, Alphanumeric, Byte, Kanji modes
- **Error Correction:** Levels L, M, Q, H
- **Version Control:** QR versions 1–40
- **Flexible Rendering:** SVG, Canvas, PNG, JPG outputs
- **Logo Overlay:** Custom logo with excavation and shape options
- **Color Customization:** Module and background colors
- **No Dependencies:** Pure TypeScript implementation
- **Modular Design:** Use high-level or low-level APIs

## Quick Start

```typescript
import { QRcode } from "./src/index.ts";

const qr = new QRcode("Hello, world!", {
  version: 2, // optional, auto-detected
  ec: "M", // error correction: 'L', 'M', 'Q', 'H'
  render: {
    type: "svg",
    color: { dark: "#222", light: "#fff" },
    margin: 4,
    logo: { src: "logo.png", width: 0.2, excavate: true },
  },
});

qr.build();
const svgElement = qr.render();
```

> [!NOTE]
> You should build the **QR code** using **.build()** method then render it with
> **.render()**

## API Reference

### QRcode Class

#### Constructor

```ts
new QRcode(input: string, options?: Options);
```

- `input`: Data to encode
- `options`: Optional settings:
  - `version`: QR version (1–40)
  - `ec`: Error correction level ('L', 'M', 'Q', 'H')
  - `mask`: Mask pattern (0–7)
  - `render`: Rendering options (see below)

#### Options interface

```ts
interface Options {
  version?: number;
  ec?: ErrorCorrectionLevel;
  mask?: number;
  render: RenderOptions;
}
```

#### Methods

- `build()`: Generates the QR code matrix.
- `render()`: Renders the QR code as Svg/Canvas/PNG/JPG based on options.

> [!NOTE]
> Recommendation: Use SVG for Web The svg renderer is the flagship choice for
> web applications. It provides the highest score and ensures a sharp, scalable
> image. It is also the only engine that natively supports auto-generated titles
> for screen readers.

> [!CAUTION]
> When using canvas() or image-based outputs (PNG/JPG) with a logo, ensure the
> logo is pre-loaded or provided as a Data URI, as these methods do not support
> asynchronous loading during the render cycle.

#### Example

```typescript
// For image-based outputs (PNG/JPG)
const qr = new QRcode("https://example.com", {
  render: { type: "png", size: 512 },
});

qr.build();

// Returns a Base64 Data URI string in the browser
// or a Buffer in Node.js
const pngData = qr.render();
```

## Rendering Options

| Format  | Return type         | Status |
| ------- | ------------------- | ------ |
| SVG     | `SVGElement`        | Stable |
| Canvas  | `HTMLCanvasElement` | _Beta_ |
| PNG/JPG | `string` / `Buffer` | _Beta_ |

See `src/types/render.ts` for full details. Key fields:

```ts
interface RenderOptions {
  size?: number;
  scale?: number;
  margin?: number;

  color?: {
    dark?: string;
    light?: string;
  };

  type?: "svg" | "canvas" | "png" | "jpg";

  content?: string;

  logo?: {
    src: string;
    width?: number; // ratio (<=1) or pixels (>1). default 0.2 (20%)
    excavate?: boolean; // clear modules underneath the logo area
    shape?: "square" | "rounded" | "circle";
    borderRadius?: string;
    background?: string; // background color behind logo; undefined = transparent
  };
}
```

#### Logo Example

```typescript
logo: {
  src: 'logo.png',
  width: 0.2, // 20% of QR size
  shape: 'circle',
  excavate: true,
  background: "#ffffff" // Ensure the logo is visibile
}
```

## Advanced Usage

- **Custom Encoding:** Use lower-level modules for manual control
- **Error Correction:** Fine-tune EC level for resilience
- **Mask Selection:** Specify mask pattern for visual optimization
- **Integration:** Embed QR output in web apps

## Development

If you want to build the library from the source:

1. Clone the repository

```
$ git clone https://github.com/mohammed-ali-osman/qrcode.git
```

or

```
$ git clone git@github.com:mohammed-ali-osman/qrcode.git
```

2. Build the project

```
$ deno task build
```

The compiled file will be generated in the `dist/` directory.

## Test

```
$ deno test
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE)
file for details.
