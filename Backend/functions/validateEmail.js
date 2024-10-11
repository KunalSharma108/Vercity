function validateEmail({email}) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (regex.test(email)) {
    return { valid: true, message: "Valid email address." };
  } else {
    return { valid: false, message: "Invalid email address." };
  }
}

module.exports = { validateEmail }