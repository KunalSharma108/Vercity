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
      } else if (!snapshots.exists()) {
        return { status: 404, data: 'not found' }
      }
    } catch (error) {
      return { status: 409, data: 'There was an unexpected error' }
    }
  } else {
    const snapshots = await blogsRef.orderByKey().startAfter(ID).limitToFirst(10).once('value');
    if (snapshots.exists()) {
      if (authToken) {
        let user = await Verify_Key(authToken);
        let encodedUID = encodeToBase64(user.payload.uid);
        const userRef = db.ref(`${encodedUID}/profile`);

        await userRef.update({ lastSeenIndex: ID });
        return { status: 201, data: snapshots.val() }
      } else {
        return { status: 201, data: snapshots.val() }
      }
    } else {
      return { status: 404, data: 'No more blogs' }
    }
  }
}

async function fetchBlog({ key }) {
  const blogRef = db.ref('Blogs');
  const snapshots = await blogRef.orderByKey().equalTo(key).once('value');
  if (snapshots.exists()) {
    return { status: 201, data: snapshots.val() }
  } else {
    return { status: 404, data: 'not found' };
  }
}

async function addLike({ key, authToken }) {
  let user = await Verify_Key(authToken);
  let encodedUID = encodeToBase64(user.payload.uid);
  const blogRef = db.ref('Blogs');
  const snapshots = await blogRef.orderByKey().equalTo(key).once('value');

  if (snapshots.exists()) {
    let blogContent = snapshots.val();
    let Key = Object.keys(blogContent)[0];
    let newBlogContent = Object.values(blogContent)[0];

    if (!Array.isArray(newBlogContent.usersLiked)) newBlogContent.usersLiked = [];
    if (Array.isArray(newBlogContent.usersDisliked)) {
      newBlogContent.usersDisliked = newBlogContent.usersDisliked.filter(uid => uid !== encodedUID);
    }

    if (!newBlogContent.usersLiked.includes(encodedUID)) {
      newBlogContent.usersLiked.push(encodedUID);
    } else {
      return { status: 409, message: "User already liked" };
    }

    if (newBlogContent.usersDisliked.length === 0) newBlogContent.usersDisliked = false;
    if (newBlogContent.usersLiked.length === 0) newBlogContent.usersLiked = false;

    await blogRef.child(Key).update(newBlogContent);
    return { status: 201, message: "Like added" };
  } else {
    return { status: 404 };
  }
}

async function addDislike({ key, authToken }) {
  let user = await Verify_Key(authToken);
  let encodedUID = encodeToBase64(user.payload.uid);
  const blogRef = db.ref('Blogs');
  const snapshots = await blogRef.orderByKey().equalTo(key).once('value');

  if (snapshots.exists()) {
    let blogContent = snapshots.val();
    let Key = Object.keys(blogContent)[0];
    let newBlogContent = Object.values(blogContent)[0];

    if (Array.isArray(newBlogContent.usersLiked)) {
      newBlogContent.usersLiked = newBlogContent.usersLiked.filter(uid => uid !== encodedUID);
    }
    if (!Array.isArray(newBlogContent.usersDisliked)) newBlogContent.usersDisliked = [];

    if (!newBlogContent.usersDisliked.includes(encodedUID)) {
      newBlogContent.usersDisliked.push(encodedUID);
    } else {
      return { status: 409, message: "User already disliked" };
    }

    if (newBlogContent.usersDisliked.length === 0) newBlogContent.usersDisliked = false;
    if (newBlogContent.usersLiked.length === 0) newBlogContent.usersLiked = false;

    await blogRef.child(Key).update(newBlogContent);
    return { status: 201, message: "Dislike added" };
  } else {
    return { status: 404 };
  }
}

async function removeLike({ key, authToken }) {
  let user = await Verify_Key(authToken);
  let encodedUID = encodeToBase64(user.payload.uid);
  const blogRef = db.ref('Blogs');
  const snapshots = await blogRef.orderByKey().equalTo(key).once('value');

  if (snapshots.exists()) {
    let blogContent = snapshots.val();
    let Key = Object.keys(blogContent)[0];
    let newBlogContent = Object.values(blogContent)[0];

    newBlogContent.usersLiked = newBlogContent.usersLiked.filter(uid => uid !== encodedUID);
    if (newBlogContent.usersLiked.length === 0) newBlogContent.usersLiked = false;

    await blogRef.child(Key).update(newBlogContent);
    return { status: 201, message: "Like removed" };
  } else {
    return { status: 404 };
  }
}

async function removeDislike({ key, authToken }) {
  let user = await Verify_Key(authToken);
  let encodedUID = encodeToBase64(user.payload.uid);
  const blogRef = db.ref('Blogs');
  const snapshots = await blogRef.orderByKey().equalTo(key).once('value');

  if (snapshots.exists()) {
    let blogContent = snapshots.val();
    let Key = Object.keys(blogContent)[0];
    let newBlogContent = Object.values(blogContent)[0];

    newBlogContent.usersDisliked = newBlogContent.usersDisliked.filter(uid => uid !== encodedUID);
    if (newBlogContent.usersDisliked.length === 0) newBlogContent.usersDisliked = false;

    await blogRef.child(Key).update(newBlogContent);
    return { status: 201, message: "Dislike removed" };
  } else {
    return { status: 404 };
  }
}

module.exports = { getUserData, getBlogs, fetchBlog, addLike, addDislike, removeLike, removeDislike }
