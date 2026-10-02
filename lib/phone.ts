// International numbers: optional leading +, then digits with common
// separators, 7 to 15 digits in total (the E.164 maximum).
export function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return /^\+?[\d\s().-]+$/.test(phone.trim()) && digits.length >= 7 && digits.length <= 15;
}

// wa.me links need the number in international form with no symbols.
// Numbers typed without a country code are assumed to be Indian (10 digits).
export function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return !phone.trim().startsWith("+") && digits.length === 10 ? `91${digits}` : digits;
}
