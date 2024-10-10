require('dotenv').config();
const admin = require("firebase-admin");
const cors = require('cors')
const express = require('express')
const app = express();
const PORT = process.env.PORT;
const serviceAccount = require('./serviceAccountKey.json')

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.get('/', (req, res) => {
  res.send({ message: "Hello how are you , i am under the water !!!!" });
  console.log(req.ip)
})

app.post('/post', (req, res) => {
  res.send({
    blogID: 'blog22',
    blogAuthor: 'bigger casoh',
    blogTitle: 'The last time i pooped was 2 years ago',
    blogContent: 'I am on my way to make the world record of not pooping for the longest period of time...',
    blogLikes: 20,
    commentsCount: 2,
    comments: {
      comment1: {
        commentID: 1,
        commentAuthor: 'Nalvo',
        commentContent: 'Do you really think its healthy?',
        commentLikes: 2,
        commentReplyCount: 1,
        commentReplies: {
          commentReply1: {
            commentID: 1,
            commentAuthor: 'bigger casoh',
            commentContent: 'Idk but world record is world record',
            commentLikes: 1,
          }
        }
      }
    }
  }
  )
})

app.listen(PORT, () => {
  console.log(`Server is running !`);
})