export const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%&*?+-_",
} as const;

export type OptionKey = keyof typeof CHARSETS;
export type PasswordOptions = Record<OptionKey, boolean>;

export function createPassword(length: number, options: PasswordOptions, random = Math.random) {
  const enabled = (Object.keys(CHARSETS) as OptionKey[]).filter((key) => options[key]);
  const alphabet = enabled.map((key) => CHARSETS[key]).join("");

  if (!alphabet) return "";

  let result = "";
  for (let index = 0; index < length; index += 1) {
    result += alphabet[Math.floor(random() * alphabet.length)];
  }
  return result;
}

export function getStrength(password: string, options: PasswordOptions) {
  if (!password) return { label: "Selecione uma opção", color: "#94A3B8", percent: 0 };

  let score = 0;
  if (password.length >= 10) score += 1;
  if (password.length >= 16) score += 1;
  if (options.uppercase) score += 1;
  if (options.lowercase) score += 1;
  if (options.numbers) score += 1;
  if (options.symbols) score += 1;

  if (score >= 5) return { label: "Forte", color: "#34D399", percent: 100 };
  if (score >= 3) return { label: "Média", color: "#FBBF24", percent: 62 };
  return { label: "Fraca", color: "#FB7185", percent: 32 };
}
