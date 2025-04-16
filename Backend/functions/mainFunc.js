const { db } = require("./firebaseconfig");
const { Verify_Key } = require("./JWT_Keys");
const { encodeToBase64 } = require("./smallFunc");

async function getUserData({ authToken }) {

  try {
    let user = await Verify_Key(authToken);
    let encodedUID = encodeToBase64(user.payload.uid);
    const userRef = db.ref(`${encodedUID}`);

    let snapshots = await userRef.once('value');
    let data = snapshots.val();

    if (!snapshots.exists())  {
      return {status:404}
    }

    return { data: data, status: 201 }

  } catch (error) {
    return { status: 409 }
  }


}

module.exports = { getUserData }