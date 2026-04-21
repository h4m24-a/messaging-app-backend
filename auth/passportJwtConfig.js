// passport jwt setup
const db = require('../prisma/queries');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),    // Extract JWT from the Authorization header (Bearer token)
  secretOrKey: process.env.JWT_SECRET_KEY,        // Secret key used to verify the signature of the JWT, which should match key used when the token was originally signed.
};

// Passport strategy to handle authentication
passport.use(
  new Strategy(jwtOptions, async (payload, done) => {
    try {
      const user = await db.selectUserById(payload.id)  // Find the user based on the ID in the JWT payload
       if(!user) {
        return done(null, false)  // If no user is found, return false
      }

      return done(null, user) // If user is found, pass user to next middleware

    } catch (error) {
      return done(error, false);  // Handle any errors

    }
  })
);













// This configures how passport extracts and verifies the JWT.
// The `done` callback signals the completion of the authentication attempt.