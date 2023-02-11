const express = require('express')


const {getAllBootcamps, createBootcamp, getBootcamp, getBootcampInRadius, deleteBootcamp}=require('../controllers/bootcamps')
const {getAllCourses}=require('../controllers/courses')

const router = express.Router()

// post
router.post("/", createBootcamp ); // create bootcamp

// Read
router.get("/", getAllBootcamps ); // Get all Bootcamps at once
router.get("/:bootcampId/courses", getAllCourses ); // Get courses of single Bootcamp

router.get("/:id", getBootcamp ); // Get one Bootcamp
router.delete("/:id", deleteBootcamp ); // delete one Bootcamp
router.get('/radius/:zipcode/:distance', getBootcampInRadius)


module.exports=router