const express = require('express')


const {getAllBootcamps, createBootcamp, getBootcamp}=require('../controllers/bootcamps')

const router = express.Router()

// post
router.post("/", createBootcamp ); // create bootcamp

// Read
router.get("/", getAllBootcamps ); // Get all Bootcamps at once

router.get("/:id", getBootcamp ); // Get one Bootcamp



module.exports=router