const { admin } = require("./firebaseconfig");
const { validateEmail } = require("./smallFunc");
const { Create_Key } = require("./JWT_Keys");
const { db } = require("./firebaseconfig");
const { encodeToBase64 } = require("./smallFunc");

async function CreateUser({ username, email, password }) {
  if (
    username.trim() == '' ||
    email.trim() == '' ||
    validateEmail({ email }).valid == false ||
    password.trim() == '' ||
    password.length <= 6
  ) {
    return { valid: false, error: true }
  } else {
    try {
      const result = await admin.auth().createUser({
        email,
        password,
        displayName: username,
      });

      const UID = result.uid;
      const encodedUID = encodeToBase64(UID);
      const userRef = db.ref(`${encodedUID}/profile`);

      await userRef.set({'Email': email, 'Username': username});

      const payload = {
        uid: UID,
        email: email
      }

      const token = Create_Key(payload);

      return { valid: true, error: false, message: 'User created successfully', token: token };
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        return { valid: true, error: true, message: 'Email already exists' };

      } else if (error.code === 'auth/invalid-email') {
        return { valid: false, error: true, message: 'Invalid email format' };

      } else if (error.code === 'auth/weak-password') {
        return { valid: false, error: true, message: 'Weak password' };

      } else {
        return { valid: false, error: true, message: `Unknown error: ${error.message}` };
      }
    }
  }
}

async function LogInUser({ idToken }) {
  try {
    const userCredentials = await admin.auth().verifyIdToken(idToken);
    const payload = {
      uid: userCredentials.uid,
      email: userCredentials.email
    }

    const token = Create_Key(payload);

    return { message: 'Log in successfull', token: token }

  } catch (error) {
    return { error: true, message: error };
  }
}

module.exports = { CreateUser, LogInUser };