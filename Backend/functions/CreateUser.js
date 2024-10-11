const admin = require("firebase-admin");
const { validateEmail } = require("./validateEmail");

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
      let result = await admin.auth().createUser({
        email,
        password,
        displayName: username,
      })

      console.log(`User Created : ${email} `)
      return { valid: true, error: false }
    } catch (error) {
      console.log(`There was an error while creating a user : ${error}`)
      return { valid: true, error: true }
    }
  }

}

module.exports = { CreateUser };