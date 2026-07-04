const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");
const passport = require('passport');
require('./auth/passportJwtConfig');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const errorMiddleware = require("./middleware/error")
const notFoundMiddlware = require("./middleware/notFound");
const jwtAuthentication = require('./middleware/jwtAuthentication')


const app = express();

app.set("trust proxy", 1);

const corsOptions = {
  origin: "https://messaging-app-backend-production-b49f.up.railway.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Initialize Passport
app.use(passport.initialize());

// Serve static files
app.use(express.static('public'))   // 'public' is my static folder.


// Middlewares for cookies
app.use(cookieParser());




// Body Parser Middleware
app.use(express.json()); // submit raw json
app.use(express.urlencoded({ extended: true }));  // This middleware parses this data and makes it available in req.body as a js object. express.urlencoded() is a built-in middleware function in Express that parses incoming requests with URL-encoded payloads. Used when data is submitted from HTML


// Session set up


// Routes
const indexRouter = require("./routes/index")
const authRouter = require("./auth/authRoutes")
const userRouter = require('./routes/userRouter')


// Adding route-handling code to the request handling chain. This will define particular routes for the different parts of the site

// Public (unauthenticated) routes
app.use('/api/', authRouter);



// Protected routes (requires valid JWT)
app.use('/', jwtAuthentication, indexRouter) // mounts indexRouter at the root of application. All routes defined in indexRouter will be relative to this path.
app.use('/api/auth/', jwtAuthentication, userRouter)




// Catch-all for non-existent routes
app.use(notFoundMiddlware);

// Error handler - order in which functions declare matter - errorhandler is below  the routes
app.use(errorMiddleware);


app.listen(PORT, "0.0.0.0", () => {
  console.log("Server listening on PORT", PORT);
});