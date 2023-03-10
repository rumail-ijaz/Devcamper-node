const Bootcamp = require ('../model/bootcamp')
const ErrorResponse = require('../utilis/errorResponse')
const asyncHandler = require('../middlewear/async')
const geocoder= require('../utilis/geocoder')
const path= require('path')

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
        return next( new ErrorResponse(`Bootcamp not found  with id of ${req.params.id}`, 404) ) ;
    }
    res.status(200).json({ success: true, data: bootcamp })

 })

// @desc    Create new bootcamp
// @Routes  Post /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
})

// @desc    Update bootcamp
// @Routes  Put /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runvalidators: true
    });
    if(!bootcamp){
        return next( new ErrorResponse(`Bootcamp not found  with id of ${req.params.id}`, 404) ) ;
    }
    res.status(200).json({ success: true, data: bootcamp });
    
})

// @desc    Delete bootcamp
// @Routes  Delete /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(   async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if(!bootcamp){
        return next( new ErrorResponse(`Bootcamp not found  with id of ${req.params.id}`, 404) ) ;
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
    const loc = await geocoder.geocode(zipcode);
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
 

// @desc    Upload photo for a bootcamp
// @Routes  put /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp){
        return next( new ErrorResponse(`Bootcamp not found  with id of ${req.params.id}`, 404) ) ;
    }

    if(!req.files){
        return next( new ErrorResponse(`Please upload a photo`, 400) ) ;
    }

    console.log(req.files);
    const file= req.files.file

    // Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
        return next( new Exception(`Please upload an image file`, 400))
    }

    // Check filesize
    if(!file.size > process.env.MAX_FILE_UPLOAD){
        return next( new Exception(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    // Create custom filename
    file.name= `photo_${bootcamp._id}${path.parse(file.name).ext}`
    console.log(file.name);

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err)
            return next( new Exception(`Problem with file upload`, 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
        
        res.status(200).json({ success: true, data: file.name });

    })

    
})
  