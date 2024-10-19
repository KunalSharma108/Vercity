const admin = require("firebase-admin");
const { validateEmail } = require("./validateEmail");
const { Create_Key } = require("./JWT_Keys");

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

      console.log(`User Created: ${email}`);

      const UID = result.uid

      const payload = {
        uid:UID,
        email: email
      }

      const token = Create_Key(payload);

      return { valid: true, error: false, message: 'User created successfully', token:token};
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {

        console.log(`Error: Email ${email} already exists.`);
        return { valid: true, error: true, message: 'Email already exists' };

      } else if (error.code === 'auth/invalid-email') {

        console.log(`Error: Invalid email format for ${email}.`);
        return { valid: false, error: true, message: 'Invalid email format' };

      } else if (error.code === 'auth/weak-password') {

        console.log('Error: Weak password.');
        return { valid: false, error: true, message: 'Weak password' };

      } else {
        console.log(`There was an error while creating the user: ${error.message}`);
        return { valid: false, error: true, message: `Unknown error: ${error.message}` };
      }
    }

  }

}

module.exports = { CreateUser };