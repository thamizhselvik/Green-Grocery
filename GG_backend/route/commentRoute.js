const express = require("express");
const auth = require("../middleware/auth");
const { addComment, getCommentById } = require("../controller/commentController");

const router = express.Router();

router.post("/addComment", auth, addComment);
router.get("/getComment/:id", auth, getCommentById);

module.exports = router;