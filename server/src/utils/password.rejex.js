function validatePassword(password) {
  const minLength = 8;
  const commonPasswords = ["123456", "password", "123456789", "qwerty"];

  if (typeof password !== "string") {
    throw new Error("Password must be a string.");
  }

  if (password.length < minLength) {
    throw new Error(`Password must be at least ${minLength} characters long.`);
  }

  if (commonPasswords.includes(password.toLowerCase())) {
    throw new Error("This password is too common.");
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    throw new Error("Password must contain at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    throw new Error("Password must contain at least one number.");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error("Password must contain at least one special character.");
  }

  return true;
}

module.exports = validatePassword;
