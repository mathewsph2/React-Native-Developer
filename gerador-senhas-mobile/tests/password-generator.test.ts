import { describe, expect, it } from "vitest";

import { createPassword, getStrength, type PasswordOptions } from "../lib/password-generator";

const allOptions: PasswordOptions = {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
};

describe("password-generator", () => {
  it("creates a password with the requested length", () => {
    const password = createPassword(16, allOptions, () => 0);
    expect(password).toHaveLength(16);
    expect(password).toBe("A".repeat(16));
  });

  it("uses only the selected character set", () => {
    const password = createPassword(12, {
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
    }, () => 0.5);
    expect(password).toMatch(/^[0-9]+$/);
  });

  it("classifies a long password with all categories as strong", () => {
    expect(getStrength("A_secure_123456", allOptions).label).toBe("Forte");
  });

  it("does not generate when every category is disabled", () => {
    expect(createPassword(12, {
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
    })).toBe("");
  });
});
