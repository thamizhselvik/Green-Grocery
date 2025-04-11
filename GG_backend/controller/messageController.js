const Message = require("../model/messageModel");
const mongoose = require('mongoose');
const Vendor = require("../model/vendorModel");
const Farmer = require("../model/farmerModel");

exports.sendMessage = async (req, res) => {
  try {
    const obj = req.user;
    const username = obj.username;
        
    const vendor = await Vendor.findOne({'username': username});
    if(!vendor)
      return res.status(401).json({"msg":"Unauthorized"})

    console.log("Received message request:", req.body);

    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      console.error("Missing required fields:", { conversationId, text });
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = new Message({
      conversationId: conversationId,
      senderId: vendor._id,
      text,
    });

    await newMessage.save();
    res.status(200).json(newMessage);
  } 
  catch (err) 
  {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const { ObjectId } = mongoose.Types;

exports.getConversation = async (req, res) => {
  try {
      console.log("Received conversationId:", req.params.conversationId);

      const conversationObjectId = new ObjectId(req.params.conversationId);

      const messages = await Message.find({
          conversationId: conversationObjectId,
      }).populate("senderId");

      console.log("Messages Found:", messages);
      res.status(200).json(messages);
  } catch (err) {
      console.error("Error in fetching messages:", err);
      res.status(400).json({ error: err.message });
  }
};


exports.sendMessageFarmer = async (req, res) => {
  try {
    const obj = req.user;
    const username = obj.username;
        
    const farmer = await Farmer.findOne({'username': username});
    if(!farmer)
      return res.status(401).json({"msg":"Unauthorized"})

    console.log("Received message request:", req.body);

    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      console.error("Missing required fields:", { conversationId, text });
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = new Message({
      conversationId: conversationId,
      receiverId: farmer._id,
      text,
    });

    await newMessage.save();
    res.status(200).json(newMessage);
  } 
  catch (err) 
  {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getConversationFarmer = async (req, res) => {
  try {
      console.log("Received conversationId:", req.params.conversationId);

      const conversationObjectId = new ObjectId(req.params.conversationId);

      const messages = await Message.find({
          conversationId: conversationObjectId,
      }).populate("receiverId");

      console.log("Messages Found:", messages);
      res.status(200).json(messages);
  } catch (err) {
      console.error("Error in fetching messages:", err);
      res.status(400).json({ error: err.message });
  }
};