const instance = require("../utils/razorPayInstance");
const crypto = require('crypto');

exports.paymentProcess = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR"
        }
        const order = await instance.orders.create(options);
        res.status(200).json({
            success: true,
            order
        })
    }
    catch (err) {
        res.status(400).json({ 'msg': 'Error ' + err })
    }
}

exports.getKey = async (req, res) => {
    try {
        res.status(200).json({
            key: process.env.RAZORPAY_API_KEY
        })
    }
    catch (err) {
        res.status(400).json({ 'msg': 'Error ' + err })
    }
}

exports.paymentVerification = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECERT_KEY);
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = sha.digest("hex");
        if (digest !== razorpay_signature) {
            return res.status(400).json({
                msg: "Transaction is not legit!", 
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id
            })
        }
        res.json({
            msg: 'Success',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id
        })
    }
    catch (err) {
        res.status(400).json({ 'msg': 'Error ' + err })
    }
}