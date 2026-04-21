const passport = require('passport');


// JWT authentication middleware

const jwtAuthentication = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    
    if (error) {
      return res.status(500).json({ message: 'Authentication error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = user; // If authentication is successful, the authenticated user will be attached to the request object.
    next()
    
  })(req, res, next)  // ensures that Passport handles the request properly by invoking the return function from passport.authenticate

}

module.exports = jwtAuthentication;



/*
passport.authenticate('jwt'): This tells Passport.js to use the JWT strategy to authenticate the request. 
The strategy checks for the presence of a valid JWT token in the request


session: false:  : By default, Passport.js manages user sessions, which involves storing session information in a cookie. 
                    Setting session: false disables this session management, 
                    meaning the user's authentication state is not stored in the session (which is common in stateless APIs). 
                    Instead, the authentication relies entirely on the JWT token provided with each request.


*/