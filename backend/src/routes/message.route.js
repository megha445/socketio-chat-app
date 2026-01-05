const express= require('express');
const {protectRoute} = require('../middleware/auth.middleware.js');
const { getUsersForSidebar, getMessagesByUserId, sendMessage } = require('../controllers/message.controller.js');

const router = express.Router();

router.get('/users',protectRoute,getUsersForSidebar);
router.get('/:id',protectRoute,getMessagesByUserId); // Assuming this is for getting messages by user ID

router.post('/send/:id', protectRoute, sendMessage);


module.exports = router;