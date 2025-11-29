const { isValidEmail, isValidPassword } = require('../src/util/validators');

describe('validators', () => {
    test('isValidEmail accepts valid emails and rejects invalid ones', () => {
        expect(isValidEmail('user@example.com')).toBe(true);
        expect(isValidEmail(' user@example.com ')).toBe(true);
        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidEmail('')).toBe(false);
        expect(isValidEmail(null)).toBe(false);
    });

    test('isValidPassword enforces length and mixed content', () => {
        expect(isValidPassword('abc123')).toBe(true);
        expect(isValidPassword('abcdef')).toBe(false); // no number
        expect(isValidPassword('123456')).toBe(false); // no letter
        expect(isValidPassword('a1')).toBe(false); // too short
        expect(isValidPassword(null)).toBe(false);
    });
});
