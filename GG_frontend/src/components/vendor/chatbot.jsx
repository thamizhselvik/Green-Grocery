import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaComments,
  FaRobot,
  FaSearch,
  FaMicrophone,
} from 'react-icons/fa';
import { useNavigate } from 'react-router';

const VendorChatBot = () => {
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [botResponse, setBotResponse] = useState('');
  const chatEndRef = useRef(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [volume, setVolume] = useState(1);
  const currentUtterance = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const getApi = 'http://localhost:3000/api/chat/chatHistory';
      const header = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      try {
        const response = await axios.get(getApi, { headers: header });
        setChatHistory(response.data.chats);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [chatHistory]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!userMessage) return;

    try {
      const postApi = 'http://localhost:3000/api/chat/sendChat';
      const header = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const response = await axios.post(postApi, { userMessage }, { headers: header });

      setBotResponse(response.data.response);

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { userMessage, botMessage: response.data.response },
      ]);

      setUserMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const speak = (text) => {
    if (isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.volume = volume;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    currentUtterance.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => window.speechSynthesis.pause();
  const resumeSpeech = () => window.speechSynthesis.resume();
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const deleteChat = async(id) => {
    const deleteApi = "http://localhost:3000/api/chat/deleteChat/" + id;
    const header = {'Authorization': 'Bearer ' + localStorage.getItem('token')}
    await axios.delete(deleteApi, {headers: header})
  }

  return (
    <div className="d-flex flex-column vh-100">
      {/* Top Navbar */}
      <nav className="navbar navbar-light bg-light fixed-top px-3 d-flex justify-content-between">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Search..." />
          <button className="btn btn-outline-secondary">
            <FaSearch />
          </button>
          <button className="btn btn-outline-secondary">
            <FaMicrophone />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow-1 overflow-auto mt-5 mb-5 p-3">
        <div>
          <h2>Chat with AI Bot</h2>
          <div
            style={{
              height: '500px',
              overflowY: 'scroll',
              border: '1px solid #ccc',
              padding: '10px',
            }}
          >
            {chatHistory.map((chat, index) => (
              <div key={index}>
                <p>
                  <strong>You:</strong> {chat.userMessage}
                </p>
                <p>
                  <strong>Bot:</strong> {chat.botMessage}{' '}
                  <button
                    onClick={() => speak(chat.botMessage)}
                    disabled={isSpeaking}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isSpeaking ? '#ccc' : '#007bff',
                      cursor: isSpeaking ? 'not-allowed' : 'pointer',
                    }}
                    title="Speak this message"
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => deleteChat(chat._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#007bff',
                    }}
                    title="Delete this message"
                  >
                    🗑
                  </button>
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Voice Settings */}
          <div className="mt-3 mb-4" style={{"paddingBottom": "30px"}}>
            <label>🔈 Volume: </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: '150px', marginRight: '10px' }}
            />

            <label>🗣️ Voice: </label>
            <select
              value={selectedVoice?.name}
              onChange={(e) =>
                setSelectedVoice(voices.find((v) => v.name === e.target.value))
              }
            >
              {voices.map((voice, i) => (
                <option key={i} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>

            <div className="mt-2">
              <button className="btn btn-sm btn-warning me-2" onClick={pauseSpeech}>
                Pause
              </button>
              <button className="btn btn-sm btn-success me-2" onClick={resumeSpeech}>
                Resume
              </button>
              <button className="btn btn-sm btn-danger" onClick={stopSpeech}>
                Stop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleMessageSubmit}
        style={{ position: 'fixed', bottom: '50px', width: '100%', padding: '10px' }}
      >
        <div className="d-flex align-items-center">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message"
            style={{ width: '80%', padding: '10px' }}
          />
          <button
            type="submit"
            style={{
              width: '20%',
              padding: '10px',
              marginLeft: '10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
            }}
          >
            Send
          </button>
        </div>
      </form>

      {/* Bottom Navbar */}
      <nav className="navbar navbar-light bg-light fixed-bottom d-flex justify-content-around p-2 border-top">
        <button className="btn btn-light" onClick={() => navigate('/vendor/dashboard')}>
          <FaHome size={24} />
        </button>
        <button className="btn btn-light" onClick={() => navigate('/vendor/profile')}>
          <FaUser size={24} />
        </button>
        <button className="btn btn-light" onClick={() => navigate('/vendor/cart')}>
          <FaShoppingCart size={24} />
        </button>
        <button className="btn btn-light" onClick={() => navigate('/vendor/chatbot')}>
          <FaRobot size={24} />
        </button>
        <button className="btn btn-light" onClick={() => navigate('/vendor/message')}>
          <FaComments size={24} />
        </button>
      </nav>
    </div>
  );
};

export default VendorChatBot;
