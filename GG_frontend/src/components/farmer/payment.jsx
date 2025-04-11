import { useState, useEffect } from "react";
import { Table, Button, Card, ListGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payment = ({ farmerId }) => {
    const navigate = useNavigate();
    const [pendingPayments, setPendingPayments] = useState([]);
    const [expenditure, setExpenditure] = useState({ weekly: 0, monthly: 0 });
    const [myAddress, setAddress] = useState({ address: undefined, city: undefined, state: undefined });

    useEffect(() => {
        const fetchExpenditure = async () => {
            try {
                const token = localStorage.getItem('token');
                const getApi = `http://localhost:3000/api/order/expenditure`;
                const header = { "Authorization": `Bearer ${token}` };
                const response = await axios.get(getApi, { headers: header });
                setExpenditure({
                    weekly: response.data.weeklyExpenditure || 0,
                    monthly: response.data.monthlyExpenditure || 0
                });
            } catch (error) {
                console.error("Error fetching expenditure:", error);
            }
        };

        fetchExpenditure();
    }, []);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const token = localStorage.getItem('token');
                const getApi = `http://localhost:3000/api/order/pending`;
                const header = { "Authorization": `Bearer ${token}` };
                const response = await axios.get(getApi, { headers: header });

                response.data.map((order) => (
                    setAddress({
                        address: order.seller.address,
                        city: order.seller.city,
                        state: order.seller.state
                    })
                ));

                const formattedPayments = response.data.map((order, index) => ({
                    id: index + 1,
                    method: "Cash on Delivery",
                    amount: `${order.price}`,
                    buyer: order.buyer.username,
                    status: order.status
                }));

                setPendingPayments(formattedPayments);
            } catch (error) {
                console.error("Error fetching pending payments:", error);
            }
        };

        fetchPending();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Payment Summary</h1>

            <div className="row">
                {/* Main content on the left */}
                <div className="col-md-9">
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Expenditure Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Weekly Expenditure: <strong>Rs {expenditure.weekly}</strong></ListGroup.Item>
                                <ListGroup.Item>Monthly Expenditure: <strong>Rs {expenditure.monthly}</strong></ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Pending Payments</Card.Title>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Payment Method</th>
                                        <th>Amount</th>
                                        <th>Buyer</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingPayments.map((payment, index) => (
                                        <tr key={payment.id}>
                                            <td>{index + 1}</td>
                                            <td>{payment.method}</td>
                                            <td>Rs {payment.amount}</td>
                                            <td>{payment.buyer}</td>
                                            <td>{payment.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Payment Options</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    💳 <strong>COD</strong> - {myAddress.address}, {myAddress.city}, {myAddress.state}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <div className="text-center mt-3">
                        <Button variant="primary">📄 Download Invoice</Button>
                    </div>
                </div>

                {/* Sidebar buttons on the right */}
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

export default Payment;
