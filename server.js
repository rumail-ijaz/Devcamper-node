const express = require('express')
const colors= require('colors')
const fileupload = require('express-fileupload')
const cookieParser= require('cookie-parser')
const path= require('path')
const dotenv = require('dotenv')
const logger =require('./middlewear/logger')
const connectDB = require('./config/db')
const errorHandler = require('./middlewear/error')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// get env variables
dotenv.config({path:'./config/config.env'})

// CONNECT DB
connectDB()

const app = express()

// body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// set port
const PORT = process.env.PORT || 5000

// Middlewear
app.use(logger)

// file middlewear
app.use(fileupload())

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routers 
app.use("/api/v1", require("./routes"))

// error handling
app.use(errorHandler)

// listening the  app  
app.listen(PORT, ()=>{
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})


