/**
 * All api routes handles here
 * @author Rumail Ijaz
 */
const router = require("express").Router();

// Parent Routes
router.use("/bootcamp", require("./bootcamps")); // All the bootcamp routes
// router.use("/users", require("./users")); // All the user routes
// router.use("/auth", require("./auth")); // All the auth routes

// Export
module.exports = router;