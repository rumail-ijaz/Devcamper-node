const express = require('express')


const {getAllBootcamps, createBootcamp, getBootcamp, getBootcampInRadius}=require('../controllers/bootcamps')

const router = express.Router()

// post
router.post("/", createBootcamp ); // create bootcamp

// Read
router.get("/", getAllBootcamps ); // Get all Bootcamps at once

router.get("/:id", getBootcamp ); // Get one Bootcamp
router.get('/radius/:zipcode/:distance', getBootcampInRadius)


module.exports=router