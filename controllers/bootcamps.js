const Bootcamp = require ('../model/bootcamp')
const ErrorResponse = require('../utilis/errorResponse')
const asyncHandler = require('../middlewear/async')
const geocoder= require('../utilis/geocoder')


// @desc    Get all bootcamps
// @Routes  Get /api/v1/bootcamps
// @access  Public
exports.getAllBootcamps = asyncHandler (async (req, res, next) => {
    let query;

    console.log(req.query,'request');
    // copy req.query
    const reqQuery= {...req.query}

    // Fields to exclude
    const removeFields= ['select', 'sort', 'page', 'limit']

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])
    console.log(reqQuery,'reqQuery');

    // create query string 
    let queryStr = JSON.stringify(reqQuery)

    // create operators ($gt, $lt, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(queryStr,'queryreplace')
 
    // finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

    console.log(query,'full');
    // select fields
    if(req.query.select){
        const fields= req.query.select.split(',').join(' ')
        query=query.select(fields)
    }
    // sort
    if(req.query.sort){
        const sortBy=  req.query.sort.split(',').join(' ')
        query= query.sort(sortBy)
    }
    else{
        query= query.sort('-createdAt')
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    console.log(startIndex, "skips", endIndex)
    const total = await Bootcamp.countDocuments()
    console.log(total, "total")

    query = query.skip(startIndex).limit(limit)

    // executing query 
    const bootcamps= await query

    // pagination result
    const pagination = {}
    if (endIndex < total)
    {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0)
    {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
 
    res.status(200).json({  success: true,
        count: bootcamps.length,
        pagination,
        data: bootcamps })
 
 })
 
 
// @desc    Get Single bootcamps
// @Routes  Get /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return  new ErrorResponse(`Bootcamp not found  with id of ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: bootcamp })

 })

// @desc    Create new bootcamp
// @Routes  post /api/v1/bootcamps
// @access   Private
exports.createBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
})

// @desc    Update bootcamp
// @Routes  put /api/v1/bootcamps/:id
// @access  Private

exports.updateBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runvalidators: true
    });
    if(!bootcamp){
        return  new ErrorResponse(`Bootcamp not found  with id of ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: bootcamp });
    
})

// @desc    Delete bootcamp
// @Routes  Delete /api/v1/bootcamps/:id
// @access  Private

exports.deleteBootcamp = asyncHandler(   async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if(!bootcamp){
        return  new ErrorResponse(`Bootcamp not found  with id of ${req.params.id}`, 404);
    }

    bootcamp.remove()

    res.status(200).json({ success: true, msg: `delete bootcamp ${req.params.id}`, data:{} })
   
})
 
// @desc    Get bootcamps within a radius
// @Routes  Get /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private

exports.getBootcampInRadius = asyncHandler(async (req,res,next)=>{
    const {zipcode,distance} = req.params

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode( );
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 miles / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
 
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });

})
 
 
  