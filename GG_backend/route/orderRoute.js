const express = require("express");
const auth = require("../middleware/auth");
const { placeOrder, getOrderById, setStatusSent, getOrderByBuyerId, setStatusDelivered, getExpenditure, getPendingById, rating, placeSingleOrder } = require("../controller/orderController");

const router = express.Router();

router.post("/placeOrder", auth, placeOrder);
router.get("/getOrder", auth, getOrderById);
router.put("/updateStatus/:id", auth, setStatusSent);
router.get("/getOrderBuyer", auth, getOrderByBuyerId);
router.put("/updateStatus/delivered/:id", auth, setStatusDelivered);
router.get("/expenditure", auth, getExpenditure);
router.get("/pending", auth, getPendingById);
router.post("/rateProduct", auth, rating);
router.post("/placeSingleOrder", auth, placeSingleOrder);

module.exports = router;