const express = require('express')

const {getAllBootcamps, createBootcamp, getBootcamp, getBootcampInRadius, deleteBootcamp, updateBootcamp, bootcampPhotoUpload}=require('../controllers/bootcamps')
const {getAllCourses, addCourse}=require('../controllers/courses')
const {getAllReviews, addReview }=require('../controllers/reviews')

// Model
const Bootcamp= require('../model/bootcamp')

// Middlewear
const advancedResults= require('../middlewear/advancedResults')
const { protect, authorize } = require('../middlewear/auth')

const router = express.Router()

// Include other resource routers
const reviewRouter = require('./reviews')

// post
router.post("/", protect, authorize('publisher', 'admin'), createBootcamp ); // create bootcamp
router.post("/:bootcampId/courses", addCourse ); // Add courses of specific Bootcamp
router.use("/:bootcampId/reviews", reviewRouter ); // Add review to specific Bootcamp

// Read
router.get("/", advancedResults(Bootcamp, 'courses'), getAllBootcamps ); // Get all Bootcamps at once
router.get("/:bootcampId/courses", getAllCourses ); // Get courses of single Bootcamp
router.get("/:bootcampId/reviews", getAllReviews ); // Get reviews of single Bootcamp
router.get("/:id", getBootcamp ); // Get one Bootcamp
router.get('/radius/:zipcode/:distance', getBootcampInRadius) //Get bootcamp with distance and zipcode

// delete
router.delete("/:id", protect, authorize('publisher', 'admin'), deleteBootcamp ); // delete one Bootcamp

// update
router.put('/:id', protect, authorize('publisher', 'admin'), updateBootcamp)
router.put('/:id/photo', protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

module.exports=router