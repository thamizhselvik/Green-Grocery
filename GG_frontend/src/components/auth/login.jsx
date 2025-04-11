import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const gotoFarmer = () => {
        navigate('/farmerlogin')
    }

    const gotoVendor = () => {
        navigate('/vendorlogin')
    }

    return(
        <div className="container">
            <div className="card mt-4">
                <div className="card-header">
                    Login as
                </div>
                <div className="card-body">
                    <button onClick={gotoFarmer}>Farmer</button><br /><br />
                    <button onClick={gotoVendor}>Vendor</button><br /><br />
                
                </div>
            </div>
        </div>
    )
}

export default Login;