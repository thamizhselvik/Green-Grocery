const express = require("express");
const auth = require("../middleware/auth");
const { addProducts, removeProduct, getCartByBuyerId, removeAllById } = require("../controller/cartController");

const router = express.Router();

router.post("/addProduct",auth, addProducts);
router.delete("/removeProduct/:id", auth, removeProduct);
router.get("/getCartById", auth, getCartByBuyerId);
router.delete("/deleteCart", auth, removeAllById);

module.exports = router;