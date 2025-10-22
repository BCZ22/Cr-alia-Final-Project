import { generateAffiliateCode } from "../lib/affiliate";

describe("generateAffiliateCode", () => {
  it("returns code with prefix CREALIA-", () => {
    const code = generateAffiliateCode();
    expect(code).toMatch(/^CREALIA-[A-Z0-9]{6}$/);
  });

  it("generates unique codes on multiple calls", () => {
    const codes = new Set();
    for (let i = 0; i < 100; i++) {
      codes.add(generateAffiliateCode());
    }
    expect(codes.size).toBe(100);
  });
});

