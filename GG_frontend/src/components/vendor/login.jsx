import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import backGroundImg from "../images/vendorLogin.jpg";

const VendorLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const login = async (e) => {
        try {
            e.preventDefault();
            const postApi = "http://localhost:3000/api/vendor/login";
            const logged = await axios.post(postApi, { username, password });

            console.log("Login Successful:", logged.data);
            localStorage.setItem("token", logged.data.token);
            navigate("/vendor/dashboard");
        } catch (err) {
            console.error("Login Error:", err.response?.data || err.message);
            setMsg("Invalid Credentials");
        }
    };

    return (
        <div 
            className="d-flex justify-content-center align-items-center vh-100" 
            style={{
                backgroundImage: `url(${backGroundImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backdropFilter: "blur(10px)", // Background blur effect
            }}
        >
            <div 
                className="card p-4 shadow-lg glass-effect" 
                style={{ 
                    width: "90%",  // Adjusts based on screen size
                    maxWidth: "500px",  // Won't exceed 500px
                    minWidth: "280px",  // Won't get too small
                    backdropFilter: "blur(15px)", // Soft blur
                    background: "rgba(255, 255, 255, 0.2)", // Glassmorphism effect
                    border: "1px solid rgba(255, 255, 255, 0.3)", 
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", 
                    borderRadius: "12px"
                }}
            >
                <h3 className="text-center mb-4 fw-bold text-white">Login</h3>

                {msg && <div className="alert alert-danger p-2 text-center">{msg}</div>}

                <form onSubmit={login}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-white">Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter username" 
                            required 
                            onChange={(event) => setUsername(event.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-white">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Enter password" 
                            required 
                            onChange={(event) => setPassword(event.target.value)} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn w-100 fw-bold login-btn"
                        disabled={!username || !password}
                    >
                        Login
                    </button>
                </form>
            </div>

            <style>
                {`
                .login-btn {
                    background-color: #004d00 !important; /* Green button */
                    color: white !important;
                    transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
                    border-radius: 5px;
                }

                .login-btn:hover {
                    background-color: #003300 !important; /* Darker green on hover */
                    transform: scale(1.05);
                }

                /* Extra glass effect for aesthetic */
                .glass-effect {
                    backdrop-filter: blur(15px);
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
                }
                `}
            </style>
        </div>
    );
};

export default VendorLogin;
