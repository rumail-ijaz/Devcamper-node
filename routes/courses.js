const express = require('express')
const {getAllCourses, addCourse, getCourse, updateCourse, deleteCourse } = require('../controllers/courses')

// Model
const Course= require('../model/course')

// Middlewear
const advancedResults= require('../middlewear/advancedResults')
const { protect, authorize } = require('../middlewear/auth')

const router = express.Router({ mergeParams:true })

// Get all courses
router.route('/')
    .get(advancedResults(Course, {
        path:"bootcamp",
        select:"name description"
    }), getAllCourses)
    .post(protect, authorize('publisher', 'admin'), addCourse)

// Get Delete Update single course
router.route('/:id')
    .get(getCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse);


module.exports= router