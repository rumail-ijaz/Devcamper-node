const express = require('express')
const colors= require('colors')
const fileupload = require('express-fileupload')
const cookieParser= require('cookie-parser')
const path= require('path')
const dotenv = require('dotenv')
const logger =require('./middlewear/logger')
const connectDB = require('./config/db')
const errorHandler = require('./middlewear/error')

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


