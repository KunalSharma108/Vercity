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

    if (!snapshots.exists()) {
      return { status: 404 }
    }

    return { data: data, status: 201 }

  } catch (error) {
    return { status: 409 }
  }
}


async function getBlogs({ ID, authToken }) {
  const blogsRef = db.ref('Blogs');
  if (ID === false) {
    try {
      const snapshots = await blogsRef.orderByKey().limitToFirst(10).once('value');
      if (snapshots.exists()) {
        return { status: 201, data: snapshots.val() }
      }
    } catch (error) {
      return { status: 409, data: 'There was an unexpected error' }
    }
  } else if (typeof ID === "number") {
    const snapshots = await blogsRef.orderByChild('Index').startAfter(ID).limitToFirst(10).once('value');
    if (snapshots.exists()) {
      let user = await Verify_Key(authToken);
      let encodedUID = encodeToBase64(user.payload.uid);
      const userRef = db.ref(`${encodedUID}/profile`);

      await userRef.set({lastSeenIndex: ID});
      return { status: 201, data: snapshots.val() }
    } else {
      return { status: 404, data: 'No more blogs' }
    }
  }
}
module.exports = { getUserData, getBlogs }
