// Function to allow users to request a new access token using a valid refresh token
const jwt = require("jsonwebtoken");
const db = require("../prisma/queries");
require("dotenv").config();

const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken; // Retrieve the refresh token from the user's cookies

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh Token is missing" }); // Unauthorized


  try {
    // Evaluate the JWT
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY); // Verifying the refresh token to see if its still valid and hasn't been tampered with. If valid, it returns the decoded payload including user id & claims.


    // Verify to see if refresh token is valid
    const storedToken = await db.getRefreshTokenByUserId(payload.id);
    if (storedToken != refreshToken) {                                         //     / != returns true if both operands are NOT equal
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Create a new access token with user ID and role from the verified payload
    const newAccessToken = jwt.sign(
      { id: payload.id, role: payload.role }, 
      JWT_SECRET_KEY, 
      { expiresIn: '30m'}
    );

    res.json({ accessToken: newAccessToken})     // Send the new access token back to the client in the response  


  } catch (error) {
    res.status(403).json({message: 'Invalid or expired refresh token'})

  }
}

module.exports = refreshToken;




// .sign() creates a JWT
// .verify makes sure JWT hasn't been tampered with, returns decoded payload