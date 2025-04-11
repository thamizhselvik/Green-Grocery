import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Inventory = () => {
    const [title, setTitle] = useState(undefined);
    const [price, setPrice] = useState(undefined);
    const [quantity, setQuantity] = useState(undefined);
    const [expiry, setExpiry] = useState(undefined);
    const [color, setColor] = useState(undefined);
    const [size, setSize] = useState(undefined);
    const [delivery, setDelivery] = useState(undefined);
    const [productdesc, setProductdesc] = useState(undefined);
    const [products, setProducts] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [img, setImg] = useState(null);

    const navigate = useNavigate();

    const upload = async (e) => {
        e.preventDefault();
        const postApi = "http://localhost:3000/api/farmer/postProduct";
        const header = {
            Authorization: "Bearer " + localStorage.getItem("token"),
        };
        try {
            await axios.post(
                postApi,
                {
                    title,
                    quantity,
                    delivery_time: delivery,
                    price,
                    expired: expiry,
                    color,
                    size,
                    product_desc: productdesc,
                },
                { headers: header }
            );
            toast("Product Added Successfully");
        } catch (err) {
            console.log(err);
            toast("Product not recognized");
        }
    };

    const deleteItem = async (e, id) => {
        e.preventDefault();
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            const deleteApi = 'http://localhost:3000/api/farmer/deleteProduct/' + id;
            const header = {
                Authorization: "Bearer " + localStorage.getItem("token"),
            };
            try {
                await axios.delete(deleteApi, { headers: header });
                toast.success("Product deleted successfully!");
                setProducts(products.filter((product) => product._id !== id));
            } catch (err) {
                console.error("Error deleting product:", err);
                toast.error("Failed to delete product.");
            }
        }
    };

    const handleImage = (e, id) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setImg(selectedFile);
            UploadPic(id, selectedFile);
        }
    };

    const UploadPic = async (id, file) => {
        if (!file) {
            toast.error("No image selected");
            return;
        }

        const fData = new FormData();
        fData.append("file", file);

        const postApi = `http://localhost:3000/api/farmer/postProduct/pic/${id}`;
        const header = {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
        };

        try {
            await axios.post(postApi, fData, { headers: header });
            const updatedProducts = products.map((product) => {
                if (product._id === id) {
                    product.image = file.name;
                }
                return product;
            });
            setProducts(updatedProducts);
            toast.success("Image uploaded successfully");
        } catch (err) {
            console.error("Error uploading image:", err);
            toast.error("Failed to upload image");
        }
    };

    useEffect(() => {
        const gettingProduct = async () => {
            const getApi = "http://localhost:3000/api/farmer/myProduct";
            const header = {
                Authorization: "Bearer " + localStorage.getItem("token"),
            };
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
        const fetchProducts = async () => {
            const getApi = "http://localhost:3000/api/farmer/getAllProducts";
            const header = {
                Authorization: "Bearer " + localStorage.getItem("token"),
            };

            try {
                const response = await axios.get(getApi, { headers: header });

                if (Array.isArray(response.data)) {
                    const options = response.data.map((product) => ({
                        value: product.title,
                        label: product.title,
                    }));
                    setProductOptions(options);
                } else {
                    console.error("Expected an array but got an object:", response.data);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                {/* Left Section: Main Content */}
                <div className="col-md-9">
                    <div className="card shadow-lg p-4 mb-4">
                        <h3 className="text-center mb-3">Add New Product</h3>
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
                        <form onSubmit={upload}>
                            <div className="mb-3">
                                <label className="form-label text-black">Product Title</label>
                                <Select
                                    options={productOptions}
                                    isSearchable
                                    placeholder="Select or type product title"
                                    onChange={(selectedOption) => setTitle(selectedOption.value)}
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label text-black">Price per kg</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter price"
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label text-black">Available Quantity (kg/day)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter quantity"
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label text-black">Color</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter color"
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label text-black">Size</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter size"
                                        onChange={(e) => setSize(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label text-black">Delivery Time</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter delivery time"
                                        onChange={(e) => setDelivery(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label text-black">Expiry time</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter expiration date"
                                        onChange={(e) => setExpiry(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-black">Product description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tell something about your product"
                                        onChange={(e) => setProductdesc(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-success w-50"
                                disabled={!title || !price || !delivery || !quantity || !expiry}>
                                Add Product
                            </button>
                        </form>
                    </div>

                    <h3 className="text-center mt-4">Product List</h3>
                    <div className="row">
                        {products.map((p, index) => (
                            <div key={index} className="col-md-3 mb-4">
                                <div className="card shadow-sm">
                                    <div
                                        className="card-img-top d-flex align-items-center justify-content-center bg-light"
                                        style={{ height: "180px", cursor: "pointer" }}
                                        onClick={() => document.getElementById(`fileInput-${index}`).click()}
                                    >
                                        {p.image ? (
                                            <img
                                                src={`/image/product/${p.image}`}
                                                alt="Product"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <span className="text-muted">No image added</span>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        id={`fileInput-${index}`}
                                        className="d-none"
                                        onChange={(e) => handleImage(e, p._id)}
                                    />

                                    <div className="card-body">
                                        <h5 className="card-title">{p.title}</h5>
                                        <p className="card-text">Price/kg: {p.price}</p>
                                        <p className="card-text">Quantity: {p.quantity} Kg/day</p>
                                        <p className="card-text">Delivery Time: {p.delivery_time}</p>
                                        <p className="card-text">Expiry: {p.expired}</p>

                                        <div className="d-flex justify-content-between">
                                            <button
                                                className="btn btn-sm"
                                                style={{ backgroundColor: "#004d00", color: "#fff" }}
                                                onClick={() => navigate('/product/edit', { state: p._id })}
                                            >
                                                Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={(e) => deleteItem(e, p._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section: Menu */}
                <div className="col-md-4">
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

export default Inventory;
