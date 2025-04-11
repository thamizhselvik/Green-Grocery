import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import backGroundImg from "../images/farmerlogin.jpg";

const FarmerLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        try {
            const postApi = "http://localhost:3000/api/farmer/login";
            const logged = await axios.post(postApi, { username, password });

            console.log("Login Successful:", logged.data);
            localStorage.setItem("token", logged.data.token);
            navigate("/farmerdashboard");
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
                backdropFilter: "blur(10px)",  // Ensures a slight blur effect on the whole background
            }}
        >
            <div 
                className="card p-5 shadow-lg rounded glass-effect" 
                style={{ 
                    maxWidth: "600px", // Increased the width of the login box
                    width: "100%", 
                    backdropFilter: "blur(15px)", // Glassmorphism blur effect
                    background: "rgba(255, 255, 255, 0.2)", // Transparent white for glass effect
                    border: "1px solid rgba(255, 255, 255, 0.3)", // Light border for aesthetic
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" // Soft shadow for depth
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
                    background-color: #004d00 !important; /* Default button color */
                    color: white !important;
                    transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
                }

                .login-btn:hover {
                    background-color: #003300 !important; /* Darker green on hover */
                    transform: scale(1.05); /* Slight zoom effect */
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

export default FarmerLogin;
