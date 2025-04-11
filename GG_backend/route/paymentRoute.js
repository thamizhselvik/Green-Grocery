const express = require("express");
const auth = require("../middleware/auth");
const { paymentProcess, getKey, paymentVerification } = require("../controller/paymentController");

const router = express.Router();

router.post("/process", auth, paymentProcess);
router.get("/getKey", auth, getKey);
router.post("/verifyPayment", auth, paymentVerification);

module.exports = router;