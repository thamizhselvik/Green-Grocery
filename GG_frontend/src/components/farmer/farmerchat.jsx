import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FarmerChat = () => {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMessages = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`http://localhost:3000/api/message/get/${conversationId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(res.data);
                setMessages(res.data);
            }
            catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [conversationId, token]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !token) return;

        try {
            console.log("Sending message data:", {
                conversationId,
                text: newMessage
            });

            const res = await axios.post(
                "http://localhost:3000/api/message/send/farmer",
                { conversationId, text: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages([...messages, res.data]);
            setNewMessage("");
        }
        catch (error) {
            console.error("Error sending message:", error);
            console.error("Response data:", error.response?.data);
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.senderId?.username || 'You'}:</strong> {msg.text}
                    </p>
                ))}
            </div>
            <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>

    );
};

export default FarmerChat;
