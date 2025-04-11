import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const getApi = 'http://localhost:3000/api/order/getOrder';
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
            const putApi = 'http://localhost:3000/api/order/updateStatus/' + id;
            const header = {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }

            await axios.put(putApi, { 'status': 'product sent' }, { headers: header });
            toast.success("Status Updated");
        }
        catch (err) {
            console.log(err);
        }
    }

    const [activeButton, setActiveButton] = useState(null);

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                {/* Order content on the left */}
                <div className="col-md-9">
                    <h2 className="mb-4">Order Management</h2>
                    <div className="table-responsive">
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
                        <table className="table table-striped table-hover table-bordered">
                            <thead className="table-dark text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th>Image</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Buyer</th>
                                    <th>Address</th>
                                    <th>State</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{order.product?.title || 'N/A'}</td>
                                            <td>
                                                <img
                                                    src={`/image/product/${order.product?.image || 'default.png'}`}
                                                    alt="Product"
                                                    className="img-thumbnail"
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                            </td>
                                            <td>{order.quantity} kg</td>
                                            <td>Rs.{order.price}</td>
                                            <td>{order.buyer.username}</td>
                                            <td>{order.buyer.address}, {order.buyer.city}</td>
                                            <td>{order.buyer.state}</td>
                                            <td>
                                                <span className={`badge ${order.status === 'ordered' ? 'bg-warning' : 'bg-success'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => updateStatus(order._id)}>
                                                    Product Sent
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center text-muted">No orders available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar on the right */}
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

export default Orders;
