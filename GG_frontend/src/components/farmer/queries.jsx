import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Queries = () => {
  const navigate = useNavigate();
  const [messages, setMessage] = useState([]);

  const handleChatClick = (conversationId) => {
    navigate(`/chat/farmer/${conversationId}`);
  };

  const getUserNameById = async (userId) => {
    try {
      const getApi = `http://localhost:3000/api/conversation/getVendor/${userId}`;
      const header = { 'Authorization': "Bearer " + localStorage.getItem('token') };
      const response = await axios.get(getApi, { headers: header });
      return {
        name: response.data.name || "Unknown Customer",
        username: response.data.username || "unknown_user"
      };
    } catch (error) {
      return { name: "Unknown Customer", username: "unknown_user" };
    }
  };

  useEffect(() => {
    const getChat = async () => {
      try {
        const getApi = 'http://localhost:3000/api/conversation/getChat';
        const header = { 'Authorization': "Bearer " + localStorage.getItem('token') };
        const res = await axios.get(getApi, { headers: header });

        const userNamePromises = res.data.map(async (msg) => {
          const senderId = msg.members[0];
          const userData = await getUserNameById(senderId);
          return { ...msg, senderName: userData.name, senderUsername: userData.username };
        });

        const updatedMessages = await Promise.all(userNamePromises);
        setMessage(updatedMessages);
        console.log(updatedMessages);
      } catch (err) {
        console.log(err);
      }
    };
    getChat();
  }, []);

  return (
    <div className="d-flex vh-100 bg-light">

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto p-4">
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

      {/* Right Sidebar */}
      <div className="col-md-3">
        <div
          className="position-fixed end-0 top-0 bg-white shadow p-4 d-flex flex-column align-items-start"
          style={{
            width: "260px",
            height: "100vh",
            borderLeft: "1px solid rgba(222, 226, 230, 0.78)"
          }}
        >
          <nav className="nav flex-column w-100 gap-5">
            <button onClick={() => navigate("/farmer/inventory")} className="btn btn-outline-primary btn-lg w-100 text-start mt-4">
              Inventory
            </button>
            <button onClick={() => navigate("/farmer/orders")} className="btn btn-outline-success btn-lg w-100 text-start mt-4">
              Order Management
            </button>
            <button onClick={() => navigate("/farmer/payment")} className="btn btn-outline-warning btn-lg w-100 text-start mt-4">
              Payment Summary
            </button>
            <button onClick={() => navigate("/farmer/sales")} className="btn btn-outline-info btn-lg w-100 text-start mt-4">
              Sales Insight
            </button>
            <button onClick={() => navigate("/farmer/queries")} className="btn btn-outline-secondary btn-lg w-100 text-start mt-4">
              Queries
            </button>
            <button onClick={() => navigate("/farmer/settings")} className="btn btn-outline-dark btn-lg w-100 text-start mt-4">
              Settings
            </button>
          </nav>
        </div>
      </div>

    </div>
  );
};

export default Queries;
