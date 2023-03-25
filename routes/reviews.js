const express = require('express')
const {getAllReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviews')

// Model
const Review = require('../model/review')

// Middlewear
const advancedResults= require('../middlewear/advancedResults')
const { protect, authorize } = require('../middlewear/auth')

const router = express.Router({ mergeParams:true })

// Get all reviews
router.route('/')
    .get(advancedResults(Review, {
        path:"bootcamp",
        select:"name description"
    }), getAllReviews)
    .post(protect, authorize('user', 'admin'), addReview)


router.route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview)


module.exports= router