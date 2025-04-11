import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditProduct = () => {

    const [price, setPrice] = useState(undefined);
    const [quantity, setQuantity] = useState(undefined);
    const [color, setColor] = useState(undefined);
    const [size, setSize] = useState(undefined);
    const [delivery, setDelivery] = useState(undefined);
    const location = useLocation();
    
    const navigate = useNavigate()

    const handleForm = async(e) => {
        e.preventDefault();
        const deleteApi = 'http://localhost:3000/api/farmer/updateProduct/' + location.state;
        const header = {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        };
        try
        {
            const res = await axios.put(deleteApi, {
                quantity: quantity,
                delivery_time: delivery,
                price: price,
                color: color,
                size: size,
            }, {headers: header})
            console.log(res)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h2 className="card-title text-center mb-4">Update Product Details</h2>
                <form onSubmit={handleForm}>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="text"
                            className="form-control"
                            id="quantity"
                            placeholder="Enter quantity"
                            onChange={(e)=>setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            placeholder="Enter price"
                            onChange={(e)=>setPrice(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="deliveryTime">Delivery Time</label>
                        <input
                            type="text"
                            className="form-control"
                            id="deliveryTime"
                            placeholder="Enter delivery time"
                            onChange={(e)=>setDelivery(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="color">Color</label>
                        <input
                            type="text"
                            className="form-control"
                            id="color"
                            placeholder="Enter color"
                            onChange={(e)=>setColor(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="size">Size</label>
                        <select className="form-control" id="size" onChange={(e)=>setSize(e.target.value)}>
                            <option value="">Select size</option>
                            <option value="S">Small</option>
                            <option value="M">Medium</option>
                            <option value="L">Large</option>
                            <option value="XL">Extra Large</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" onClick={()=>navigate("/farmer/inventory")}>Update</button>
                </form>
            </div>
        </div>

    )
}

export default EditProduct;