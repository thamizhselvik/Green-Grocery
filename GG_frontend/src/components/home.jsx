import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// Make sure Bootstrap JS is included in your project for Carousel and Dropdowns
// Either via index.html <script> or by importing 'bootstrap/dist/js/bootstrap.bundle.min';
 // Add this line

const Home = () => {
    const navigate = useNavigate();

    // --- Placeholder Data (Replace with your actual images/text) ---
    const carouselItems = [
        {
            id: 1,
            imageUrl: "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg",
            altText: "Slide 1",
            captionTitle: "Fresh Produce Marketplace",
            captionText: "Access a wide variety of fresh goods directly from the source.",
        },
        {
            id: 2,
            imageUrl: "https://images.pexels.com/photos/5709305/pexels-photo-5709305.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            altText: "Slide 2",
            captionTitle: "Verified Vendors",
            captionText: "Supporting local farmers and sustainable practices.",
        },
        {
            id: 3,
            imageUrl: "https://images.pexels.com/photos/8805129/pexels-photo-8805129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            altText: "Slide 3",
            captionTitle: "Direct Communication",
            captionText: "Bridging the gap between farmers and vendors efficiently.",
        },
    ];

    const featureCards = [
        {
            id: 1,
            imageUrl: "https://media.istockphoto.com/id/1390909264/photo/wooden-cubes-with-coins.jpg?s=612x612&w=0&k=20&c=JWSvvJVG61cSyUSBYmze8RXIGDV8HcE8XkE7nBNVbKs=",
            altText: "Feature 1",
            title: "Fair Pricing",
            text: "Fair pricing ensures transparency, affordability, ethics, sustainability, trust, stability, and profitability.",
        },
        {
            id: 2,
            imageUrl: "https://media.istockphoto.com/id/1040885436/photo/business-people-working-together-at-office-table.jpg?s=612x612&w=0&k=20&c=-A7CoqUQqp3q02Cju_83dMFjfTGjDB247EsDZvIKqbg=",
            altText: "Feature 2",
            title: "Market Efficiency",
            text: "Market efficiency ensures fair prices, rapid information flow, and optimal resource allocation.",
        },
        {
            id: 3,
            imageUrl: "https://media.istockphoto.com/id/1510853379/photo/money-character-with-a-shield-displaying-a-green-tick.jpg?s=612x612&w=0&k=20&c=XMmnKxr9HWgNKEozrUYXhfPsDFXHxCbX8ig_58JEWUQ=",
            altText: "Feature 3",
            title: "Secure Transaction",
            text: "Secure transactions protect data, prevent fraud, and ensure encrypted exchanges.",
        },
    ];
    // --- End Placeholder Data ---

    return (
        <div>
            {/* --- Navbar (Fixed Top) --- */}
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: "#004d00" }}>
                <div className="container-fluid">
                    <a className="navbar-brand fs-4 fw-bold text-white" href="#home">
                        Green Grocery {/* Changed Brand Name */}
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            {/* Use href="#sectionId" for smooth scrolling */}
                            <li className="nav-item">
                                <a className="nav-link text-white fs-5 mx-2 nav-hover" href="#home">
                                    Home
                                </a>
                            </li>
                             <li className="nav-item">
                                <a className="nav-link text-white fs-5 mx-2 nav-hover" href="#features">
                                    Features
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white fs-5 mx-2 nav-hover" href="#about">
                                    About
                                </a>
                            </li>

                            {/* Login Dropdown */}
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle text-white fs-5 mx-2 nav-hover" href="#" id="loginDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Login
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="loginDropdown"> {/* Added border-0 */}
                                    <li>
                                        <button className="dropdown-item fs-6 py-2 px-4 dropdown-hover" onClick={() => navigate("/FarmerLogin")}>
                                            Farmer Login
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item fs-6 py-2 px-4 dropdown-hover" onClick={() => navigate("/VendorLogin")}>
                                            Vendor Login
                                        </button>
                                    </li>
                                </ul>
                            </li>

                            {/* Signup Dropdown */}
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle text-white fs-5 mx-2 nav-hover" href="#" id="signupDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Signup
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="signupDropdown"> {/* Added border-0 */}
                                    <li>
                                        <button className="dropdown-item fs-6 py-2 px-4 dropdown-hover" onClick={() => navigate("/FarmerSignup")}>
                                            Farmer Signup
                                        </button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item fs-6 py-2 px-4 dropdown-hover" onClick={() => navigate("/VendorSignup")}>
                                            Vendor Signup
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* --- Main Content Area (Add padding top to offset fixed navbar) --- */}
            <div style={{ paddingTop: '100px' }}> {/* Adjust value if navbar height changes */}

                {/* --- Carousel Section (Home) --- */}
                <section id="home">
                    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            {carouselItems.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    data-bs-target="#carouselExampleCaptions"
                                    data-bs-slide-to={index}
                                    className={index === 0 ? "active" : ""}
                                    aria-current={index === 0 ? "true" : "false"}
                                    aria-label={`Slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                        <div className="carousel-inner">
                            {carouselItems.map((item, index) => (
                                <div key={item.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                    <img src={item.imageUrl} className="d-block w-100" alt={item.altText} style={{ maxHeight: '75vh', objectFit: 'cover' }} /> {/* Limit height & cover */}
                                    <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded"> {/* Added subtle background */}
                                        <h5>{item.captionTitle}</h5>
                                        <p>{item.captionText}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </section>

                {/* --- Features Section (Cards) --- */}
                <section id="features" className="container py-5">
                    <h2 className="text-center mb-5 display-6 fw-bold" style={{ color: "#004d00" }}>Our Key Features</h2>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"> {/* Responsive grid */}
                        {featureCards.map((card) => (
                            <div key={card.id} className="col">
                                <div className="card h-100 shadow-sm border-0 hover-shadow"> {/* Added h-100, shadow, border-0 */}
                                    <img src={card.imageUrl} className="card-img-top" alt={card.altText} style={{ height: '200px', objectFit: 'cover'}} />
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ color: "#004d00" }}>{card.title}</h5>
                                        <p className="card-text">{card.text}</p>
                                    </div>
                                    {/* Optional: Add a button if needed
                                    <div className="card-footer bg-transparent border-0">
                                        <a href="#" className="btn btn-sm" style={{ backgroundColor: '#004d00', color: 'white'}}>Learn More</a>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- About Section --- */}
                <section id="about" className="py-5 bg-light"> {/* Added background color */}
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-4 mb-lg-0">
                                <h2 className="display-6 fw-bold mb-3" style={{ color: "#004d00" }}>About Green Grocery</h2>
                                <p className="lead">
                                To create a transparent, tech-driven, and sustainable agricultural marketplace that empowers farmers, promotes fair trade, and enhances market efficiency through innovative digital solutions.
                                </p>
                                <p>
                                Our mission is to empower farmers by providing a secure, transparent, and efficient platform that connects them directly with local vendors. By leveraging Machine Learning for price discovery, Blockchain for secure transactions, and a multilingual AI assistant for accessibility, we aim to eliminate intermediaries, ensure fair pricing, and promote digital inclusion in agriculture. Through bargaining tools and flexible delivery options, we strive to enhance market efficiency, reduce post-harvest losses, and create a sustainable agricultural ecosystem.
                                </p>
                                <p>
                                    Join us in supporting local agriculture and building a stronger, more
                                    sustainable food network. Register today as a farmer or a vendor!
                                </p>
                                {/* Optional: Call to action buttons */}
                                <div className="mt-4">
                                     <button className="btn me-2" style={{ backgroundColor: '#004d00', color: 'white'}} onClick={() => navigate('/FarmerSignup')}>Register as Farmer</button>
                                     <button className="btn btn-outline-success" onClick={() => navigate('/VendorSignup')}>Register as Vendor</button>
                                </div>
                            </div>
                            <div className="col-lg-6 text-center">
                                {/* Replace with a relevant image */}
                                <img
                                    src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="c:\Users\rathi\Downloads\about.avif"
                                    className="img-fluid rounded shadow"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                 {/* --- Footer --- */}
                <footer className="text-center text-white py-3" style={{ backgroundColor: "#004d00" }}>
                    <div className="container">
                        <p className="mb-0">© {new Date().getFullYear()} Green Grocery. All Rights Reserved.</p>
                        {/* Optional: Add social links or contact */}
                    </div>
                </footer>

            </div> {/* End Main Content Area */}


            {/* --- Custom CSS --- */}
            <style>
                {`
                html {
                    scroll-behavior: smooth; /* Enable smooth scrolling */
                    scroll-padding-top: 56px; /* Offset for fixed navbar */
                }

                .nav-hover:hover, .nav-link.active { /* Style active link too */
                    background-color: rgba(255, 255, 255, 0.1); /* Subtle hover/active */
                    border-radius: 5px;
                    transition: background-color 0.3s ease-in-out;
                }
                .navbar-nav .nav-link {
                    padding-right: 0.75rem !important; /* Adjust spacing */
                    padding-left: 0.75rem !important;
                }

                .dropdown-hover:hover {
                    background-color: #004d00 !important; /* Dark green for dropdown items */
                    color: white !important;
                    transition: background-color 0.3s, color 0.3s;
                }
                .dropdown-item {
                    transition: background-color 0.3s, color 0.3s; /* Smooth transition for dropdown items */
                }
                 .dropdown-menu {
                    margin-top: 0.5rem; /* Add space between nav item and dropdown */
                 }

                 .card.hover-shadow:hover {
                     box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; /* Bootstrap's shadow-lg on hover */
                     transition: box-shadow 0.3s ease-in-out;
                 }
                `}
            </style>
        </div>
    );
};

export default Home;