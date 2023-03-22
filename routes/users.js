const express = require('express')
const {getUsers, getUser, createUser, updateUser, deleteUser} = require('../controllers/user')
const router = express.Router()

// Model
const User = require('../model/user')

// Middlewear
const advancedResults= require('../middlewear/advancedResults')
const { protect, authorize } = require('../middlewear/auth')

router.use(protect)
router.use(authorize('admin'))

router
    .route('/')
    .get(advancedResults(User), authorize('admin'),getUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports=router