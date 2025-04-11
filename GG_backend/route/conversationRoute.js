const router = require('express').Router();
const { addConversation, getConversation, getChat, getChatVendor, getUserName, getUserNameVendor } = require('../controller/conversationController');
const auth = require('../middleware/auth');

router.post('/add', auth, addConversation);
router.get('/getAll/:userId', auth, getConversation );
router.get("/getChat", auth, getChat);
router.get("/getChat/vendor", auth, getChatVendor);
router.get("/getUserName/:id", auth, getUserName);
router.get("/getVendor/:id", auth, getUserNameVendor);

module.exports = router;
