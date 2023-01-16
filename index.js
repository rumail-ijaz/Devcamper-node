const express = require('express')
const colors= require('colors')
const dotenv = require('dotenv')
const logger =require('./middlewear/logger')
const connectDB = require('./config/db')
// const errorHandler = require('./middlewear/error')
// get env variables
dotenv.config({path:'./config/config.env'})

// CONNECT DB
require("./config/db");
const app = express()

app.use(express.json())



// set port
const PORT = process.env.PORT || 5000

// Middlewear
app.use(logger)


// Mount Router 
app.use("/api", require("./routes"));
// app.use(errorHandler)

// listening the  app  
app.listen(PORT, ()=>{
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})


