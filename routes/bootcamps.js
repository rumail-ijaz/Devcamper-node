const express = require('express')

const {getAllBootcamps, createBootcamp, getBootcamp, getBootcampInRadius, deleteBootcamp, updateBootcamp}=require('../controllers/bootcamps')
const {getAllCourses, addCourse}=require('../controllers/courses')

const router = express.Router()

// post
router.post("/", createBootcamp ); // create bootcamp
router.post("/:bootcampId/courses", addCourse ); // Add courses of specific Bootcamp

// Read
router.get("/", getAllBootcamps ); // Get all Bootcamps at once
router.get("/:bootcampId/courses", getAllCourses ); // Get courses of single Bootcamp
router.get("/:id", getBootcamp ); // Get one Bootcamp
router.get('/radius/:zipcode/:distance', getBootcampInRadius)

// delete
router.delete("/:id", deleteBootcamp ); // delete one Bootcamp

// update
router.put('/:id', updateBootcamp)

module.exports=router