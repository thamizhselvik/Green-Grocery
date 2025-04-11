import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const FarmerDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            {/* Welcome Message */}
            <div className="card text-center mb-4 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title">Welcome, Farmer!</h2>
                    <p className="card-text text-muted">
                        Manage your farm efficiently with our dashboard.
                    </p>
                </div>
            </div>

            {/* Message Box */}
            <div className="alert alert-info text-center fw-bold">
                📢 Your latest sales insights are available! Check them now.
            </div>

            {/* Dashboard Menu */}
            <div className="row d-flex justify-content-center">
                <div className="col-md-6">
                    <div className="d-grid gap-3">
                        <button onClick={() => navigate("/farmer/inventory")} className="btn btn-primary btn-lg w-100 py-3">
                            Inventory
                        </button>
                        <button onClick={() => navigate("/farmer/orders")} className="btn btn-success btn-lg w-100 py-3">
                            Order Management
                        </button>
                        <button onClick={() => navigate("/farmer/payment")} className="btn btn-warning btn-lg w-100 py-3">
                            Payment Summary
                        </button>
                        <button onClick={() => navigate("/farmer/sales")} className="btn btn-info btn-lg w-100 py-3">
                            Sales Insight
                        </button>
                        <button onClick={() => navigate("/farmer/queries")} className="btn btn-secondary btn-lg w-100 py-3">
                            Queries
                        </button>
                        <button onClick={() => navigate("/farmer/settings")} className="btn btn-dark btn-lg w-100 py-3">
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
