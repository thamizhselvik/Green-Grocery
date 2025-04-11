const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    username: {type: String},
    message: {type: String, required: true},
    commentDate: {type: Date, default: Date.now},
    product:{ type: mongoose.Schema.Types.ObjectId, ref: "PostProduct", required: true}
})

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;