const { db } = require("./firebaseconfig");
const { Verify_Key } = require("./JWT_Keys");
const { encodeToBase64 } = require("./smallFunc");

async function getUserData({ authToken }) {
  let user = await Verify_Key(authToken);
  let encodedUID = encodeToBase64(user.payload.uid);
  const userRef = db.ref(`${encodedUID}`);

  let snapshots = await userRef.once('value');
  console.log(snapshots.val());
}

module.exports = { getUserData }