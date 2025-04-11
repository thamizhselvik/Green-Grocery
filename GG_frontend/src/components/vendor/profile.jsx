import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHome, FaUser, FaShoppingCart, FaComments, FaRobot, FaSearch, FaMicrophone, FaSignOutAlt, FaClipboardList, FaQuestionCircle, FaCog, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

const VendorProfile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({});
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/vendor/getVendor", {
                    headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
                });
                setProfileData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfile();
    }, [profileImage]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadImage(file);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try 
        {
            const res = await axios.post("http://localhost:3000/api/vendor/uploadPic", formData, {
                headers: {
                    'Authorization': "Bearer " + localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Image uploaded successfully");
            setProfileImage(res.data.image);
        } 
        catch (error) 
        {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        }
    };

    return (
        <div className="d-flex flex-column vh-100 bg-light">
            {/* Top Navbar */}
            <nav className="navbar navbar-light bg-white shadow-sm fixed-top px-3 d-flex justify-content-between">
                <div className="input-group mx-auto">
                    <input type="text" className="form-control" placeholder="Search..." />
                    <button className="btn btn-outline-secondary"><FaSearch /></button>
                    <button className="btn btn-outline-secondary"><FaMicrophone /></button>
                </div>
            </nav>

            {/* Profile Section */}
            <div className="flex-grow-1 overflow-auto mt-5 mb-5 p-3 text-center">
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
                />
                <div className="position-relative d-flex flex-column align-items-center bg-white shadow p-4 rounded-4" style={{ maxWidth: "500px", margin: "auto" }}>
                    <div className="position-relative d-inline-block mb-3">
                        <img src={`/image/profile/vendor/${profileData.image}` || "default-profile.png"} alt="Profile" className="rounded-circle border border-3 border-primary" width={150} height={150} />
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
                    <p><strong>FSSAI ID:</strong> {profileData.fssai}</p>
                    <p><strong>Contact:</strong> {profileData.contact_no}</p>
                </div>
            </div>

            {/* Bottom Navbar */}
            <nav className="navbar navbar-light bg-white shadow-lg fixed-bottom d-flex justify-content-around p-2 border-top">
                <button className="btn btn-light rounded-circle p-3" onClick={() => navigate('/vendor/dashboard')}><FaHome size={24} /></button>
                <button className="btn btn-light rounded-circle p-3" onClick={() => navigate('/vendor/profile')}><FaUser size={24} /></button>
                <button className="btn btn-light rounded-circle p-3" onClick={() => navigate('/vendor/cart')}><FaShoppingCart size={24} /></button>
                <button className="btn btn-light rounded-circle p-3" onClick={() => navigate('/vendor/chatbot')}><FaRobot size={24} /></button>
                <button className="btn btn-light rounded-circle p-3" onClick={() => navigate('/vendor/message')}><FaComments size={24} /></button>
            </nav>

            {/* Side Buttons */}
            <div className="position-fixed end-0 top-50 translate-middle-y d-flex flex-column align-items-end p-2" style={{ right: '10px', zIndex: 1030 }}>
                <button className="btn btn-secondary mb-2 rounded-pill" onClick={() => navigate('/vendor/myorders')}><FaClipboardList size={24} /> Your Orders</button>
                <button className="btn btn-secondary mb-2 rounded-pill" onClick={() => navigate('/vendor/help')}><FaQuestionCircle size={24} /> Help & Support</button>
                <button className="btn btn-secondary mb-2 rounded-pill" onClick={() => navigate('/vendor/feedback')}><FaCog size={24} /> Feedback</button>
                <button className="btn btn-danger mb-2 rounded-pill" onClick={() => navigate('/logout')}><FaSignOutAlt size={24} /> Logout</button>
            </div>
        </div>
    );
};

export default VendorProfile;