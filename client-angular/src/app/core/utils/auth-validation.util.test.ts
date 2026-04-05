import { describe, expect, it } from 'vitest';
import {
  canLoginSubmit,
  canSignupSubmit,
  isOtpCode,
  isStrongPassword,
  isValidEmail,
  normalizeEmail,
  normalizeName,
} from './auth-validation.util';

describe('normalizeEmail', () => {
  it('removes leading spaces', () => expect(normalizeEmail('  user@mail.com')).toBe('user@mail.com'));
  it('removes trailing spaces', () => expect(normalizeEmail('user@mail.com   ')).toBe('user@mail.com'));
  it('lowercases uppercase characters', () => expect(normalizeEmail('USER@MAIL.COM')).toBe('user@mail.com'));
  it('handles mixed casing', () => expect(normalizeEmail('UsEr@MaIl.CoM')).toBe('user@mail.com'));
  it('keeps valid symbols', () => expect(normalizeEmail('User.Name+tag@MAIL.com')).toBe('user.name+tag@mail.com'));
});

describe('normalizeName', () => {
  it('trims leading spaces', () => expect(normalizeName('  Guilherme')).toBe('Guilherme'));
  it('trims trailing spaces', () => expect(normalizeName('Guilherme   ')).toBe('Guilherme'));
  it('collapses multiple internal spaces', () => expect(normalizeName('Gui   Silva')).toBe('Gui Silva'));
  it('keeps accents and letters', () => expect(normalizeName(' João   da   Silva ')).toBe('João da Silva'));
  it('returns empty for whitespace-only strings', () => expect(normalizeName('   ')).toBe(''));
});

describe('isValidEmail', () => {
  it('accepts standard email', () => expect(isValidEmail('user@mail.com')).toBe(true));
  it('accepts plus alias email', () => expect(isValidEmail('user+tag@mail.com')).toBe(true));
  it('accepts dotted local part', () => expect(isValidEmail('first.last@mail.com')).toBe(true));
  it('rejects missing domain', () => expect(isValidEmail('user@')).toBe(false));
  it('rejects missing local part', () => expect(isValidEmail('@mail.com')).toBe(false));
  it('rejects spaces in email', () => expect(isValidEmail('user @mail.com')).toBe(false));
  it('rejects missing dot in domain', () => expect(isValidEmail('user@mail')).toBe(false));
});

describe('isStrongPassword', () => {
  it('accepts password with upper/lower/number and 8 chars', () => expect(isStrongPassword('Abcdef12')).toBe(true));
  it('accepts longer complex password', () => expect(isStrongPassword('ReactRack2026')).toBe(true));
  it('rejects password shorter than 8 chars', () => expect(isStrongPassword('Abc123')).toBe(false));
  it('rejects password without uppercase', () => expect(isStrongPassword('abcdef12')).toBe(false));
  it('rejects password without lowercase', () => expect(isStrongPassword('ABCDEF12')).toBe(false));
  it('rejects password without numbers', () => expect(isStrongPassword('Abcdefgh')).toBe(false));
  it('rejects empty password', () => expect(isStrongPassword('')).toBe(false));
});

describe('isOtpCode', () => {
  it('accepts exactly six digits', () => expect(isOtpCode('123456')).toBe(true));
  it('accepts six digits with trimming', () => expect(isOtpCode(' 123456 ')).toBe(true));
  it('rejects less than six digits', () => expect(isOtpCode('12345')).toBe(false));
  it('rejects more than six digits', () => expect(isOtpCode('1234567')).toBe(false));
  it('rejects non-digit characters', () => expect(isOtpCode('12a456')).toBe(false));
});

describe('canLoginSubmit', () => {
  it('allows valid email and non-empty password', () => expect(canLoginSubmit('user@mail.com', 'pass')).toBe(true));
  it('rejects invalid email', () => expect(canLoginSubmit('user@mail', 'pass')).toBe(false));
  it('rejects empty password', () => expect(canLoginSubmit('user@mail.com', '   ')).toBe(false));
});

describe('canSignupSubmit', () => {
  it('allows valid signup payload', () =>
    expect(canSignupSubmit('Gui Silva', 'gui@reactrack.dev', 'Abcdef12', 'Abcdef12')).toBe(true));
  it('rejects when passwords do not match', () =>
    expect(canSignupSubmit('Gui Silva', 'gui@reactrack.dev', 'Abcdef12', 'Abcdef13')).toBe(false));
  it('rejects weak passwords even with valid name/email', () =>
    expect(canSignupSubmit('Gui Silva', 'gui@reactrack.dev', 'abcdef12', 'abcdef12')).toBe(false));
});
