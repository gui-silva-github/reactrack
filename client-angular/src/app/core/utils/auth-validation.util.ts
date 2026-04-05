export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const normalizeName = (name: string): string => name.trim().replace(/\s+/g, ' ');

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));

export const isStrongPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

export const isOtpCode = (otp: string): boolean => /^[0-9]{6}$/.test(otp.trim());

export const canLoginSubmit = (email: string, password: string): boolean =>
  isValidEmail(email) && password.trim().length > 0;

export const canSignupSubmit = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): boolean =>
  normalizeName(name).length >= 3 &&
  isValidEmail(email) &&
  isStrongPassword(password) &&
  password === confirmPassword;
