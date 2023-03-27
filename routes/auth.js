const express =require('express')
const {register, login, logout, getMe, forgotPassword, resetPassword, updateDetails, updatePassword} = require('../controllers/auth')
const router = express.Router()

const { protect } = require('../middlewear/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/me').get(protect,getMe)
router.route('/updatedetails').put(protect,updateDetails)
router.route('/updatepassword').put(protect,updatePassword)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword/:resettoken').put(resetPassword)

module.exports= router