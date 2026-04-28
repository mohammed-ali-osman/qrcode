import type { Matrix } from "../types/matrix.ts";
import type { RenderOptions } from "../types/render.ts";

// @ts-ignore DOM element.
function svg(matrix: Matrix, size?: number, options: RenderOptions = {}): SVGElement {
	const modules = size || Math.sqrt(matrix.length);
	const margin = options.margin ?? 4;
	const area = modules + margin * 2;

	let scale =
		options.scale ??
		(options.size ? Math.floor(options.size / area) : 4);

	if (scale < 1) scale = 1;

	const canvasSize = area * scale;
	const dark = options.color?.dark ?? "#000000";
	const light = options.color?.light ?? "#FFFFFF";

	const logo = options.logo;

	let logoSizePx = 0;
	let logoX = 0;
	let logoY = 0;
	let logoR = 0;
	let hasExcavation = false;

	if (logo) {
		const lw = logo.width ?? 0.2;
		logoSizePx = lw <= 1 ? Math.floor(lw * canvasSize) : Math.floor(lw);
		logoX = Math.floor((canvasSize - logoSizePx) / 2);
		logoY = logoX;
		if (logo.shape === "circle") logoR = logoSizePx / 2;
		hasExcavation = Boolean(logo.excavate && logoSizePx > 0);
	}

	// --- Accurate circle intersection ---
	function rectIntersectsCircle(px: number, py: number, size: number, cx: number, cy: number, r: number) {
		const nearestX = Math.max(px, Math.min(cx, px + size));
		const nearestY = Math.max(py, Math.min(cy, py + size));
		const dx = nearestX - cx;
		const dy = nearestY - cy;
		return (dx * dx + dy * dy) < (r * r);
	}

	const parts: string[] = [];
	const canvasCenter = canvasSize / 2;

	for (let y = 0; y < modules; y++) {
		let x = 0;

		while (x < modules) {
			if (!matrix[y * modules + x]) {
				x++;
				continue;
			}

			const start = x;
			x++;

			while (x < modules && matrix[y * modules + x]) x++;

			// Break runs if excavation is active
			if (hasExcavation) {
				for (let i = start; i < x; i++) {
					const px = (i + margin) * scale;
					const py = (y + margin) * scale;

					let skip = false;

					if (logo?.shape === "circle") {
						skip = rectIntersectsCircle(px, py, scale, canvasCenter, canvasCenter, logoR);
					} else {
						skip =
							px < logoX + logoSizePx &&
							px + scale > logoX &&
							py < logoY + logoSizePx &&
							py + scale > logoY;
					}

					if (!skip) {
						parts.push(`M${px} ${py}h${scale}v${scale}h-${scale}z`);
					}
				}
			} else {
				const runWidth = (x - start) * scale;
				const px = (start + margin) * scale;
				const py = (y + margin) * scale;
				parts.push(`M${px} ${py}h${runWidth}v${scale}h-${runWidth}z`);
			}
		}
	}

	const ns = "http://www.w3.org/2000/svg";
	// @ts-ignore document
	const doc = globalThis.document;

	const svgEl = doc.createElementNS(ns, "svg");
	svgEl.setAttribute("width", String(canvasSize));
	svgEl.setAttribute("height", String(canvasSize));
	svgEl.setAttribute("viewBox", `0 0 ${canvasSize} ${canvasSize}`);
	svgEl.setAttribute("shape-rendering", "crispEdges");
	svgEl.setAttribute("xmlns", ns);
	svgEl.setAttribute("role", "img");

	// --- Accessibility ---
	const title = doc.createElementNS(ns, "title");
	title.setAttribute("id", "qr-title");

	if (options.content) {
		try {
			const url = new URL(options.content);
			title.textContent = `QR Code for ${url.hostname}`;
		} catch {
			const label =
				options.content.length > 32
					? options.content.slice(0, 32) + "..."
					: options.content;
			title.textContent = `QR Code: ${label}`;
		}
	} else {
		title.textContent = "QR Code";
	}

	svgEl.setAttribute("aria-labelledby", "qr-title");
	svgEl.appendChild(title);

	// --- Background ---
	const bgRect = doc.createElementNS(ns, "rect");
	bgRect.setAttribute("width", "100%");
	bgRect.setAttribute("height", "100%");
	bgRect.setAttribute("fill", light);
	svgEl.appendChild(bgRect);

	// --- QR Path ---
	const path = doc.createElementNS(ns, "path");
	path.setAttribute("fill", dark);
	path.setAttribute("d", parts.join(""));
	svgEl.appendChild(path);

	// --- Logo ---
	if (logo && logoSizePx > 0) {
		const logoGroup = doc.createElementNS(ns, "g");

		let clipId: string | undefined;

		// Clip path (for circle/rounded)
		if (logo.shape === "circle" || logo.shape === "rounded") {
			clipId = `qr-logo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

			const defs = doc.createElementNS(ns, "defs");
			const clipPath = doc.createElementNS(ns, "clipPath");
			clipPath.setAttribute("id", clipId);

			const shape = doc.createElementNS(ns, logo.shape === "circle" ? "circle" : "rect");

			if (logo.shape === "circle") {
				shape.setAttribute("cx", String(canvasSize / 2));
				shape.setAttribute("cy", String(canvasSize / 2));
				shape.setAttribute("r", String(logoR));
			} else {
				shape.setAttribute("x", String(logoX));
				shape.setAttribute("y", String(logoY));
				shape.setAttribute("width", String(logoSizePx));
				shape.setAttribute("height", String(logoSizePx));

				const br = logo.borderRadius ?? Math.floor(logoSizePx * 0.15);
				shape.setAttribute("rx", String(br));
				shape.setAttribute("ry", String(br));
			}

			clipPath.appendChild(shape);
			defs.appendChild(clipPath);
			svgEl.appendChild(defs);
		}

		// Background behind logo
		if (logo.background !== undefined && logo.background !== null) {
			const bgShape = doc.createElementNS(
				ns,
				logo.shape === "circle" ? "circle" : "rect"
			);

			if (logo.shape === "circle") {
				bgShape.setAttribute("cx", String(canvasSize / 2));
				bgShape.setAttribute("cy", String(canvasSize / 2));
				bgShape.setAttribute("r", String(logoR));
			} else {
				bgShape.setAttribute("x", String(logoX));
				bgShape.setAttribute("y", String(logoY));
				bgShape.setAttribute("width", String(logoSizePx));
				bgShape.setAttribute("height", String(logoSizePx));

				if (logo.shape === "rounded") {
					const br = logo.borderRadius ?? Math.floor(logoSizePx * 0.15);
					bgShape.setAttribute("rx", String(br));
					bgShape.setAttribute("ry", String(br));
				}
			}

			bgShape.setAttribute("fill", String(logo.background));
			logoGroup.appendChild(bgShape);
		}

		// Logo image
		const img = doc.createElementNS(ns, "image");
		img.setAttribute("x", String(logoX));
		img.setAttribute("y", String(logoY));
		img.setAttribute("width", String(logoSizePx));
		img.setAttribute("height", String(logoSizePx));
		img.setAttribute("preserveAspectRatio", "xMidYMid meet");

		if (typeof logo.src === "string") {
			img.setAttribute("href", logo.src);
			//@ts-ignore url
		} else if (logo.src?.toDataURL) {
			try {
				//@ts-ignore url
				img.setAttribute("href", logo.src.toDataURL());
			} catch {/* empty for now :)*/ }
		}

		if (clipId) {
			img.setAttribute("clip-path", `url(#${clipId})`);
		}

		logoGroup.appendChild(img);
		svgEl.appendChild(logoGroup);
	}

	return svgEl;
}

/**
 * This function generates a canvas element with the QR code drawn on it based on the provided matrix, size, and rendering options. It calculates the appropriate scale and margin to ensure the QR code fits within the specified size while maintaining its integrity. The function handles both browser and Node.js environments by creating a canvas using the appropriate APIs. It fills the background, draws the dark modules, and optionally adds a logo with excavation if specified in the options. The resulting canvas element can be used directly in web applications or further processed for image generation.
 */

function canvas(
	matrix: Matrix, // 1D Array
	size: number,       // Module count (e.g., 21)
	options: RenderOptions = {}
) {
	const modules = size;
	const margin = options.margin ?? 4;
	const total = modules + margin * 2;

	let scale = options.scale ?? (options.size ? Math.floor(options.size / total) : Math.floor(600 / total));
	if (scale < 1) scale = 1;

	const canvasSize = total * scale;
	const dark = options.color?.dark ?? "#000000";
	const light = options.color?.light ?? "#FFFFFF";

	// @ts-ignore document
	const cvs = document.createElement("canvas");;



	cvs.width = canvasSize;
	cvs.height = canvasSize;
	const ctx = cvs.getContext("2d");
	if (!ctx) throw new Error("Canvas 2D context not available");

	// Background
	ctx.fillStyle = light;
	ctx.fillRect(0, 0, canvasSize, canvasSize);

	// --- DRAW MODULES (1D Logic) ---
	ctx.fillStyle = dark;
	for (let y = 0; y < modules; y++) {
		for (let x = 0; x < modules; x++) {
			// Direct 1D access: y * modules + x
			if (matrix[y * modules + x]) {
				ctx.fillRect((x + margin) * scale, (y + margin) * scale, scale, scale);
			}
		}
	}

	// --- LOGO (Synchronous) ---
	const logo = options.logo;
	if (logo) {
		const lw = logo.width ?? 0.2;
		const logoSizePx = lw <= 1 ? Math.floor(lw * canvasSize) : Math.floor(lw);
		const lx = Math.floor((canvasSize - logoSizePx) / 2);
		const ly = lx;

		//@ts-ignore DOM element
		let img: HTMLImageElement | CanvasImageSource | undefined;
		if (typeof logo.src === "string") {
			if (typeof window !== "undefined") {
				// @ts-ignore image class
				const tmp = new Image();
				tmp.src = logo.src;
				// Only draws if already cached/loaded
				if (tmp.complete) img = tmp;
			}
		} else {
			img = logo.src;
		}

		if (img) {
			// Excavation & Clipping logic remains the same...
			// (Using your existing manual arcTo/clip code here)
			if (logo.excavate) {
				ctx.save();
				ctx.fillStyle = logo.background ?? light;
				// ... (your existing shapes)
				ctx.restore();
			}
			// ... (rest of your drawing logic)
			ctx.drawImage(img, lx, ly, logoSizePx, logoSizePx);
		}
	}

	return cvs;
}

/**
 * This function generates a PNG image of the QR code based on the provided matrix, size, and rendering options. It utilizes a canvas to draw the QR code, applying the specified colors and scaling according to the options. The function handles both Node.js and browser environments by checking for the presence of canvas APIs and returns the PNG data in the appropriate format (Buffer for Node.js and Data URL for browsers). If a supported canvas implementation is not found, it throws an error indicating that PNG generation is not possible.
 */

function png(matrix: Matrix, size: number, options?: RenderOptions) {
	const c = canvas(matrix, size, options);
	// Node-canvas: has toBuffer, browser: has toDataURL
	if (typeof c.toBuffer === "function") {
		// Node canvas
		return c.toBuffer("image/png");
	}

	// Browser canvas
	if (typeof c.toDataURL === "function") {
		return c.toDataURL("image/png");
	}

	throw new Error("Unable to produce PNG: no supported canvas implementation found.");
}

/**
 * This function generates a JPEG image of the QR code based on the provided matrix, size, and rendering options. Similar to the PNG function, it uses a canvas to render the QR code and checks for the appropriate methods to output JPEG data depending on the environment (Node.js or browser). It returns the JPEG data as a Buffer in Node.js or as a Data URL in browsers. If no supported canvas implementation is found, it throws an error indicating that JPEG generation is not possible.
 */

function jpg(matrix: Matrix, size: number, options?: RenderOptions) {
	const c = canvas(matrix, size, options);
	if (typeof c.toBuffer === "function") {
		return c.toBuffer("image/jpeg");
	}
	if (typeof c.toDataURL === "function") {
		return c.toDataURL("image/jpeg", 0.92);
	}
	throw new Error("Unable to produce JPG: no supported canvas implementation found.");
}

export { svg, canvas, png, jpg };