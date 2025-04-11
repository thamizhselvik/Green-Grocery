const express = require("express");
const { addAdmin, login, addProduct } = require("../controller/adminController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/add", addAdmin);
router.post("/login", login);
router.post("/addProduct", auth, addProduct);

module.exports = router;