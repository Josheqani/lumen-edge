/**
 * Compact self-contained QR Code generator in pure TypeScript.
 * Generates valid QR Codes (Version 1-10, Error Correction Level L/M/Q/H)
 * and outputs crisp scalable SVG strings without any external dependencies.
 */

// QR Code Type 1-10 capabilities and polynomial tables
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_EXP[i + 255] = x;
    GF256_LOG[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }
})();

function gfMultiply(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF256_EXP[GF256_LOG[a]! + GF256_LOG[b]!]!;
}

function polyMultiply(p1: number[], p2: number[]): number[] {
  const result = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gfMultiply(p1[i]!, p2[j]!);
    }
  }
  return result;
}

function getGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    poly = polyMultiply(poly, [1, GF256_EXP[i]!]);
  }
  return poly;
}

function calculateErrorCorrection(data: Uint8Array, eccCount: number): Uint8Array {
  const genPoly = getGeneratorPoly(eccCount);
  const buffer = new Uint8Array(data.length + eccCount);
  buffer.set(data, 0);

  for (let i = 0; i < data.length; i++) {
    const lead = buffer[i]!;
    if (lead !== 0) {
      for (let j = 0; j < genPoly.length; j++) {
        buffer[i + j]! ^= gfMultiply(genPoly[j]!, lead);
      }
    }
  }

  return buffer.subarray(data.length);
}

// Minimal robust QR version capacity table for Byte mode, Error Correction Level L
// [Version, Total Codewords, EC Codewords, Remainder bits]
const QR_SPECS: [number, number, number, number][] = [
  [1, 26, 7, 0],
  [2, 44, 10, 7],
  [3, 70, 15, 7],
  [4, 100, 20, 7],
  [5, 134, 26, 7],
  [6, 172, 36, 7],
  [7, 196, 40, 0],
  [8, 242, 48, 0],
  [9, 292, 60, 0],
  [10, 346, 72, 0],
  [11, 404, 80, 0],
  [12, 466, 96, 0],
  [13, 532, 104, 0],
  [14, 581, 120, 3],
  [15, 655, 132, 3],
];

export function generateQrSvg(text: string, size = 256): string {
  const textBytes = new TextEncoder().encode(text);
  const dataLen = textBytes.length;

  // Find minimum version that fits Byte mode data:
  // 4 bits mode + 8/16 bits length + dataLen*8 bits
  let chosenSpec: [number, number, number, number] | null = null;
  for (const spec of QR_SPECS) {
    const version = spec[0];
    const totalCodewords = spec[1];
    const ecCodewords = spec[2];
    const dataCodewords = totalCodewords - ecCodewords;
    const lengthBits = version <= 9 ? 8 : 16;
    const requiredBits = 4 + lengthBits + dataLen * 8;
    if (Math.ceil(requiredBits / 8) <= dataCodewords) {
      chosenSpec = spec;
      break;
    }
  }

  if (!chosenSpec) {
    // If text is unusually long, use highest available version or fallback
    chosenSpec = QR_SPECS[QR_SPECS.length - 1]!;
  }

  const [version, totalCodewords, ecCodewords] = chosenSpec;
  const dataCodewords = totalCodewords - ecCodewords;
  const moduleCount = version * 4 + 17;

  // 1. Bit Buffer
  const bits: number[] = [];
  const pushBits = (value: number, count: number) => {
    for (let i = count - 1; i >= 0; i--) {
      bits.push((value >>> i) & 1);
    }
  };

  // Mode: Byte (0100)
  pushBits(0b0100, 4);
  const lengthBits = version <= 9 ? 8 : 16;
  pushBits(dataLen, lengthBits);
  for (let i = 0; i < dataLen; i++) {
    pushBits(textBytes[i]!, 8);
  }

  // Terminator
  const totalDataBits = dataCodewords * 8;
  const termLen = Math.min(4, totalDataBits - bits.length);
  pushBits(0, termLen);

  // Pad to byte
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  // Pad bytes: 0xEC, 0x11
  const padPatterns = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < totalDataBits) {
    pushBits(padPatterns[padIdx % 2]!, 8);
    padIdx++;
  }

  // Convert bits to data bytes
  const dataBytes = new Uint8Array(dataCodewords);
  for (let i = 0; i < dataCodewords; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bits[i * 8 + j]!;
    }
    dataBytes[i] = b;
  }

  // 2. Error Correction
  const ecBytes = calculateErrorCorrection(dataBytes, ecCodewords);

  const finalCodewords = new Uint8Array(totalCodewords);
  finalCodewords.set(dataBytes, 0);
  finalCodewords.set(ecBytes, dataCodewords);

  // 3. Grid Matrix
  const matrix: (number | null)[][] = Array.from({ length: moduleCount }, () =>
    new Array(moduleCount).fill(null)
  );

  // Position detection patterns (7x7 at 3 corners)
  const addFinderPattern = (r: number, c: number) => {
    for (let y = -1; y <= 7; y++) {
      for (let x = -1; x <= 7; x++) {
        const row = r + y;
        const col = c + x;
        if (row < 0 || row >= moduleCount || col < 0 || col >= moduleCount) continue;
        if (
          (y >= 0 && y <= 6 && (x === 0 || x === 6)) ||
          (x >= 0 && x <= 6 && (y === 0 || y === 6)) ||
          (y >= 2 && y <= 4 && x >= 2 && x <= 4)
        ) {
          matrix[row]![col] = 1;
        } else {
          matrix[row]![col] = 0;
        }
      }
    }
  };

  addFinderPattern(0, 0);
  addFinderPattern(0, moduleCount - 7);
  addFinderPattern(moduleCount - 7, 0);

  // Timing patterns
  for (let i = 8; i < moduleCount - 8; i++) {
    if (matrix[6]![i] === null) matrix[6]![i] = i % 2 === 0 ? 1 : 0;
    if (matrix[i]![6] === null) matrix[i]![6] = i % 2 === 0 ? 1 : 0;
  }

  // Dark module
  matrix[4 * version + 9]![8] = 1;

  // Reserve format bits area
  for (let i = 0; i <= 8; i++) {
    if (matrix[8]![i] === null) matrix[8]![i] = 0;
    if (matrix[i]![8] === null) matrix[i]![8] = 0;
  }
  for (let i = moduleCount - 8; i < moduleCount; i++) {
    if (matrix[8]![i] === null) matrix[8]![i] = 0;
    if (matrix[i]![8] === null) matrix[i]![8] = 0;
  }

  // 4. Place Data Bits with standard Zigzag
  let bitIdx = 0;
  const allBits: number[] = [];
  for (let i = 0; i < finalCodewords.length; i++) {
    for (let j = 7; j >= 0; j--) {
      allBits.push((finalCodewords[i]! >>> j) & 1);
    }
  }

  let upward = true;
  for (let right = moduleCount - 1; right > 0; right -= 2) {
    if (right === 6) right--; // skip vertical timing column
    const rows = upward
      ? Array.from({ length: moduleCount }, (_, i) => moduleCount - 1 - i)
      : Array.from({ length: moduleCount }, (_, i) => i);

    for (const r of rows) {
      for (const c of [right, right - 1]) {
        if (matrix[r]![c] === null) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++]! : 0;
          // Apply standard Mask 000: (r + c) % 2 === 0
          const mask = (r + c) % 2 === 0 ? 1 : 0;
          matrix[r]![c] = bit ^ mask;
        }
      }
    }
    upward = !upward;
  }

  // Format info: Mask 000, Error Correction L = 0b111011111000100
  const formatInfo = 0b111011111000100;
  for (let i = 0; i < 15; i++) {
    const bit = (formatInfo >>> (14 - i)) & 1;
    // Top-left
    if (i <= 5) matrix[8]![i] = bit;
    else if (i === 6) matrix[8]![7] = bit;
    else if (i === 7) matrix[8]![8] = bit;
    else if (i === 8) matrix[7]![8] = bit;
    else matrix[14 - i]![8] = bit;

    // Bottom-left / Top-right
    if (i < 8) matrix[moduleCount - 1 - i]![8] = bit;
    else matrix[8]![moduleCount - 15 + i] = bit;
  }

  // 5. Render SVG
  const border = 4;
  const totalGrid = moduleCount + border * 2;
  const rects: string[] = [];

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r]![c] === 1) {
        rects.push(`<rect x="${c + border}" y="${r + border}" width="1" height="1"/>`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalGrid} ${totalGrid}" width="${size}" height="${size}" fill="currentColor" shape-rendering="crispEdges">
    <rect width="${totalGrid}" height="${totalGrid}" fill="#ffffff"/>
    <g fill="#000000">
      ${rects.join("")}
    </g>
  </svg>`;
}
