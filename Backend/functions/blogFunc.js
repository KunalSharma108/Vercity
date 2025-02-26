const { db } = require("./firebaseconfig");
const { Verify_Key } = require("./JWT_Keys");
const { encodeToBase64 } = require("./smallFunc");

async function draft({ draftBlogContent, authToken }) {
  let user = await Verify_Key(authToken);
  let encodedUID = encodeToBase64(user.payload.uid);
  const userRef = db.ref(`${encodedUID}/profile`);

  try {
    let snapshots = await userRef.once('value');

    if (snapshots.exists()) {
      let snapData = snapshots.val();
      const exists = snapData.some(item => item.descHTML === draftBlogContent.descHTML && item.title === draftBlogContent.title);

      if (exists) {
        console.log(`Draft rejected of user "${encodedUID}" due to being duplicate`);
        return { status: 409 };
      }

      snapData.push(draftBlogContent);
      await userRef.set(snapData);
      return { status: 201 };
    } else {
      await userRef.set([draftBlogContent]);
      return { status: 201 };
    }
  } catch (error) {
    console.error("Error updating draft:", error);
    return { status: 500 };
  }
}


module.exports = { draft }