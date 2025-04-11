import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const BuyNow = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};

    const [address2, setAddress] = useState("123, Default Street, City, Pincode");
    const [method_of_payment2, setPaymentMethod] = useState("COD");

    const totalAmount = product?.price * product?.quantity;
    const totalProduct = product?.quantity;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!product?._id || !product?.quantity || !product?.farmer) {
            toast.error("❌ Missing product details. Try again.");
            return;
        }


        const seller = product.farmer
        const productId = product._id
        const quantity = product.quantity
        const price = product.price * product.quantity
        const address = address2
        const method_of_payment = method_of_payment2


        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };

        try {
            if (method_of_payment === "COD") {
                await axios.post("http://localhost:3000/api/order/placeSingleOrder", {
                    seller,
                    'product': productId,
                    quantity,
                    price,
                    address,
                    method_of_payment
                }, { headers });
                navigate('/vendor/order/success');
            } else {
                const { data: orderData } = await axios.post("http://localhost:3000/api/payment/process", {
                    amount: totalAmount
                }, { headers });

                const { order } = orderData;

                const { data: keyData } = await axios.get("http://localhost:3000/api/payment/getKey", { headers });
                const { key } = keyData;

                const options = {
                    key: key,
                    amount: totalAmount,
                    currency: "INR",
                    name: "Green Grocery",
                    description: "Test Transaction",
                    image: "https://example.com/your_logo",
                    order_id: order.id,
                    handler: async function (response) {
                        const validateRes = await axios.post("http://localhost:3000/api/payment/verifyPayment", response, { headers });

                        if (validateRes.data.msg === "Success") {
                            await axios.post("http://localhost:3000/api/order/placeSingleOrder", {
                                seller,
                                'product': productId,
                                quantity,
                                price,
                                address,
                                method_of_payment
                            }, { headers });
                            navigate('/vendor/order/success');
                        } else {
                            toast.error("❌ Order Failed!");
                        }
                    },
                    prefill: {
                        name: "Brad Pitt",
                        email: "brad.pitt@example.com",
                        contact: "9000090000"
                    },
                    notes: {
                        address: "Razorpay Corporate Office"
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    alert("Payment Failed");
                    console.log(response.error);
                });

                rzp1.open();
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("❌ Failed to place order");
        }
    };

    useEffect(() => {
        const getVendor = async () => {
            try {
                const header = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
                const response = await axios.get("http://localhost:3000/api/vendor/getVendor", { headers: header });

                if (response?.data) {
                    setAddress(`${response.data.address}, ${response.data.city}, ${response.data.state}`);
                }
            } catch (error) {
                console.error("Failed to fetch vendor address:", error);
            }
        };

        getVendor();
    }, []);

    return (
        <div className="container mt-5 mb-5">
            <ToastContainer />
            <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                    <h3 className="mb-4 text-success fw-bold text-center">🛒 Payment Summary</h3>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">📍 Delivery Address</label>
                        <textarea
                            className="form-control"
                            value={address2}
                            onChange={(e) => setAddress(e.target.value)}
                            rows="3"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">💳 Payment Method</label>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={method_of_payment2 === "COD"}
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
                                checked={method_of_payment2 === "Online"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                id="online"
                            />
                            <label className="form-check-label" htmlFor="online">
                                Online / Bank Payment
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5 className="fw-bold mb-3">🧾 Order Summary</h5>
                        <ul className="list-group mb-3">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <div>{product?.title} × {product?.quantity}</div>
                                <strong>₹{product?.price * product?.quantity}</strong>
                            </li>
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

export default BuyNow;
