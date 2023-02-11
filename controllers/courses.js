const Course = require('../model/course')
const ErrorResponse = require('../middlewear/error')
const asyncHandler  = require('../middlewear/async')


// @desc      Get courses
// @route     GET /api/v1/courses  
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId)
    {
        query = Course.find({ bootcamp: req.params.bootcampId });
 
    }
    else
    {
        query = Course.find().populate({
            path:"bootcamp",
            select:"name description"
        })
    }
 
    const courses = await query
    res.status(200).json({ sucess: true, count: courses.length, data: courses })
 });
 
// @desc      Get Single courses
// @route     GET /api/v1/courses/:id  
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description"
    })
    console.log(course,'course');
    if (!course)
    {
        return next(new ErrorResponse(`No course with then id  of ${req.params.id}`), 404)
    }
 
 
    res.status(200).json({ sucess: true,  data: course })
 
 });
 
 