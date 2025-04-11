import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Settings = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({});
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/farmer/getFarmer", {
                    headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfile();
    }, [profileImage]);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await axios.post("http://localhost:3000/api/farmer/uploadProfilePic", formData, {
                headers: {
                    'Authorization': "Bearer " + localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Image uploaded successfully");
            setProfileImage(res.data.image);
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        }
    };

    return (
        <div className="d-flex flex-column vh-100 bg-light position-relative">
                {/* Top-left Logout and Language Selector */}
                <div className="position-absolute start-0 top-0 p-3 z-3">
                    <button className="btn btn-danger mb-2" onClick={handleLogout}>Logout</button>
                    <select className="form-select mt-2" style={{ width: "150px" }}>
                        <option value="en">English</option>
                        <option value="ta">Tamil</option>
                        <option value="hi">Hindi</option>
                        <option value="te">Telugu</option>
                        <option value="ml">Malayalam</option>
                        <option value="kn">Kannada</option>
                    </select>
                </div>

                {/* Profile Section */}
                <div className="flex-grow-1 overflow-auto mt-3 mb-5 p-3 text-center">
                    <ToastContainer position="top-center" autoClose={5000} theme="light" transition={Bounce} />
                    <div className="position-relative d-flex flex-column align-items-center bg-white shadow p-4 rounded-4" style={{ maxWidth: "500px", margin: "auto" }}>
                        <div className="position-relative d-inline-block mb-3">
                            <img src={`/image/profile/farmer/${profileData.image}` || "default-profile.png"} alt="Profile" className="rounded-circle border border-3 border-primary" width={150} height={150} />
                            <label htmlFor="profile-upload" className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow" style={{ cursor: "pointer" }}>
                                <FaCamera size={20} />
                            </label>
                            <input type="file" id="profile-upload" accept="image/*" className="d-none" onChange={handleImageChange} />
                        </div>
                        <h3 className="fw-bold">{profileData.name}</h3>
                        <p className="text-muted">{profileData.username}</p>
                    </div>

                    {/* Vendor Details */}
                    <div className="mt-4 text-start bg-white shadow p-4 rounded-4 mx-auto" style={{ maxWidth: "500px" }}>
                        <p><strong>Address:</strong> {profileData.address}</p>
                        <p><strong>City:</strong> {profileData.city}</p>
                        <p><strong>State:</strong> {profileData.state}</p>
                        <p><strong>Aadhar Number:</strong> {profileData.aadhar}</p>
                        <p><strong>Uzhavar ID:</strong> {profileData.uzhavan}</p>
                        <p><strong>Contact:</strong> {profileData.contact_no}</p>
                    </div>

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
            </div>
            );
};

            export default Settings;