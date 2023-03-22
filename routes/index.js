/**
 * All api routes handles here
 * @author Rumail Ijaz
 */
const router = require("express").Router();

// Parent Routes
router.use("/bootcamps", require("./bootcamps")); // All the bootcamp routes
router.use("/users", require("./users")); // All the user routes
router.use("/auth", require("./auth")); // All the auth routes
router.use("/courses", require("./courses")); // All the courses routes

// Export
module.exports = router;