import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaShoppingCart, FaComments, FaRobot, FaSearch, FaMicrophone, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Bounce, toast, ToastContainer } from "react-toastify";

const ProductDetails = () => {
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [message, setMessage] = useState("");
    const [comments, setComments] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        if (!location.state) {
            console.error("location.state is null or undefined");
            return;
        }

        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/vendor/getProductById/${location.state}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                console.log("Product Data:", response.data);
                setProduct(response.data);
            }
            catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [location.state]);

    useEffect(() => {
        if (!location.state) return;

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/comment/getComment/${location.state}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setComments(response.data);
            }
            catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [location.state]);

    const submitComment = async () => {
        if (!message.trim()) return;

        try {
            await axios.post('http://localhost:3000/api/comment/addComment', {
                message,
                product: location.state
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            setMessage("");
            setComments([...comments, { username: "You", message, commentDate: new Date().toISOString() }]);
        }
        catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars.push(<FaStar key={i} className="text-warning" />);
            else if (i - 0.5 === rating) stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
            else stars.push(<FaRegStar key={i} className="text-warning" />);
        }
        return stars;
    };

    if (!product) return <p>Loading...</p>;


    const addCart = async (p) => {
        const postApi = 'http://localhost:3000/api/cart/addProduct';
        const header = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };
        const res = await axios.post(postApi, { 'productId': p._id, 'quantity': p.quantity }, { headers: header });
        toast.success("Cart Added Successfully")
    }

    const handleMessage = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Login required!");

        const postApi = "http://localhost:3000/api/conversation/add";
        const header = { 'Authorization': `Bearer ${token}` };

        try {
            const res = await axios.post(postApi, { 'receiverId': id }, { headers: header });
            navigate(`/chat/${res.data._id}`);
            console.log(res.data._id);
        }
        catch (error) {
            console.error("Error starting chat:", error);
        }
    };




    return (
        <div className="d-flex flex-column vh-100 mt-4">
            {/* Top Navbar */}
            <nav className="navbar navbar-light bg-light fixed-top px-3 d-flex justify-content-between">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search..." />
                    <button className="btn btn-outline-secondary"><FaSearch /></button>
                    <button className="btn btn-outline-secondary"><FaMicrophone /></button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="container mt-5">
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
                <div className="card p-4 shadow-lg" style={{ minHeight: "600px" }}>
                    <div className="row">
                        <div className="col-md-4 text-center d-flex align-items-center justify-content-center">
                            <img
                                src={`/image/product/${product.image}`}
                                className="img-fluid rounded"
                                alt={product.title}
                                style={{
                                    width: "100%",
                                    maxHeight: "350px",
                                    objectFit: "cover",
                                    objectPosition: "center"
                                }}
                            />
                        </div>

                        <div className="col-md-8">
                            <h2 className="fw-bold">{product.title}</h2>

                            <div className="d-flex align-items-center mb-2">
                                {product.rating ? renderStars(product.rating.avgRating) : <p className="text-muted">No ratings yet</p>}
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Quantity:</strong> {product.quantity} kg</p>
                                    {product.color && <p><strong>Color:</strong> {product.color}</p>}
                                    {product.size && <p><strong>Size:</strong> {product.size}</p>}
                                    <p><strong>Price:</strong> ₹{product.price}/kg</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Seller ID:</strong> {product.farmer?.username}</p>
                                    <p><strong>Expiry Date:</strong> {product.expired}</p>
                                    <p><strong>Delivery Time:</strong> {product.delivery_time} days</p>
                                    <p><strong>Number of Ratings:</strong> {
                                        product.rating.numberOfRatings === 0
                                            ? "None"
                                            : `${product.rating.numberOfRatings} ${product.rating.numberOfRatings === 1 ? 'User' : 'Users'}`
                                    }</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h4 className="fw-bold">Product Description</h4>
                        <p>{product.product_desc || "No additional details available."}</p>
                    </div>

                    <div className="mt-4">
                        <h4 className="fw-bold">Seller Location</h4>
                        <p><strong>Address:</strong> {product.farmer?.address || "Not Provided"}</p>
                        <p><strong>City:</strong> {product.farmer?.city || "Unknown"}</p>
                        <p><strong>State:</strong> {product.farmer?.state || "Unknown"}</p>
                        <p><strong>Country:</strong> {product.farmer?.country || "Unknown"}</p>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button className="btn btn-primary btn-lg" onClick={() => addCart(product)}>Add to Cart</button>
                        <button className="btn btn-success btn-lg">Buy Now</button>
                        <button className="btn btn-warning btn-lg" onClick={() => handleMessage(product.farmer._id)}>Message Seller</button>
                    </div>
                </div>

                <div className="card mt-4">
                    <div className="card-header"><h3>Add Comment</h3></div>
                    <div className="card-body">
                        <textarea className="form-control mb-3" rows="4" placeholder="Write your comment here..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                        <button className="btn btn-info" onClick={submitComment}>Comment</button>
                    </div>
                </div>

                <div className="card mt-4" style={{ paddingBottom: "80px" }}>
                    {comments.length === 0 ? (
                        <div className="card mb-3">
                            <div className="card-body text-center">
                                <p className="text-muted">No comments yet.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="card mb-4">
                            <div className="card-body">
                                {comments.map((c, index) => (
                                    <div key={index}>
                                        <div className="d-flex justify-content-between">
                                            <p className="mt-2 mb-0">
                                                Username: <span className="fw-normal">{c.username}</span>
                                            </p>
                                            <small className="text-muted">
                                                Date: {(c.commentDate).split("T")[0]}
                                            </small>
                                        </div>
                                        <p className="mt-2 mb-0">
                                            Comment: <span className="fw-normal">{c.message}</span>
                                        </p>
                                        {index !== comments.length - 1 && <hr />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navbar */}
            <nav className="navbar navbar-light bg-light fixed-bottom d-flex justify-content-around p-2 border-top mt-4">
                <button className="btn btn-light" onClick={() => navigate('/vendor/dashboard')}><FaHome size={24} /></button>
                <button className="btn btn-light" onClick={() => navigate('/vendor/profile')}><FaUser size={24} /></button>
                <button className="btn btn-light" onClick={() => navigate('/vendor/cart')}><FaShoppingCart size={24} /></button>
                <button className="btn btn-light" onClick={() => navigate('/vendor/chatbot')}><FaRobot size={24} /></button>
                <button className="btn btn-light" onClick={() => navigate('/vendor/message')}><FaComments size={24} /></button>
            </nav>
        </div>

    );
}

export default ProductDetails;