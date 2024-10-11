require('dotenv').config();
const admin = require("firebase-admin");
const cors = require('cors')
const express = require('express')
const app = express();
const PORT = process.env.PORT;
const serviceAccount = require('./serviceAccountKey.json');

const { CreateUser } = require('./functions/CreateUser');

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.get('/', (req, res) => {
  res.send({ message: "Hello server!" });
})

app.post('/SignUp', async (req, res) => {
  const {username, email, password} = req.body;

  try {    
    let result = await CreateUser({username, email, password});
  
    if (!result.valid) {
      res.status(400).json({error: 'Bad request'})
    } else if (result.valid && result.error) {
      res.status(404).json({error: 'Not Found'})
    } else if (result.valid && !result.error) {
      res.status(200).json({message: 'User created successfully'})
    }
  } catch (error) {
    console.log(`There was an error : ${error}`)
    res.status(400).json({error: 'bad request'})
  }

})

app.listen(PORT, () => {
  console.log(`Server is running !`);
})