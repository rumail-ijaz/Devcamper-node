const express = require('express')
const {getAllCourses, getCourse } = require('../controllers/courses')
const router = express.Router()

router.route('/:id').get(getCourse);
router.route('/').get(getAllCourses)


module.exports= router