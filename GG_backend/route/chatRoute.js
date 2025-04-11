const express = require("express");
const auth = require("../middleware/auth");
const { sendChat, getChatHistory, deleteChat } = require("../controller/chatController");

const router = express.Router();

router.post("/sendChat", auth, sendChat);
router.get("/chatHistory", auth, getChatHistory);
router.delete("/deleteChat/:id", auth, deleteChat);

module.exports = router;