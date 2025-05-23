const { db } = require("./firebaseconfig");
const { Verify_Key } = require("./JWT_Keys");
const { encodeToBase64, getDate } = require("./smallFunc");

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

    } else if (!snapshots.exists()) {
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
      return { status: 404 };
    } else {
      return { status: 201, data: snapshots.val() }
    }

  } catch (error) {
    console.log('There was an error', error)
    return { status: 409 }
  }
}

async function deleteDraft({ index, authToken }) {
  try {
    let user = await Verify_Key(authToken);
    let encodedUID = encodeToBase64(user.payload.uid);
    const userRef = db.ref(`${encodedUID}/drafts`);
    let snapshots = await userRef.once('value');
    let data = snapshots.val();

    let newData = data.filter((value, Index) => Index !== index);


    await userRef.set(newData);
    return { status: 201 };

  } catch (error) {
    return { status: 404 };
  }
}

async function updateDraft({ index, blogData, authToken }) {
  try {
    let user = await Verify_Key(authToken);
    let encodedUID = encodeToBase64(user.payload.uid);
    const userRef = db.ref(`${encodedUID}/drafts`);
    let snapshots = await userRef.once('value');
    let data = snapshots.val();

    data[index].descHTML = blogData.descHTML;
    data[index].title = blogData.title;

    userRef.set(data);
    return { status: 201 };

  } catch (error) {
    return { status: 404 };
  }
}

async function uploadBlog({ blogData, authToken }) {
  let user = await Verify_Key(authToken);
  let encodedUID = encodeToBase64(user.payload.uid);

  let ref = db.ref(`${encodedUID}/profile`);
  await ref.once('value').then((snapshots) => blogData.Author = snapshots.val().Username);
  try {
    blogData.date = getDate();

    const publicRef = db.ref('Blogs');
    const userRef = db.ref(`${encodedUID}/Blogs`);

    let newPublicRef = publicRef.push();
    let newUserRef = userRef.child(newPublicRef.key);

    await newPublicRef.set(blogData);
    await newUserRef.set(blogData);
    
    return {status:201, index:newPublicRef.key}

  } catch (error) {
    console.log('there was an error', error)
  }

}


module.exports = { saveDraft, getDrafts, deleteDraft, updateDraft, uploadBlog }