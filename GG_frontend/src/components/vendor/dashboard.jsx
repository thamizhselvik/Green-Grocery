import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHome, FaUser, FaShoppingCart, FaComments, FaRobot, FaSearch, FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Bounce, toast, ToastContainer } from "react-toastify";

const VendorDashboard = () => {
    const navigate = useNavigate();

    const categories = [
        { name: "Vegetable", path: "/vendor/vegetable" },
        { name: "Fruit", path: "/vendor/fruit" },
        { name: "Leaves/Spinach", path: "/vendor/leaves" },
        { name: "Seeds/Nuts", path: "/vendor/seeds" },
        { name: "Fibre Crops", path: "/vendor/fibre" },
        { name: "Grains", path: "/vendor/grains" },
        { name: "Rice/Wheat", path: "/vendor/rice-wheat" },
        { name: "Spices", path: "/vendor/spices" }
    ];

    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const gettingProduct = async () => {
            const getApi = "http://localhost:3000/api/vendor/getProduct";
            const header = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
            try {
                const response = await axios.get(getApi, { headers: header });
                setProducts(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        gettingProduct();
    }, []);

    useEffect(() => {

        const getbestSeller = async () => {
            try {
                const getApi = 'http://localhost:3000/api/vendor/bestSeller';
                const header = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };

                const response = await axios.get(getApi, { headers: header });
                setBestSeller(response.data);

            }
            catch (err) {
                console.log(err);
            }

        }
        getbestSeller();
    }, [])

    const addCart = async (p) => {
        const postApi = 'http://localhost:3000/api/cart/addProduct';
        const header = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };
        await axios.post(postApi, { 'productId': p._id, 'quantity': p.quantity }, { headers: header });
        toast.success("Cart Added Successfully");
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
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
            setSearchQuery(spokenText);
        };

        recognition.onerror = (event) => {
            toast.error(`Speech recognition error: ${event.error}`);
        };
    };

    const handleBuyNow = (product) => {
        navigate("/vendor/buynow/process", {
            state: { product }
        });
    };


    return (
        <div className="d-flex flex-column vh-100">
            {/* Top Navbar */}
            <nav className="navbar navbar-light bg-light fixed-top px-3 d-flex justify-content-between">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary"><FaSearch /></button>
                    <button className="btn btn-outline-secondary" onClick={handleVoiceSearch}><FaMicrophone /></button>
                </div>
            </nav>

            {/* Scrollable Content Area */}
            <div className="flex-grow-1 overflow-auto mt-5 mb-5 p-3">
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
                <div className="container">
                    {/* Show Categories only if no search is entered */}
                    {searchQuery === "" && (
                        <div className="row mb-4">
                            {categories.map((category, index) => (
                                <div key={index} className="col-md-3 mb-4">
                                    <div className="card h-100 d-flex flex-column" onClick={() => navigate(category.path)}>
                                        <img
                                            src={`/image/category/${category.name.toLowerCase().replace(/\//g, "-")}.jpg`}
                                            className="card-img-top"
                                            alt={category.name}
                                            style={{ height: "150px", objectFit: "cover" }}
                                        />
                                        <div className="card-body text-center d-flex align-items-center justify-content-center flex-grow-1">
                                            <h5 className="card-title mb-0">{category.name}</h5>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <h3>Products</h3>
                    <br />

                    <div className="row">
                        {searchQuery === "" && bestSeller.length > 0 ? (
                            bestSeller.map((product, index) => (
                                <div key={index} className="col-md-3 mb-4">
                                    <div
                                        className="card h-100 shadow position-relative"
                                        onClick={() => navigate('/vendor/product/details', { state: product._id })}
                                        style={{ position: 'relative' }}
                                    >
                                        {/* Ribbon */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                left: '10px',
                                                backgroundColor: '#fcd283',
                                                color: '#000',
                                                padding: '5px 20px',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
                                                zIndex: 10,
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                            }}
                                        >
                                            Best Seller
                                        </div>

                                        <img
                                            src={`/image/product/${product.image}`}
                                            className="card-img-top"
                                            alt={product.title}
                                            style={{ height: '150px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <h5 className="card-title text-center">{product.title}</h5>
                                            <p className="text-center">
                                                <strong>Price:</strong> ₹{product.price}
                                            </p>
                                            <p className="text-center">
                                                <strong>Quantity:</strong> {product.quantity} kg
                                            </p>
                                            <div className="d-grid gap-2">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addCart(product);
                                                    }}
                                                >
                                                    Add to Cart
                                                </button>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleBuyNow(product)
                                                    }}
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center w-100">
                               
                            </div>
                        )}
                    </div>





                    {/* Show filtered products */}
                    <div className="row">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <div key={index} className="col-md-3 mb-4">
                                    <div className="card h-100 shadow" onClick={() => navigate('/vendor/product/details', { state: product._id })}>
                                        <img
                                            src={`/image/product/${product.image}`}
                                            className="card-img-top"
                                            alt={product.title}
                                            style={{ height: "150px", objectFit: "cover" }}
                                        />
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <h5 className="card-title text-center">{product.title}</h5>
                                            <p className="text-center"><strong>Price:</strong> ₹{product.price}</p>
                                            <p className="text-center"><strong>Quantity:</strong> {product.quantity} kg</p>
                                            <div className="d-grid gap-2">
                                                <button className="btn btn-primary" onClick={(e) => {
                                                    e.stopPropagation();
                                                    addCart(product);
                                                }}>Add to Cart</button>
                                                <button className="btn btn-success" onClick={(e) => { e.stopPropagation(); handleBuyNow(product)}}>Buy Now</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Show "No matches found" if no products match the search query
                            <div className="text-center w-100">
                                <h5>No matches found</h5>
                            </div>
                        )}
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

export default VendorDashboard;