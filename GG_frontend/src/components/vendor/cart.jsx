import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHome, FaUser, FaShoppingCart, FaComments, FaRobot, FaSearch, FaMicrophone, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Bounce, toast, ToastContainer } from "react-toastify";

const VendorCart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    const updateQuantity = (id, newQuantity) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
        ));
    };

    const removeFromCart = async (id) => {
        try {
            const deleteApi = `http://localhost:3000/api/cart/removeProduct/${id}`;
            const header = {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            };
            await axios.delete(deleteApi, { headers: header });
            setCartItems(cartItems.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const removeAllCart = async() => {
        try{
            const deleteApi = "http://localhost:3000/api/cart/deleteCart";
            const header = {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
            await axios.delete(deleteApi, {headers: header});
        }
        catch(err)
        {
            console.log(err)
        }
    }

    const handleProceedToPayment = () => {
        removeAllCart();
        setCartItems([]);
        navigate("/vendor/payment/process", {
            state: {
                cartItems,
                totalAmount,
                totalProduct
            }
        });
    };

    useEffect(() => {
        const gettingCart = async () => {
            try {
                const getApi = "http://localhost:3000/api/cart/getCartById";
                const header = {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                };
                const response = await axios.get(getApi, { headers: header });

                const updatedCartItems = response.data.map(item => ({
                    _id: item._id,
                    id: item.products.productId._id,
                    title: item.products.productId.title,
                    image: `image/product/${item.products.productId.image}`,
                    price: item.products.productId.price,
                    quantity: item.products.quantity || 1,
                    farmer: item.products.productId.farmer.username,
                    farmerId: item.products.productId.farmer._id
                }));

                setCartItems(updatedCartItems);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        gettingCart();
    }, []);

    const groupedByFarmer = cartItems.reduce((acc, item) => {
        if (!acc[item.farmer]) {
            acc[item.farmer] = { products: [], total: 0 };
        }
        acc[item.farmer].products.push(item);
        acc[item.farmer].total += item.price * item.quantity;
        return acc;
    }, {});

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalProduct = cartItems.length;

    return (
        <div className="d-flex flex-column vh-100">
            <nav className="navbar navbar-light bg-light fixed-top px-3 d-flex justify-content-between">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search..." />
                    <button className="btn btn-outline-secondary"><FaSearch /></button>
                    <button className="btn btn-outline-secondary"><FaMicrophone /></button>
                </div>
            </nav>

            <div className="flex-grow-1 mt-5 p-3 pb-5">
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
                {cartItems.length === 0 ? (
                    <div>No Items added to cart</div>
                ) : (
                    <div className="container">
                        <h4 className="mb-3">Your Cart</h4>
                        {cartItems.map((item) => (
                            <div key={item.id} className="row align-items-center border-bottom py-2">
                                <div className="col-2">
                                    <img src={`/${item.image}`} alt={item.title} className="img-fluid rounded" style={{ width: "60px", height: "60px", objectFit: "cover" }} />
                                </div>
                                <div className="col-3 d-flex flex-column">
                                    <span className="fw-bold">{item.title}</span>
                                    <small className="text-muted">1kg</small>
                                    <small className="text-muted">Farmer: {item.farmer}</small>
                                </div>
                                <div className="col-3 d-flex align-items-center">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}><FaMinus /></button>
                                    <input type="number" className="form-control mx-2 text-center" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} style={{ width: "80px" }} min="1" />
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}><FaPlus /></button>
                                </div>
                                <div className="col-2 text-end">
                                    <span className="fw-bold text-success">₹{item.price * item.quantity}</span>
                                </div>
                                <div className="col-2 text-end">
                                    <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item._id)}><FaTrash /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="d-flex flex-column vh-100">
                <div className="flex-grow-1 p-3 pb-5" style={{ paddingBottom: '80px' }}>
                    <div className="container">
                        {Object.keys(groupedByFarmer).map((farmer) => (
                            <div key={farmer} className="mb-3">
                                <strong>Products from {farmer}</strong>
                                <ul className="list-unstyled mb-0">
                                    {groupedByFarmer[farmer].products.map(item => (
                                        <li key={item.id}>{item.title} - ₹{item.price * item.quantity}</li>
                                    ))}
                                </ul>
                                <p className="mb-0"><strong>Total Cost for {farmer}: ₹{groupedByFarmer[farmer].total}</strong></p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-light py-3 px-4 mb-4" style={{ marginBottom: '60px' }}>
                    <h5>Order Summary</h5>
                    <div className="d-flex justify-content-between">
                        <span>Total Items:</span>
                        <span className="fw-bold">{totalProduct}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>Total Amount:</span>
                        <span className="fw-bold text-success">₹{totalAmount}</span>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary mb-4 mt-4" onClick={handleProceedToPayment} disabled={cartItems.length === 0}>
                            Proceed to pay
                        </button>
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
        </div>
    );
};

export default VendorCart;