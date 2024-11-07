require('dotenv').config();
const admin = require("firebase-admin");
const cors = require('cors')
const express = require('express')
const app = express();
const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;
const serviceAccount = require('./serviceAccountKey.json');
const cookieParser = require('cookie-parser');

const { CreateUser, LogInUser } = require('./functions/User');
const { Verify_Key } = require('./functions/JWT_Keys');

app.use(cors({
  origin: ORIGIN,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ORIGIN);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const COOKIE_OPTIONS = {
  httpOnly: true,  // Prevents access via JavaScript (browser can't read it)
  secure: true,   // Set to false when testing over HTTP (local development)
  sameSite: 'none',
  maxAge: 10 * 60 * 60 * 1000,  // 10 hours
};

app.get('/', (req, res) => {
  res.send({ message: "Hello server!" });
})

app.post('/SignUp', async (req, res) => {
  console.log(`SignUp request sent by ${req.get('Origin') || req.get('Referer') || 'unknown origin'}`);
  const { username, email, password } = req.body;

  try {
    let result = await CreateUser({ username, email, password });

    if (!result.valid && result.error) {
      // This could be for cases like invalid email, weak password, etc.
      res.status(400).json({ message: result.message || 'Bad request' });

    } else if (result.valid && result.error) {
      // If the user creation was valid but had an issue, like 'email already exists'
      res.status(409).json({ message: result.message || 'Conflict' });  // 409 Conflict for 'email already exists'

    } else if (result.valid && !result.error) {
      // Success case
      let token = result.token;
      res.cookie('auth_token', token, COOKIE_OPTIONS);
      res.status(201).json({ message: 'User created successfully'});  // 201 Created for successful user creation
    }
  } catch (error) {
    console.log(`There was an error: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/verifyCookie', async (req, res) => {
  console.log(`cookie request sent by ${req.get('Origin') || req.get('Referer') || 'unknown origin'}`);
  let userToken = req.cookies['auth_token'];

  let userData = Verify_Key(userToken);
  if (!userData.valid) {
    res.clearCookie('auth_token');
    return res.status(400).send({
      error: 'Invalid token',
    });
  }

  const uid = userData.payload.uid;

  try {
    const userRecord = await admin.auth().getUser(uid);

    res.status(200).send({
      message: 'User exists',
      email: userRecord.email,
      displayName: userRecord.displayName || null,
      loggedIn: true,
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.clearCookie();
    res.status(404).send({
      error: 'User not found',
    });
  }
});

app.post('/LogOut', async (req, res) => {
  try {
    console.log(`Log Out request sent by ${req.get('Origin') || req.get('Referer') || 'unknown origin'}`);
    res.clearCookie('auth_token');
    res.clearCookie('loggedIn')
    res.status(201).send({ message: 'Log out successfull' })

  } catch (error) {
    res.clearCookie('auth_token');
    res.status(404).send({ error: `An error occured : ${error}` })
  }
})

app.post('/LogIn', async (req, res) => {
  console.log(`Log In request sent by ${req.get('origin') || req.get('referer' || 'unkown origin')}`)
  const { idToken } = req.body;

  try {
    let result = await LogInUser({ idToken });

    if (result.token) {
      let token = result.token;
      res.cookie('auth_token', token, COOKIE_OPTIONS);
      res.status(201).json({ message: 'User created successfully'});
    }
  } catch (error) {

  }
})

app.listen(PORT, () => {
  console.log(`Server is running !`);
})