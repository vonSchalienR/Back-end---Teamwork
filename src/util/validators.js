// Simple validators for email and password

function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    // basic email regex (not perfect but sufficient for server-side check)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

function isValidPassword(password) {
    if (!password || typeof password !== 'string') return false;
    // rules:
    // - at least 6 characters
    // - contains at least one letter
    // - contains at least one number
    const trimmed = password;
    if (trimmed.length < 6) return false;
    const hasLetter = /[A-Za-z]/.test(trimmed);
    const hasNumber = /[0-9]/.test(trimmed);
    return hasLetter && hasNumber;
}

module.exports = { isValidEmail, isValidPassword };
