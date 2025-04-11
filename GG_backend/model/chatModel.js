const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true},
    userMessage: String,
    botMessage: String,
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
