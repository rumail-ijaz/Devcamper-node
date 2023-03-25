const fs= require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// load env variables
dotenv.config({path:'./config/config.env'})

// load modal
const Bootcamp= require('./model/bootcamp')
const Course = require('./model/course')
const User = require('./model/user')
const Review = require('./model/review')

// connect db
// mongoose.connect(process.env.MONGO_URI)

const connectDB = require('./config/db')
connectDB()

// Read JSON Files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, ''))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, ''))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, ''))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, ''))


// Import  into DB
const importData = async () => {
    try
    {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        await Review.create(reviews)
        
        console.log('Data imported........'.green.inverse)
        process.exit(1)
    }
    catch (err)
    {
        console.log(err)
    }
 }

 const deleteData = async () => {
    try
    {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()

        console.log('Data Destroyed........'.red.inverse)
        process.exit(1)
    }
    catch (err)
    {
        console.log(err)
    }
 }
 
 
 console.log(process.argv,'process');

 if (process.argv[2] === '-i')
{
   importData()
   console.log(process.argv,'process');
}
else if (process.argv[2] === '-d')
{
   deleteData()
}


