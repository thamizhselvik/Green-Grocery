import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHome, FaUser, FaShoppingCart, FaComments, FaRobot, FaSearch, FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router";

const VendorMessage = () => {

    const navigate = useNavigate();

    const [messages, setMessage] = useState([]);

    const handleChatClick = (conversationId) => {
        navigate(`/chat/${conversationId}`);
    };

    const getUserNameById = async (userId) => {
        try {
            const getApi = `http://localhost:3000/api/conversation/getUserName/${userId}`;
            const header = { 'Authorization': "Bearer " + localStorage.getItem('token') };
            const response = await axios.get(getApi, { headers: header });
            return {
                name: response.data.name || "Unknown Customer",
                username: response.data.username || "unknown_user"
            };
        }
        catch (error) {
            return { name: "Unknown Customer", username: "unknown_user" };
        }
    };


    useEffect(() => {
        const getChat = async () => {
            try {
                const getApi = 'http://localhost:3000/api/conversation/getChat/vendor';
                const header = { 'Authorization': "Bearer " + localStorage.getItem('token') };
                const res = await axios.get(getApi, { headers: header });

                const userNamePromises = res.data.map(async (msg) => {
                    const senderId = msg.members[1];
                    const userData = await getUserNameById(senderId);
                    return { ...msg, senderName: userData.name, senderUsername: userData.username };
                });

                const updatedMessages = await Promise.all(userNamePromises);
                setMessage(updatedMessages);
                console.log(updatedMessages);
            }
            catch (err) {
                console.log(err);
            }
        };
        getChat();
    }, []);

    return (
        <div className="d-flex flex-column vh-100">
            {/* Top Navbar */}
            <nav className="navbar navbar-light bg-light fixed-top px-3 d-flex justify-content-between">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search..." />
                    <button className="btn btn-outline-secondary"><FaSearch /></button>
                    <button className="btn btn-outline-secondary"><FaMicrophone /></button>
                </div>
            </nav>

            {/* Main Content Area */}
            <br />
            <br />
            <div className="container mt-4">
                <h2 className="mb-4">Customer Messages</h2>
                <div className="list-group">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                onClick={() => handleChatClick(msg._id)}
                                style={{ cursor: "pointer" }}
                            >
                                <div>
                                    <h5 className="mb-1">{msg.senderName || "Unknown Customer"}</h5>
                                    <p className="mb-1 text-muted">{msg.senderUsername}</p>
                                </div>
                                <span className="badge bg-primary rounded-pill">
                                    {new Date(msg.createdAt).toLocaleString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">No messages yet.</p>
                    )}
                </div>
            </div>

            {/* Bottom Navbar */}
            <nav className="navbar navbar-light bg-light fixed-bottom d-flex justify-content-around p-2 border-top">
                <button className="btn btn-light" onClick={() => navigate('/vendor/dashboard')}><FaHome size={24} /></button>
                <button className="btn btn-light" onClick={() => navigate('/vendor/profile')}><FaUser size={24} /></button>
                <button className="btn btn-light" onClick={() => navigate('/vendor/cart')}><FaShoppingCart size={24} /></button>
                <button className="btn btn-light" onClick={() => navigate('/vendor/chatbot')}><FaRobot size={24} /></button>
                <button className="btn btn-light" onClick={() => navigate('/vendor/message')}><FaComments size={24} /></button>
            </nav>
        </div>
    );
};

export default VendorMessage;
