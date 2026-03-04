# QR code TypeScript Library

A high-performance, fully customizable TypeScript library for generating QR
codes. Designed for browser and Node.js environments, this library supports all
QR code standards, advanced rendering, and flexible integration.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Rendering Options](#rendering-options)
- [Advanced Usage](#advanced-usage)
- [Wiki](./../../wiki)
- [License](#license)

---

## Features

- **Full QR Code Support:** Numeric, Alphanumeric, Byte, Kanji modes
- **Error Correction:** Levels L, M, Q, H
- **Version Control:** QR versions 1–40
- **Flexible Rendering:** SVG, Canvas, PNG, JPG outputs
- **Logo Overlay:** Custom logo with excavation and shape options
- **Color Customization:** Module and background colors
- **No Dependencies:** Pure TypeScript implementation
- **Modular Design:** Use high-level or low-level APIs

---

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

---

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

- `build()`: Generates the QR code matrix
- `render()`: Renders the QR code as SVG/Canvas/PNG/JPG (Return element if it's
  svg/canvas else png/jpg returns Base64)

#### Example

```typescript
const qr = new QRcode("Data", { render: { type: "png" } });
qr.build();
const pngData = qr.render();
```

---

## Rendering Options

See `src/types/render.d.ts` for full details. Key fields:

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

  rounded?: boolean;

  logo?: {
    src: string;
    width?: number; // ratio (<=1) or pixels (>1). default 0.2 (20%)
    excavate?: boolean; // clear modules underneath the logo area
    shape?: "square" | "rounded" | "circle";
    borderRadius?: boolean;
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
  excavate: true
}
```

---

## Advanced Usage

- **Custom Encoding:** Use lower-level modules for manual control
- **Error Correction:** Fine-tune EC level for resilience
- **Mask Selection:** Specify mask pattern for visual optimization
- **Integration:** Embed QR output in web apps, Node.js, or export as image

---

## License

MIT License
