const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const errorMiddleware = require("./middleware/error")
const notFoundMiddlware = require("./middleware/notFound");
const jwtAuthentication = require('./middleware/jwtAuthentication')


const app = express();


// Routes
const indexRouter = require("./routes/index")
const authRouter = require("./auth/authRoutes")


// Serve static files
app.use(express.static('public'))   // 'public' is my static folder.


// Middlewares for cookies
app.use(cookieParser());

// Body Parser Middleware
app.use(express.json()); // submit raw json
app.use(express.urlencoded({ extended: true }));  // This middleware parses this data and makes it available in req.body as a js object. express.urlencoded() is a built-in middleware function in Express that parses incoming requests with URL-encoded payloads. Used when data is submitted from HTML


app.use(cors( {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true     
}));  // enables Cross-Origin Resource Sharing for all incoming requests.



// Initialize Passport
app.use(passport.initialize());


// Session set up



// Adding route-handling code to the request handling chain. This will define particular routes for the different parts of the site

// Public (unauthenticated) routes
app.use('/api/auth', authRouter);



// Protected routes (requires valid JWT)
app.use('/', indexRouter, jwtAuthentication) // mounts indexRouter at the root of application. All routes defined in indexRouter will be relative to this path.





// Catch-all for non-existent routes
app.use(notFoundMiddlware);

// Error handler - order in which functions declare matter - errorhandler is below  the routes
app.use(errorMiddleware);


app.listen(3000, () => {
  console.log('Server running on PORT 3000')
})