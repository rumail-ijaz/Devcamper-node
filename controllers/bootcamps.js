const Bootcamp = require ('../model/bootcamp')
const ErrorResponse = require('../utilis/errorResponse')
const asyncHandler = require('../middlewear/async')
const geocoder= require('../utilis/geocoder')
// @desc    Get all bootcamps
// @Routes  Get /api/v1/bootcamps
// @acess   Public


exports.getAllBootcamps = asyncHandler (async (req, res, next) => {

  
        const bootcamps = await Bootcamp.find()
        res.status(200).json({ sucess: true, count:bootcamps.length,  data: bootcamps })

 
 
    // res.status(200).json({ sucess: true, msg: "Show all bootcamps" })
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
        res.status(400).json({ success: false  })
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
    });
 
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });

})
 
 
  