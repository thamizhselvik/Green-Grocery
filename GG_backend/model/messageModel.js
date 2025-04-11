const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId, ref: "Vendor"
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, ref: "Farmer"
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;