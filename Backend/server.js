require('dotenv').config();
const cors = require('cors')
const express = require('express')
const app = express();
const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;
const serviceAccount = require('./serviceAccountKey.json');
const cookieParser = require('cookie-parser');

const { CreateUser, LogInUser } = require('./functions/User');
const { Verify_Key } = require('./functions/JWT_Keys');
const { saveDraft, getDrafts, deleteDrafts } = require('./functions/blogFunc');
const { admin } = require('./functions/firebaseconfig');

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

const COOKIE_OPTIONS = {
  httpOnly: true,  // Prevents access via JS (browser can't read it)
  secure: true,
  sameSite: 'none',
  maxAge: 10 * 60 * 60 * 1000,  // 10 hours
};

app.get('/', (req, res) => {
  res.send({ message: "Hello server!" });
})

app.post('/SignUp', async (req, res) => {
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
      res.status(201).json({ message: 'User created successfully' });  // 201 Created for successful user creation
    }
  } catch (error) {
    console.log(`There was an error: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/verifyCookie', async (req, res) => {
  if (req.cookies['auth_token'] === undefined) {
    res.clearCookie('auth_token', { path: '/', secure: true, sameSite: 'none' });
    res.clearCookie('loggedIn', { path: '/', secure: true, sameSite: 'none' });
    return res.status(404).send({
      error: 'User not found',
    });
  }

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
    res.clearCookie('auth_token', COOKIE_OPTIONS);
    res.clearCookie('loggedIn', COOKIE_OPTIONS);
    res.status(404).send({
      error: 'User not found',
      loggedIn: false
    });
  }
});

app.post('/LogOut', async (req, res) => {
  res.clearCookie('auth_token', { path: '/', secure: true, sameSite: 'none' });
  res.clearCookie('loggedIn', { path: '/', secure: true, sameSite: 'none' });
  res.status(201).send({ message: 'Log out successful' });
});

app.post('/LogIn', async (req, res) => {
  const { idToken } = req.body;

  try {
    let result = await LogInUser({ idToken });

    if (result.token) {
      let token = result.token;
      res.cookie('auth_token', token, COOKIE_OPTIONS);
      res.status(201).json({ message: 'User created successfully' });
    }
  } catch (error) {

  }
})

app.post('/blogDraft', async (req, res) => {
  const draftBlogContent = req.body.draftBlogContent;
  const authToken = req.cookies['auth_token']

  let response = await saveDraft({ draftBlogContent, authToken });

  if (response.status === 201) {
    res.status(201).json({ message: 'Draft successfully created' })
  } else if (response.status === 409) {
    res.status(409).json({ message: 'Draft already exists' })
  } else {
    res.status(404).json({ message: 'An error happened' })
  }
});

app.post('/getDrafts', async (req, res) => {
  const authToken = req.cookies['auth_token'];
  let response = await getDrafts({ authToken });

  if (response.status == 201) {
    res.status(201).json({ drafts: response.data })
  } else if (response.status == 409) {
    console.log('got')
    res.status(409);
  } else if (response.status == 401) {
    res.status(401);
  }

});

app.post('/DeleteDraft', async (req, res) => {
  const authToken = req.cookies['auth_token'];
  const Index = req.body.Index;

  let response = await deleteDrafts({index:Index, authToken:authToken});

  if (response.status == 201) {
    res.status(201).json({data: 'Done'});
  } else if (response.status == 404) {
    res.status(404);
  } else {
    res.status(404);
  }
})

app.listen(PORT, () => {
  console.log(`Server is running !`);
})
