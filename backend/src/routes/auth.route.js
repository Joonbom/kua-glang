const express = require('express');
const router = express.Router();
const { loginHandler } = require('../controllers/auth/login.controller');

router.post('/login', loginHandler);

module.exports = router;
