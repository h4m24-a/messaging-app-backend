const db = require('../prisma/queries');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require("express-validator");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;


// POST - Sign Up user: Add user to database
async function signUpPost(req, res, next) {
  const username = req.body.username; // Get username from form
  const password = req.body.password; // Get password from form


  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Return 400 with error details
    return res.status(400).json({
      errors: errors.array(), // this gives you an array of error messages
    });
  }

  try {
    const existingUsername = await db.findUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash password and insert user
    const hashedPassword = await bcrypt.hash(password, 10)

    await db.insertUser(username, hashedPassword); // call db the function that inserts the username & hashed password obtained from form in the db
   
    return res.status(201).json({ message: "User created successfully" });    // respond with message after successfull sign up
    
  } catch (error) {
    console.error("Signup error", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  } 
}



// POST -  Log In User
async function logInUserPost(req, res) {
  const {username, password} = req.body;  // Get username & password from body of request

  try {

    const user = await db.findUserByUsername(username)

    if (!user) return res.status(401).json({ error: 'Incorrect Username' })  // If username don't match or exist, return error


    const match = await bcrypt.compare(password, user.password) // Compares the result to the stored hash & verifies passwords with a temporary hash.
    if (!match) return res.status(401).json({ message: 'Incorrect password' })    // If passwords don't match!

     const payload = {
      id: user.id,
    }

    const accessToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '30m' });      // If login is succesfull, generate a JWT using payload and secret key.

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET_KEY, { expiresIn: '7d' });

    
    // Storing refresh token in db
    await db.storeRefreshToken(user.id, refreshToken);
    
    // Set refresh token as HTTP-Only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,                       // Only send over HTTPS. Set to true in production
      maxAge: 7 * 24 * 60 * 60 * 1000     // 7 days in ms
    });
    
    res.json({ message: 'Login Successfull', accessToken }); // Send JWT to client

  } catch (error) {
    res.status(500).json({ error: 'Login Failed' })
  }

};



module.exports = {
  signUpPost,
  logInUserPost,
}