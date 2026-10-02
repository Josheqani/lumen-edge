import { describe, expect, it } from "bun:test";
import { bytesToUuid, createVlessResponseHeader, parseVlessHeader } from "../src/core/vless";

describe("VLESS Parser", () => {
  it("should convert bytes to UUID correctly", () => {
    // 00112233-4455-6677-8899-aabbccddeeff
    const bytes = new Uint8Array([
      0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
      0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff,
    ]);
    const uuid = bytesToUuid(bytes);
    expect(uuid).toBe("00112233-4455-6677-8899-aabbccddeeff");
  });

  it("should parse VLESS header with IPv4 destination", () => {
    const raw = [
      0x00, // version 0
      // UUID 16 bytes:
      0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
      0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
      0x00, // addons len 0
      0x01, // command 1 (TCP)
      0x01, 0xbb, // port 443 (0x01bb)
      0x01, // addressType 1 (IPv4)
      0x01, 0x01, 0x01, 0x01, // 1.1.1.1
      // payload:
      0x47, 0x45, 0x54, // 'GET'
    ];

    const parsed = parseVlessHeader(new Uint8Array(raw));
    expect(parsed).not.toBeNull();
    expect(parsed?.version).toBe(0);
    expect(parsed?.uuid).toBe("12345678-9abc-def0-1122-334455667788");
    expect(parsed?.command).toBe(1);
    expect(parsed?.port).toBe(443);
    expect(parsed?.addressType).toBe(1);
    expect(parsed?.address).toBe("1.1.1.1");
    expect(new TextDecoder().decode(parsed?.rawPayload)).toBe("GET");
  });

  it("should parse VLESS header with Domain destination", () => {
    const domain = "example.com";
    const domainBytes = new TextEncoder().encode(domain);

    const raw: number[] = [
      0x00, // version 0
      // UUID
      0xa1, 0xb2, 0xc3, 0xd4, 0xe5, 0xf6, 0x07, 0x18,
      0x29, 0x3a, 0x4b, 0x5c, 0x6d, 0x7e, 0x8f, 0x90,
      0x00, // addons len 0
      0x01, // command 1 (TCP)
      0x00, 0x50, // port 80
      0x02, // addressType 2 (Domain)
      domainBytes.length,
      ...domainBytes,
      0x01, 0x02, 0x03, // payload
    ];

    const parsed = parseVlessHeader(new Uint8Array(raw));
    expect(parsed).not.toBeNull();
    expect(parsed?.uuid).toBe("a1b2c3d4-e5f6-0718-293a-4b5c6d7e8f90");
    expect(parsed?.port).toBe(80);
    expect(parsed?.addressType).toBe(2);
    expect(parsed?.address).toBe("example.com");
    expect(parsed?.rawPayload.length).toBe(3);
  });

  it("should return null for malformed or short buffer", () => {
    expect(parseVlessHeader(new Uint8Array([0, 1, 2]))).toBeNull();
  });

  it("should create valid VLESS response header", () => {
    const res = createVlessResponseHeader();
    expect(res.length).toBe(2);
    expect(res[0]).toBe(0);
    expect(res[1]).toBe(0);
  });
});
