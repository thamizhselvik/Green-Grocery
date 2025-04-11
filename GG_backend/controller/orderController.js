const Farmer = require("../model/farmerModel");
const Order = require("../model/orderModel");
const Vendor = require("../model/vendorModel");
const PostProduct = require("../model/postProductModel");
const moment = require("moment");
const mongoose = require("mongoose");

exports.placeOrder = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const vendor = await Vendor.findOne({ 'username': username });
        if (!vendor) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }

        const { orders } = req.body;

        if (!Array.isArray(orders)) {
            return res.status(400).json({ msg: "Invalid orders format" });
        }

        const orderPromises = orders.map(async (orderData) => {
            const { seller, product, quantity, price, address, method_of_payment } = orderData;

            let order = new Order({
                buyer: vendor._id,
                seller,
                product,
                quantity,
                price: price * quantity,
                address,
                method_of_payment
            });

            return await order.save();
        });

        const savedOrders = await Promise.all(orderPromises);

        return res.status(200).json(savedOrders);
    } catch (err) {
        res.status(400).json({ msg: "Error in API: " + err });
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const farmer = await Farmer.findOne({ 'username': username });
        if (!farmer) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }

        const orders = await Order.find({ 'seller': farmer._id }).populate("buyer").populate("product")
        res.status(200).json(orders)

    }
    catch (err) {
        res.status(400).json({ 'msg': "Error in API: " + err });
    }
}

exports.setStatusSent = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const farmer = await Farmer.findOne({ 'username': username });
        if (!farmer) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }

        const { id } = req.params;

        await Order.updateOne(
            { '_id': id },
            { $set: { 'status': 'product sent' } }
        )
        res.status(200).json({ 'msg': 'Updated' })
    }
    catch (err) {
        res.status(400).json({ 'msg': "Error in API: " + err });
    }
}

exports.getOrderByBuyerId = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const vendor = await Vendor.findOne({ 'username': username });
        if (!vendor) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }

        const orders = await Order.find({ 'buyer': vendor._id }).populate("seller").populate("product")
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(400).json({ 'msg': "Error in API: " + err });
    }
}

exports.setStatusDelivered = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const vendor = await Vendor.findOne({ 'username': username });
        if (!vendor) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }

        const { id } = req.params;

        await Order.updateOne(
            { '_id': id },
            { $set: { 'status': 'delivered' } }
        )
        res.status(200).json({ 'msg': 'Updated' })

    }
    catch (err) {
        res.status(400).json({ 'msg': "Error in API: " + err });
    }
}

exports.getExpenditure = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const farmer = await Farmer.findOne({ 'username': username });
        if (!farmer) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }
        const farmerId = farmer._id;
        const lastWeek = moment().subtract(7, "days").toDate();
        const lastMonth = moment().subtract(30, "days").toDate();

        const weeklyExpenditure = await Order.aggregate([
            { $match: { seller: new mongoose.Types.ObjectId(farmerId), time: { $gte: lastWeek }, 'status': 'delivered' } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const monthlyExpenditure = await Order.aggregate([
            { $match: { seller: new mongoose.Types.ObjectId(farmerId), time: { $gte: lastMonth }, 'status': 'delivered' } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        res.json({
            weeklyExpenditure: weeklyExpenditure.length > 0 ? weeklyExpenditure[0].total : 0,
            monthlyExpenditure: monthlyExpenditure.length > 0 ? monthlyExpenditure[0].total : 0
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getPendingById = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const farmer = await Farmer.findOne({ 'username': username });
        if (!farmer) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }

        const pendingOrder = await Order.find({
            'seller': farmer._id,
            'status': { $in: ['ordered', 'product sent'] }
        }).populate("buyer").populate("seller");
        res.status(200).json(pendingOrder);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.rating = async (req, res) => {
    const obj = req.user;
    const username = obj.username;

    const vendor = await Vendor.findOne({ 'username': username });
    if (!vendor) {
        return res.status(401).json({ "msg": "Unauthorized" });
    }
    const { rating, productId } = req.body;

    try {
        const product = await PostProduct.findById(productId);
        if (!product) return res.status(400).json({ message: "Product not found" });

        product.rating.totalRating += rating;
        product.rating.numberOfRatings += 1;
        product.rating.avgRating = product.rating.totalRating / product.rating.numberOfRatings;

        await product.save();

        res.status(200).json({ message: "Rating updated successfully " + product.rating.avgRating });
    }
    catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.placeSingleOrder = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const vendor = await Vendor.findOne({ 'username': username });
        if (!vendor) {
            return res.status(401).json({ "msg": "Unauthorized" });
        }

        const { seller, product, quantity, price, address, method_of_payment } = req.body;

        if (!seller || !product || !quantity || !price || !address || !method_of_payment) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        const order = new Order({
            buyer: vendor._id,
            seller,
            product,
            quantity,
            price,
            address,
            method_of_payment
        });

        const savedOrder = await order.save();

        return res.status(200).json(savedOrder);
    } catch (err) {
        res.status(400).json({ msg: "Error in API: " + err });
    }
};
