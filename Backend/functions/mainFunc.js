const { db } = require("./firebaseconfig");
const { Verify_Key } = require("./JWT_Keys");
const { encodeToBase64, getDate } = require("./smallFunc");

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

async function fetchBlog({ key, authToken }) {
  let encodedUID = '';
  if (authToken) {    
    let user = await Verify_Key(authToken);
    encodedUID = encodeToBase64(user.payload.uid);
  } 
  const blogRef = db.ref('Blogs');
  const snapshots = await blogRef.orderByKey().equalTo(key).once('value');
  if (snapshots.exists()) {
    const data = snapshots.val();

    if (authToken) {
      if (data[key].usersLiked) {
        const likedUsers = Object.values(data[key].usersLiked);
        if (likedUsers.includes(encodedUID)) {
          data[key].youLiked = true;
        } else {
          data[key].youLiked = false;
        }
      } else {
        data[key].youLiked = false;
      }
  
      if (data[key].usersDisliked) {
        const dislikedUsers = Object.values(data[key].usersDisliked);
        if (dislikedUsers.includes(encodedUID)) {
          data[key].youDisliked = true;
        } else {
          data[key].youDisliked = false;
        }
      } else {
        data[key].youDisliked = false;
      }
    }


    return { status: 201, data };
  } else {
    return { status: 404, data: 'not found' };
  }

}

async function addLike({ key, authToken }) {
  try {
    
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
  } catch (error) {
    console.log(error);
  }
}

async function addDislike({ key, authToken }) {
  try {
    
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
  } catch (error) {
    console.log(error);
  }
}

async function removeLike({ key, authToken }) {
  try {
    
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
  } catch (error) {
    console.log(error);
  }
}

async function removeDislike({ key, authToken }) {
  try {
    
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
  } catch (error) {
    console.log(error)
  }
};

async function addComment({key, authToken, Comment}) {
  try {
    
    let user = await Verify_Key(authToken);
    let encodedUID = encodeToBase64(user.payload.uid);
  
    const blogRef = db.ref('Blogs');
    const snapshots = await blogRef.orderByKey().equalTo(key).once('value');
    const userRef = db.ref(`${encodedUID}/profile`);
  
    let author;
    let date = getDate();
  
    await userRef.once('value').then((snapshots) => author = snapshots.val().Username);
    
    let commentObject = {
      Author: author,
      commentContent: Comment,
      uploadedDate: date,
    }
    
    if (snapshots.exists()) {
      let data = snapshots.val();
  
      if (!data[key].comments || data[key].comments === false) {
        data[key].comments = [commentObject];
        await db.ref(`Blogs/${key}`).child('comments').set(data[key].comments);
        return {status:201}
      } else {
        data[key].comments.push(commentObject);
        await db.ref(`Blogs/${key}`).child('comments').set(data[key].comments);
  
        return { status: 201 }
      }
    }
  } catch (error) {
    console.log(error)
  }

}

module.exports = { getUserData, getBlogs, fetchBlog, addLike, addDislike, removeLike, removeDislike, addComment }