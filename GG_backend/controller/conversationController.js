const Conversation = require("../model/conversationModel");
const Farmer = require("../model/farmerModel");
const Vendor = require("../model/vendorModel");

exports.addConversation = async (req, res) => {
    let obj = req.user;
    let userN = obj.username;
    let vendor = await Vendor.findOne({ 'username': userN })

    const { receiverId } = req.body;
    const senderId = vendor._id;
    try {
      const existingConversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });
    
      if (existingConversation) {
        return res.status(200).json(existingConversation);
      }
  
      const newConversation = new Conversation({
        members: [senderId, receiverId],
      });
  
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } 
    catch (err) 
    {
      res.status(400).json(err);
    }
}

exports.getConversation = async (req, res) => {
    try {
      const conversations = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversations);
    } 
    catch (err) 
    {
      res.status(400).json(err);
    }
}

exports.getChat = async (req, res) => {
  try {
    let obj = req.user;
    let userN = obj.username;

    let farmer = await Farmer.findOne({ username: userN });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const chat = await Conversation.find({ members: { $in: [farmer._id.toString()] } });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getChatVendor = async (req, res) => {
  try {
    let obj = req.user;
    let userN = obj.username;

    let vendor = await Vendor.findOne({ username: userN });
    if (!vendor) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const chat = await Conversation.find({ members: { $in: [vendor._id.toString()] } });

    res.status(200).json(chat);
  } 
  catch (err) 
  {
    console.error("Error fetching chat:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.getUserName = async(req, res) => {
  try
  {
    const {id} = req.params;

    const user = await Farmer.findById(id);
    res.status(200).json(user);
  }
  catch(err)
  {
    res.status(400).json({ error: err.message });
  }
}

exports.getUserNameVendor = async(req, res) => {
  try
  {
    const {id} = req.params;

    const user = await Vendor.findById(id);
    res.status(200).json(user);
  }
  catch(err)
  {
    res.status(400).json({ error: err.message });
  }
}