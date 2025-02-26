const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vercity-763d4-default-rtdb.firebaseio.com"
  });
}

const db = admin.database();
console.log("✅ Firebase Initialized");

module.exports = { db, admin};
