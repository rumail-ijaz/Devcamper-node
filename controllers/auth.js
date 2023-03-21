const crypto =  require('crypto')
const ErrorResponse = require('../utilis/errorResponse')
const asyncHandler= require('../middlewear/async')
const sendEmail = require('../utilis/sendEmail')
const User= require('../model/user')

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async(req,res,next)=>{
    const {name, email, password, role}= req.body

    const user =await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenRespone(user, 200, res)

    // Create token
    // const token = user.getSignedJwtToken()

    // res.status(200).json({success:true, token})
})

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
   
    // Validate email & password
    if (!email || !password)
    {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }
   
    // Check for user
    const user = await User.findOne({ email }).select('+password');
   
    if (!user)
    {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
   
    // Check if password matches
    const isMatch = await user.matchPassword(password);
   
    if (!isMatch)
    { 
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    sendTokenRespone(user, 200, res)

     // Create token
    //  const token = user.getSignedJwtToken()
   
    // res.status(200).json({ sucesss: true, token, msg: "login sucessfull" })
});
   

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.user.id)
  
  res.status(200).json({
    success: true,
    data: user,
  })
});


// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({email : req.body.email})

  if(!user){
    return next(new ErrorResponse(`There is no user with that email`, 404))
  }

  // Get reset token
  const resetToken = await user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false})

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this email to reset a password. Please make a PUT request to: \n\n ${resetUrl}`
  
  try {
    await sendEmail({
      email:user.email,
      subject: "Please reset token",
      message
    })

    res.status(200).json({
      success: true,
      data: 'Email Sent',
    })
    
  } catch (err) {
    console.log(err,'email sent error');
    user.resetPasswordToken =  undefined
    user.resetPasswordExpire =  undefined

    await user.save({ validateBeforeSave: false})

    return next(new ErrorResponse(`Email could not be sent`, 500))
  }
  
  res.status(200).json({
    success: true,
    data: user,
  })
});
   


// @desc      Reset Password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken =  crypto.createHash('sha256').update(req.params.resettoken).digest('hex')


  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if(!user){
    return next(new ErrorResponse(`Invalid token`, 400))
  }

  // Set new password
  user.password =  req.body.password
  user.resetPasswordToken =  undefined
  user.resetPasswordExpire =  undefined

  await user.save()
  
  sendTokenRespone(user, 200, res)

});

// Get token from model, create cookie and send response
const sendTokenRespone = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
 
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if(process.env.NODE_ENV === 'production'){
    options.secure= True
  }
 
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
    
}