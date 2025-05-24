const express = require("express");
const router = express.Router();

const login = require("../controllers/auth/login.controller");
const registerController = require("../controllers/auth/register.controller.js");
console.log("typeof register =", typeof registerController);
console.log("register =", registerController)

router.post("/login", login);
router.post("/register", registerController);

module.exports = router;
