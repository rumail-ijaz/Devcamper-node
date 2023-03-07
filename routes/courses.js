const express = require('express')
const {getAllCourses, getCourse, updateCourse, deleteCourse } = require('../controllers/courses')

const router = express.Router({ mergeParams:true })

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);
router.route('/').get(getAllCourses)


module.exports= router