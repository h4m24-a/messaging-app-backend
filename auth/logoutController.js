// Function to allow user to log out and invalidates the refresh token
const jwt = require('jsonwebtoken');
const db = require('../prisma/queries');
require('dotenv').config();

const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY


async function logOutUser(req, res) {
  const refreshToken = req.cookies?.refreshToken;       // Retrieve the refresh token from the user's cookies

  if (!refreshToken) {
    return res.status(204); // No content: Nothing to clear
  }


  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY);     // If verification is Successful return decoded payload
    await db.deleteRefreshToken(payload.id)                               // Invalidate the refresh token - remove from DB using id from payload
    

    res.clearCookie('refreshToken', {           // Clear the refresh token cookie from the user's browser
      httpOnly: true,
      secure: false,    // Set to true in production
      sameSite: 'Strict'
      })   


      res.json({ message: 'Logged out successfully' }) // Respond with a success message

  } catch (error) {
    res.status(400).json({ message: 'Logout Failed' })
    
  }
}

module.exports = logOutUser;