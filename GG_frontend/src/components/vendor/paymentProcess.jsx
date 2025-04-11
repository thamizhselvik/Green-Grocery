import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, totalAmount, totalProduct } = location.state || {};

    const [address, setAddress] = useState("123, Default Street, City, Pincode");
    const [method_of_payment, setPaymentMethod] = useState("COD");

    const handlePlaceOrder = async (e) => {
        try {
            const orderDetails = cartItems.map(item => ({
                seller: item.farmerId,
                product: item.id,
                quantity: item.quantity,
                price: item.price,
                address: address,
                method_of_payment: method_of_payment
            }));

            if (method_of_payment == "COD") {
                await axios.post("http://localhost:3000/api/order/placeOrder", {
                    orders: orderDetails,
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                navigate('/vendor/order/success');
            } else {
                const postApi = 'http://localhost:3000/api/payment/process';
                const getApi = 'http://localhost:3000/api/payment/getKey';
                const header = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };

                const { data: orderData } = await axios.post(postApi, { amount: totalAmount }, { headers: header });
                const { order } = orderData;

                const { data: keyData } = await axios.get(getApi, { headers: header });
                const { key } = keyData;

                var options = {
                    "key": key,
                    "amount": totalAmount,
                    "currency": "INR",
                    "name": "Green Grocery",
                    "description": "Test Transaction",
                    "image": "https://example.com/your_logo",
                    "order_id": order.id,
                    "handler": async function (response) {
                        const validateRes = await axios.post("http://localhost:3000/api/payment/verifyPayment", response, { headers: header });
                        console.log(response)
                        console.log(validateRes)
                        if (validateRes.data.msg == "Success") {
                            await axios.post("http://localhost:3000/api/order/placeOrder", {
                                orders: orderDetails,
                            }, {
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                }
                            });
                            navigate('/vendor/order/success');
                        }
                        else {
                            toast.error("Order Failed!");
                        }
                    },
                    "prefill": {
                        "name": "Brad pitt",
                        "email": "brad.pitt@example.com",
                        "contact": "9000090000"
                    },
                    "notes": {
                        "address": "Razorpay Corporate Office"
                    },
                    "theme": {
                        "color": "#3399cc"
                    }
                };

                var rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    alert(response.error.code);
                    alert(response.error.description);
                    alert(response.error.source);
                    alert(response.error.step);
                    alert(response.error.reason);
                    alert(response.error.metadata.order_id);
                    alert(response.error.metadata.payment_id);
                });

                rzp1.open();
                e.preventDefault();
            }

        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("❌ Failed to place order");
        }
    };


    useEffect(() => {
        const getVendor = async () => {
            const getApi = "http://localhost:3000/api/vendor/getVendor";
            const header = { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            const response = await axios.get(getApi, { headers: header })
            setAddress(`${response.data.address}, ${response.data.city}, ${response.data.state}`)
        }
        getVendor();
    }, [])



    return (
        <div className="container mt-5 mb-5">
            <ToastContainer />
            <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                    <h3 className="mb-4 text-success fw-bold text-center">🛒 Payment Summary</h3>

                    {/* Delivery Address */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">📍 Delivery Address</label>
                        <textarea
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows="3"
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">💳 Payment Method</label>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={method_of_payment === "COD"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                id="cod"
                            />
                            <label className="form-check-label" htmlFor="cod">
                                Cash on Delivery
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                value="Online"
                                checked={method_of_payment === "Online"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                id="online"
                            />
                            <label className="form-check-label" htmlFor="online">
                                Online / Bank Payment
                            </label>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mb-4">
                        <h5 className="fw-bold mb-3">🧾 Order Summary</h5>
                        <ul className="list-group mb-3">
                            {cartItems?.map((item, index) => (
                                <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                                    <div>{item.title} × {item.quantity}</div>
                                    <strong>₹{item.price * item.quantity}</strong>
                                </li>
                            ))}
                        </ul>
                        <div className="d-flex justify-content-between">
                            <span className="fw-semibold">Total Items:</span>
                            <span>{totalProduct}</span>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                            <span className="fw-semibold">Total Amount:</span>
                            <strong className="text-success fs-5">₹{totalAmount}</strong>
                        </div>
                    </div>

                    <button
                        className="btn btn-success btn-lg w-100 fw-bold shadow-sm"
                        onClick={handlePlaceOrder}
                    >
                        ✅ Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
