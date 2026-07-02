const express = require('express')
const router = express.Router()
const protect = require('../middleware/protect')
const {login, getUser}= require("../controller/authController")

router.post("/login", login);
router.get("/users", protect, getUser)

module.exports = router