const {  Pool } = require("pg");
require("dotenv").config();  //load environment variables from a .env file into process.env

// A connection pool is a collection of reusable database connections that can be used by the application to execute queries.

module.export = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT
})