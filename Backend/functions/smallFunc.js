function validateEmail({ email }) {
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

function getDate() {
  let date = new Date();
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = String(date.getFullYear());

  let fullDate = `${day}-${month}-${year}`;

  return fullDate
}

module.exports = { validateEmail, encodeToBase64, decodeFromBase64, getDate }
