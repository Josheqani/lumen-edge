import { describe, expect, it } from "bun:test";
import { generateQrSvg } from "../src/panel/qrcode";

describe("QR Code Generator", () => {
  it("should generate valid SVG string for short text", () => {
    const svg = generateQrSvg("https://example.com");
    expect(svg).toContain("<svg");
    expect(svg).toContain("viewBox");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("<rect");
  });

  it("should generate valid SVG string for vless URL", () => {
    const vless = "vless://12345678-1234-1234-1234-123456789abc@104.16.1.1:443?security=tls&encryption=none&type=ws&host=worker.example.com&path=%2Fapi%2Fv1%2Fws&sni=worker.example.com#Alice";
    const svg = generateQrSvg(vless, 300);
    expect(svg).toContain('width="300"');
    expect(svg).toContain("<g fill=\"#000000\">");
  });
});
