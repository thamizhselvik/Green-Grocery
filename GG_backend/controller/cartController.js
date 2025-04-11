const Cart = require("../model/cartModel");
const Vendor = require("../model/vendorModel");

exports.addProducts = async(req, res) => {
    try
    {
        const obj = req.user;
        const username = obj.username;
    
        const vendor = await Vendor.findOne({'username': username});
        if(!vendor)
            return res.status(401).json({"msg":"Unauthorized"})

        const {productId, quantity} = req.body;

        let cart = new Cart({
            buyer: vendor._id,
            products: { productId, quantity }
        });

        cart = await cart.save(cart)

        res.status(200).json(cart)
    }
    catch(err)
    {
        res.status(400).json({'msg': "error in api "+ err})
    }
}

exports.removeProduct = async(req, res) => {
    try
    {
        const obj = req.user;
        const username = obj.username;
    
        const vendor = await Vendor.findOne({'username': username});
        if(!vendor)
            return res.status(401).json({"msg":"Unauthorized"})

        const {id} = req.params;

        await Cart.findByIdAndDelete(id);
        res.status(200).json("Product Removed")
    }
    catch(err)
    {
        res.status(400).json({'msg': "error in api "+ err})
    }
}

exports.getCartByBuyerId = async(req, res) => {
    try
    {
        const obj = req.user;
        const username = obj.username;
    
        const vendor = await Vendor.findOne({'username': username});
        if(!vendor)
            return res.status(401).json({"msg":"Unauthorized"})

        const id = vendor._id;

        const cart = await Cart.find({'buyer': id}).populate({
            path: 'products.productId',
            populate: {
                path: 'farmer',
                select: 'username'
            }
        })
        res.status(200).json(cart)
    }
    catch(err)
    {
        res.status(400).json({'msg': "error in api "+ err})
    }
}

exports.removeAllById = async(req, res) => {
    try
    {
        const obj = req.user;
        const username = obj.username;
    
        const vendor = await Vendor.findOne({'username': username});
        if(!vendor)
            return res.status(401).json({"msg":"Unauthorized"})

        await Cart.deleteMany({'buyer': vendor._id})
        res.status(200).json({'msg': 'deleted successfully'})
    }
    catch(err)
    {
        res.status(400).json({'msg': "error in api "+ err})
    }
}