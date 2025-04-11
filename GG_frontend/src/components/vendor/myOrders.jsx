import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaCog, FaComments, FaHome, FaMicrophone, FaQuestionCircle, FaRobot, FaSearch, FaShoppingCart, FaSignOutAlt, FaUser, FaStar } from "react-icons/fa";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [ratedOrders, setRatedOrders] = useState(() => {
        const saved = localStorage.getItem('ratedOrders');
        return saved ? JSON.parse(saved) : {};
    });
    const [hoverRating, setHoverRating] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const getApi = 'http://localhost:3000/api/order/getOrderBuyer';
                const header = {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                };
                const response = await axios.get(getApi, { headers: header });
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [orders]);

    const updateStatus = async (id) => {
        try {
            const putApi = 'http://localhost:3000/api/order/updateStatus/delivered/' + id;
            const header = {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }

            await axios.put(putApi, { 'status': 'delivered' }, { headers: header })
            toast.success("Status Updated")
        } catch (err) {
            console.log(err)
        }
    }

    const handleRating = async (orderId, productId, rating) => {
        try {
            const postApi = 'http://localhost:3000/api/order/rateProduct';
            const header = {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            };
            await axios.post(postApi, {
                productId,
                rating
            }, { headers: header });

            const updatedRatedOrders = {
                ...ratedOrders,
                [orderId]: true
            };
            setRatedOrders(updatedRatedOrders);
            localStorage.setItem('ratedOrders', JSON.stringify(updatedRatedOrders));

            toast.success("Thanks for rating!");
        } catch (error) {
            console.error("Rating failed:", error);
        }
    }

    return (
        <div className="d-flex flex-column vh-100">
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

            <div className="flex-grow-1 overflow-auto mt-5 mb-5 p-3">
                <h2>Your Orders</h2>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Seller</th>
                                <th>City</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ToastContainer position="top-center" autoClose={5000} transition={Bounce} />
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td><img src={`/image/product/${order.product.image}`} alt="Product" style={{ width: '50px', height: '50px' }} /></td>
                                    <td>{order.product.title}</td>
                                    <td>{order.quantity}</td>
                                    <td>${order.price}</td>
                                    <td>{order.seller.username}</td>
                                    <td>{order.seller.city}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        {order.status !== 'delivered' ? (
                                            <button className="btn btn-success" onClick={() => updateStatus(order._id)}>Delivered</button>
                                        ) : (
                                            !ratedOrders[order._id] ? (
                                                <div>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <FaStar
                                                            key={star}
                                                            size={20}
                                                            color={hoverRating >= star ? 'gold' : 'gray'}
                                                            style={{ cursor: 'pointer' }}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(null)}
                                                            onClick={() => handleRating(order._id, order.product._id, star)}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>Rated</p>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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

export default MyOrders;