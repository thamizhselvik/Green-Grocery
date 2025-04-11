import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();

    const handleCheckOrders = () => {
        navigate("/vendor/myorders");
    };

    const handleShopAgain = () => {
        navigate("/vendor/dashboard");
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100 bg-light"
            style={{ background: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)" }}
        >
            <div className="text-center bg-white p-5 rounded shadow-lg">
                <div className="success-animation mb-4">
                    <div className="checkmark">
                        <div className="checkmark-circle"></div>
                        <div className="checkmark-stem"></div>
                        <div className="checkmark-kick"></div>
                    </div>
                </div>
                <h2 className="text-success fw-bold">Order Placed Successfully!</h2>
                <p className="text-muted">Thank you for your purchase. We're preparing your order.</p>

                <div className="mt-4">
                    <button className="btn btn-success me-3 px-4 fw-semibold" onClick={handleCheckOrders}>
                        📋 Check Your Orders
                    </button>
                    <button className="btn btn-outline-success px-4 fw-semibold" onClick={handleShopAgain}>
                        🛍️ Shop Again
                    </button>
                </div>
            </div>

            {/* Internal CSS */}
            <style>
                {`
                .success-animation {
                    width: 80px;
                    height: 80px;
                    display: inline-block;
                    position: relative;
                }

                .checkmark {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: block;
                    stroke-width: 2;
                    stroke: #28a745;
                    stroke-miterlimit: 10;
                    box-shadow: inset 0px 0px 0px #28a745;
                    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
                    position: relative;
                }

                .checkmark-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: #28a745;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                }

                .checkmark-stem {
                    position: absolute;
                    width: 4px;
                    height: 20px;
                    background-color: white;
                    left: 36px;
                    top: 25px;
                    transform: rotate(45deg);
                    z-index: 2;
                    animation: draw-stem 0.3s ease forwards 0.5s;
                }

                .checkmark-kick {
                    position: absolute;
                    width: 4px;
                    height: 12px;
                    background-color: white;
                    left: 28px;
                    top: 40px;
                    transform: rotate(-45deg);
                    z-index: 2;
                    animation: draw-kick 0.3s ease forwards 0.6s;
                }

                @keyframes draw-stem {
                    0% { height: 0; }
                    100% { height: 20px; }
                }

                @keyframes draw-kick {
                    0% { height: 0; }
                    100% { height: 12px; }
                }

                @keyframes fill {
                    100% {
                        box-shadow: inset 0px 0px 0px 30px #28a745;
                    }
                }

                @keyframes scale {
                    0%, 100% {
                        transform: none;
                    }

                    50% {
                        transform: scale(1.1);
                    }
                }
                `}
            </style>
        </div>
    );
};

export default OrderSuccess;
