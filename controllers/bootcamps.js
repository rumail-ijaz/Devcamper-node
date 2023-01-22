const Bootcamp = require ('../model/bootcamp')
const ErrorResponse = require('../utilis/errorResponse')
const asyncHandler = require('../middlewear/async')
const geocoder= require('../utilis/geocoder')


// @desc    Get all bootcamps
// @Routes  Get /api/v1/bootcamps
// @acess   Public
exports.getAllBootcamps = asyncHandler (async (req, res, next) => {
    console.log(req.query,'query')
    let query;
    const reqQuery = { ...req.query }
    console.log(reqQuery,'reqQuery')

    const removeFields = ['select', 'sort', 'page', 'limit']

    console.log(removeFields,'aray');
    removeFields.forEach((params)=> delete reqQuery[params])
    console.log(removeFields,'aray2');

  


    let queryStr = JSON.stringify(reqQuery)
    console.log(queryStr,'queryStr')

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(queryStr,'queryreplace')
 
    query = Bootcamp.find(JSON.parse(queryStr))
 
    console.log(query,'queryparse')

    if (req.query.select)
    {
        const fields = req.query.select.split(',').join(' ');
        console.log(fields,'fff')
        query = query.select(fields)
 
    }

    if (req.query.sort)
   {
       const sortBy = req.query.sort.split(',').join(' ');
       query = query.sort(sortBy)
   }
   else
   {
       query = query.sort('-createdAt')
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

        // if (populate)
        // {
        //     query = query.populate(populate)
        // }
        const result = await query
    
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
        count: result.length,
        pagination,
        data: result })
 
 })
 
 
// @desc    Get Single bootcamps
// @Routes  Get /api/v1/bootcamps/:id
// @acess   Public
exports.getBootcamp = async (req, res, next) => {

        const _id = req.params.id
        const bootcamp = await Bootcamp.findById(_id).then((e)=>{

            console.log(e, 'ali')
            res.status(200).json({ success: true, data: e })

        }).catch((err)=>{

            next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 400))

        })
      
 }

// @desc    Create new bootcamp
// @Routes  post /api/v1/bootcamps
// @acess   Private
exports.createBootcamp = async (req, res, next) => {
   
    try
    {

        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({ success: true, data: bootcamp });
    }
    catch (err)
    {
        console.log(err)
        res.status(400).json({ success: false, error:err })
    }
 

}

// @desc    Update bootcamp
// @Routes  put /api/v1/bootcamps/:id
// @acess   Private

exports.updateBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runvalidator: true
    });
    if (!bootcamp)
    {
        return res.status(400).json({ success: false })
    }
    res.status(200).json({ success: true, data: bootcamp });
 
    // res.status(200).json({ sucess: true, msg: `update bootcamp ${req.params.id}` })
}

// @desc    Delete bootcamp
// @Routes  Delete /api/v1/bootcamps/:id
// @acess   Private

exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `update bootcamp ${req.params.id}` })
}
 

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
        // location:{ $geoWithin : { $ $centerSphere : [[lng, lat], radius] }}
    });
 
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });

})
 
 
  