function validateEmail({email}) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (regex.test(email)) {
    return { valid: true, message: "Valid email address." };
  } else {
    return { valid: false, message: "Invalid email address." };
  }
}

function encodeToBase64(uid) {
  return Buffer.from(uid).toString('base64');
}

function decodeFromBase64(encodedUID) {
  return Buffer.from(encodedUID, 'base64').toString('utf-8');
}


module.exports = { validateEmail, encodeToBase64, decodeFromBase64 }