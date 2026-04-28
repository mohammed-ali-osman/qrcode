/**
 * This module defines the RenderOptions interface, which specifies the various options that can be used when rendering a QR code. The options include size, scale, margin, color settings for dark and light modules, output type (SVG, canvas, PNG, or JPEG), rounded corners, and logo settings such as source, width, excavation, shape, border radius, and background color. These options allow for customization of the QR code's appearance when generating it in different formats.
 */

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
    borderRadius?: number;
    background?: string; // background color behind logo; undefined = transparent
  };
}

export type { RenderOptions };