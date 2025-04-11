import { useNavigate } from "react-router-dom";

const Signup = () => {

    const navigate = useNavigate();

    const gotoFarmer = () => {
        navigate('/farmersignup')
    }

    const gotoVendor = () => {
        navigate('/vendorsignup')
    }

    return(
        <div className="container">
            <div className="card mt-4">
                <div className="card-header">
                    Signup for
                </div>
                <div className="card-body">
                    <button onClick={gotoFarmer}>Farmer</button><br /><br />
                    <button onClick={gotoVendor}>Vendor</button><br /><br />
                </div>
            </div>
        </div>
    )
}

export default Signup;