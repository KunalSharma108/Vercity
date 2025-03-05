const { db } = require("./firebaseconfig");
const { Verify_Key } = require("./JWT_Keys");
const { encodeToBase64 } = require("./smallFunc");

async function saveDraft({ draftBlogContent, authToken }) {
  let user = await Verify_Key(authToken);
  let encodedUID = encodeToBase64(user.payload.uid);
  const userRef = db.ref(`${encodedUID}/drafts`);

  try {
    let snapshots = await userRef.once('value');

    if (snapshots.exists()) {
      let snapData = Object.values(snapshots.val());
      let duplicateIndex = snapData.findIndex(item =>
        item.descHTML === draftBlogContent.descHTML &&
        item.title === draftBlogContent.title
      );

      if (duplicateIndex !== -1) {
        console.log(`Draft rejected of user "${encodedUID}" due to being duplicate ${duplicateIndex}`);
        return { status: 409 };
      }

      snapData.push(draftBlogContent);
      const index = snapData.length - 1
      await userRef.set(snapData);
      return { status: 201, index: index };
    } else {
      await userRef.set([draftBlogContent]);
      return { status: 201, index: 0 };
    }
  } catch (error) {
    console.error("Error updating draft:", error);
    return { status: 500 };
  }
}

async function getDrafts({ authToken }) {
  try {
    let user = await Verify_Key(authToken);
    let encodedUID = encodeToBase64(user.payload.uid);
    const userRef = db.ref(`${encodedUID}/drafts`);
    let snapshots = await userRef.once('value');

    if (!snapshots.exists()) {
      return { status: 409 }
    } else {
      return { status: 201, data: snapshots.val() }
    }

  } catch (error) {
    console.log('There was an error', error)
    return { status: 404 }
  }
}


module.exports = { saveDraft, getDrafts }