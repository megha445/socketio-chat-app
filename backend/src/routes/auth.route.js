const express = require('express');
const { login, signup, logout, updateProfile, checkAuth } = require('../controllers/auth.controller.js');
const { protectRoute } = require('../middleware/auth.middleware.js');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.post('/signup', signup); // fixed function mapping
router.post('/login', login);
router.post('/logout', logout);

router.put('/updateprofile',protectRoute,updateProfile );
router.get('/check',protectRoute,checkAuth)

module.exports = router;
