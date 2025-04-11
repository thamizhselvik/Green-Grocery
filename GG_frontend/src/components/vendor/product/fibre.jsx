import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaShoppingCart, FaComments, FaRobot, FaSearch, FaMicrophone } from "react-icons/fa";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Fibre = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const getProduct = async () => {
            const getApi = 'http://localhost:3000/api/vendor/getProductByCat/fibre';
            const header = {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            };
            const res = await axios.get(getApi, { headers: header });
            setProducts(res.data);
        };
        getProduct();
    }, []);

    const addCart = async (p) => {
        const postApi = 'http://localhost:3000/api/cart/addProduct';
        const header = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };
        const res = await axios.post(postApi, { 'productId': p._id, 'quantity': p.quantity }, { headers: header });
        toast.success("Cart Added Successfully");
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleVoiceSearch = () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                toast.error("Speech Recognition not supported in this browser.");
                return;
            }
        
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-IN';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
        
            recognition.start();
        
            recognition.onresult = (event) => {
                const spokenText = event.results[0][0].transcript;
                setSearchTerm(spokenText);
            };
        
            recognition.onerror = (event) => {
                toast.error(`Speech recognition error: ${event.error}`);
            };
        };

    return (
        <div className="d-flex flex-column vh-100">
            {/* Top Navbar */}
            <nav className="navbar navbar-light bg-light fixed-top px-3 d-flex justify-content-between">
                <div className="input-group w-100">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary"><FaSearch /></button>
                    <button className="btn btn-outline-secondary" onClick={handleVoiceSearch}><FaMicrophone /></button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex-grow-1 overflow-auto mt-5 mb-5 p-3">
                <div className="container mt-4">
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

                    <div className="row">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center mt-4">
                                <h5>No Products Available</h5>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <div key={product._id} className="col-md-3 mb-3">
                                    <div className="card h-100 p-2 text-center" onClick={() => navigate('/vendor/product/details', { state: product._id })}>
                                        <img src={`/image/product/${product.image}`} className="card-img-top" alt={product.title} style={{ height: "120px", objectFit: "cover" }} />
                                        <div className="card-body p-2 d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">{product.title}</span>
                                            <span className="text-success">₹{product.price}/kg</span>
                                        </div>
                                        <div className="d-flex justify-content-between p-2">
                                            <button className="btn btn-sm btn-primary" onClick={(e) => {
                                                e.stopPropagation();
                                                addCart(product)
                                            }}>Add to Cart</button>
                                            <button className="btn btn-sm btn-success" onClick={(e) => { e.stopPropagation(); /* Buy Now Logic */ }}>Buy Now</button>
                                        </div>
                                    </div>
                                </div>
                            )))
                        }
                    </div>
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

export default Fibre;
