const express = require('express')
const {getAllCourses, getCourse, updateCourse, deleteCourse } = require('../controllers/courses')

// Model
const Course= require('../model/course')

// Middlewear
const advancedResults= require('../middlewear/advancedResults')

const router = express.Router({ mergeParams:true })

router.route('/').get(advancedResults(Course, {
    path:"bootcamp",
    select:"name description"
}), getAllCourses) // get all courses

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse); // single course



module.exports= router