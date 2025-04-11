const router = require('express').Router();
const { sendMessage, getConversation, sendMessageFarmer, getConversationFarmer } = require('../controller/messageController');
const auth = require('../middleware/auth');

router.post('/send', auth, sendMessage);
router.get('/get/:conversationId', auth, getConversation);
router.post('/send/farmer', auth, sendMessageFarmer);
router.get('/get/farmer/:conversationId', auth, getConversationFarmer);

module.exports = router;
