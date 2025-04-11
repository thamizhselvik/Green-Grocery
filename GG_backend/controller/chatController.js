const { default: axios } = require("axios");
const Vendor = require("../model/vendorModel");
const Chat = require("../model/chatModel");

exports.sendChat = async (req, res) => {
    const {userMessage } = req.body;
    
    try {
        let obj = req.user;
        let userN = obj.username;
        const user = await Vendor.findOne({'username': userN});
        if (!user) {
            return res.status(401).json({ error: 'Unautorized' });
        }

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama3-8b-8192',
                messages: [{ role: 'user', content: userMessage + " in simplest words" }],
                max_tokens: 500,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer replace this with your groq API key`, //make sure your'e groq account can access llama3-8b-8192 model
                    'Content-Type': 'application/json'
                }
            }
        );

        const botResponse = response.data.choices[0].message.content;

        const newChat = new Chat({
            user: user._id,
            userMessage: userMessage,
            botMessage: botResponse
        });

        await newChat.save();

        res.json({
            response: botResponse
        });

    } 
    catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(400).json({ error: 'Something went wrong with the request', details: error.response?.data || error.message });
    }
}

exports.getChatHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        let obj = req.user;
        let userN = obj.username;
        
        const user = await Vendor.findOne({ 'username': userN });
        if (!user) {
            console.log(`User not found: ${userN}`);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const chats = await Chat.find({ user: user._id }).sort({ timestamp: 1 });

        res.json({
            chats: chats
        });
    } 
    catch (error) 
    {
        console.error('Error fetching chat history:', error);
        res.status(400).json({ error: 'Something went wrong while fetching chat history' });
    }
};

exports.deleteChat = async(req, res) => {
    try
    {
        let obj = req.user;
        let userN = obj.username;
        
        const user = await Vendor.findOne({ 'username': userN });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const {id} = req.params;
        await Chat.findByIdAndDelete(id);
        res.status(200).json({"msg": "chat deleted"})
    }
    catch(err)
    {
        res.status(400).json("Error in API "+err)
    }
}
