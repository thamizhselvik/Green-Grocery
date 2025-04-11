const Comment = require("../model/commentModel");
const Vendor = require("../model/vendorModel");

exports.addComment = async(req, res) => {
    try
    {
        let obj = req.user;
        let userN = obj.username;
        let vendor = await Vendor.findOne({ 'username': userN })
        if (!vendor)
            return res.status(400).json({ 'msg': 'Could not find Vendor' })
        const {message, product} = req.body;
        let comment = new Comment({'message': message, 'product': product, 'username': userN})
        comment = await comment.save();
        res.status(200).json(comment)
    }
    catch(err)
    {
        res.status(400).json({'msg':'Error in api'})
    }
}

exports.getCommentById = async(req, res) => {
    try
    {
        const {id} = req.params;
        const comments = await Comment.find({'product': id});
        res.status(200).json(comments)
    }
    catch(err)
    {
        res.status(400).json({'msg':'Error in api'})
    }
}