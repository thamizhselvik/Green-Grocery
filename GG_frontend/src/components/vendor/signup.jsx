import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

// --- CSS (Ideally, put this in a separate VendorSignup.css file) ---
const styles = `
  .btn-signup {
    background-color: #004d00;
    border-color: #004d00;
    color: white;
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  }

  .btn-signup:hover {
    background-color: #003300; /* Darker shade on hover */
    border-color: #003300;
    color: white;
  }

  .card-signup {
      border: none; /* Optional: remove card border if shadow is enough */
  }

  .form-label {
      color: #212529; /* Standard Bootstrap dark color - effectively black */
      font-weight: 500; /* Slightly bolder labels */
  }
`;
// --- End CSS ---

const indianStates = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa", "Nellore", "Bapatla", "Annamayya", "Kakinada", "Nandyal", "Tirupati"],
    "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Changlang", "Tirap", "Lohit", "Namsai", "Kurung Kumey", "Kra Daadi", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Kamle", "Pakke-Kessang", "Chimpu", "Seppa"],
    // *** FIXED Assam data structure ***
    "Assam": [
        "Barpeta", "Bongaigaon", "Cachar", "Charaideo", "Chirang",
        "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara",
        "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup",
        "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur",
        "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar",
        "Sonitpur", "South Salmara", "Tinsukia", "Udalguri", "West Karbi Anglong",
        "Biswanath", "Baksa"
    ],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Munger", "Darbhanga", "Nalanda", "Saran", "Purnia", "Buxar", "Supaul", "Katihar", "Khagaria", "Vaishali", "Begusarai", "Siwan", "Madhepura", "Madhubani", "Aurangabad", "Jehanabad", "Samastipur", "Araria", "Kishanganj", "Saharsa", "West Champaran", "East Champaran", "Shahabad", "Lakhisarai", "Nalanda", "Chhapra", "Banka", "Sitamarhi", "Bihar Sharif", "Nawada", "Gopalganj", "Buxar", "Muzaffarpur", "Siwan"],
    "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba", "Jagdalpur", "Raigarh", "Koriya", "Jashpur", "Surguja", "Baloda Bazar", "Mungeli", "Bemetara", "Mahasamund", "Kanker", "Narayanpur", "Dantewada", "Bijapur", "Balrampur", "Surajpur", "Kondagaon", "Gariaband", "Sukma", "Janjgir-Champa", "Kabirdham", "Rajnandgaon", "Gariaband", "Sahaspur", "Sundergarh"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Porvorim", "Cortalim", "Bicholim", "Quepem", "Sanguem", "Cansaulim", "Assagao", "Aldona", "Baga", "Calangute", "Anjuna", "Dona Paula"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kutch", "Kheda", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Narnaul", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kullu", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
    "Karnataka": ["Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belagavi", "Bellary", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Haveri", "Hassan", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashok Nagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Santhal", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    "Meghalaya": ["East Garo Hills", "East Khasi Hills", "Jaintia Hills", "Ri-Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Khasi Hills"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saitual", "Serchhip", "Khawzawl"],
    "Nagaland": ["Dimapur", "Kohima", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Ganjam", "Gajapati", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Subarnapur", "Sundargarh"],
    "Punjab": ["Amritsar", "Barnala", "Bathinda", "Fatehgarh Sahib", "Fazilka", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Patiala", "Rupnagar", "Sangrur", "SAS Nagar (Mohali)", "Tarn Taran"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Ganganagar", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Tonk", "Udaipur"],
    "Sikkim": ["Namchi", "Mangan", "Pelling", "Geyzing", "Ravangla", "Singtam", "Jorethang", "Rongli", "Lachen", "Lachung"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivagangai", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
    "Telangana": ["Adilabad", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalapally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Warangal", "Warangal Rural", "Yadadri Bhuvanagiri"],
    "Tripura": ["Dhalai", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Siddharthnagar", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Medinipur", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"]
};


const VendorSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        address: "",
        aadhar: "",
        city: "",
        state: "",
        contact_no: "",
        fssai: "", // Changed from uzhavan
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleStateChange = (e) => {
        const newState = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            state: newState,
            city: "", // Reset city when state changes
        }));
         // Clear state/city errors
        if (errors.state || errors.city) {
            setErrors({ ...errors, state: null, city: null });
        }
    };

     const handleCityChange = (e) => {
         setFormData((prevData) => ({
            ...prevData,
            city: e.target.value,
        }));
         // Clear city error
        if (errors.city) {
            setErrors({ ...errors, city: null });
        }
    }

    const validate = () => {
        let newErrors = {};
        const aadharRegex = /^\d{12}$/;
        const contactRegex = /^\d{10}$/;
        // Example FSSAI regex (14 digits) - adjust if format is different
        const fssaiRegex = /^\d{14}$/;

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.aadhar || !aadharRegex.test(formData.aadhar)) newErrors.aadhar = "Valid 12-digit Aadhar Number is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.contact_no || !contactRegex.test(formData.contact_no)) newErrors.contact_no = "Valid 10-digit Contact Number is required";
        if (!formData.fssai.trim()) newErrors.fssai = "FSSAI License Number is required";
        else if (!fssaiRegex.test(formData.fssai)) newErrors.fssai = "Valid 14-digit FSSAI Number is required";

        setErrors(newErrors);
        console.log("Validation Errors:", newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkExistence = async (field, value, endpoint) => {
        console.log(`Checking ${field}:`, value);
        if (!value) return false; // Don't check if value is empty
    
        try {
            const response = await axios.post(`http://localhost:3000/api/vendor/vendor/${endpoint}`, {
                [field]: value,
            });
    
            console.log(`${field} API Response:`, response.data);
    
            // Expecting response like { exists: true/false }
            return response.data.exists || false;
    
        } catch (err) {
            console.error(`Error checking ${field}:`, err.response?.data || err.message);
    
            // Show a toast and prevent form submission
            toast.error(`${field} already taken`, { transition: Bounce });
    
            return 'error'; // Caller should handle this case
        }
    };


    const verify = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        if (!validate()) {
            toast.error("Please fix the errors in the form.", { transition: Bounce });
            return;
        }

        console.log("Form Data Before API Calls:", formData);

        try {
             // Perform checks concurrently
            const results = await Promise.all([
                checkExistence("username", formData.username, "checkusername"),
                checkExistence("aadhar", formData.aadhar, "checkaadhar"),
                checkExistence("contact_no", formData.contact_no, "checkcontact"),
                checkExistence("fssai", formData.fssai, "checkfssai"), // Changed field and endpoint
            ]);

            const [usernameExists, aadharExists, contactExists, fssaiExists] = results;

            // If any check resulted in an error, stop
            if (results.includes('error')) {
                 console.error("Error occurred during existence checks. Aborting submission.");
                 return; // Toast message already shown in checkExistence
            }

            let newErrors = {};
            if (usernameExists) newErrors.username = "Username already exists";
            if (aadharExists) newErrors.aadhar = "Aadhar number already registered";
            if (contactExists) newErrors.contact_no = "Contact number already registered";
            if (fssaiExists) newErrors.fssai = "FSSAI number already registered"; // Updated error message

            setErrors(newErrors);
            console.log("Errors after checking existence:", newErrors);

            if (Object.keys(newErrors).length > 0) {
                toast.error("Some details are already registered. Please check the highlighted fields.", { transition: Bounce });
                return;
            }

            // ---- Submission ----
            console.log("Submitting data:", formData);
            toast.info("Registering...", { autoClose: 1500, transition: Bounce });

            // *** IMPORTANT: Update API path to vendor add endpoint ***
            await axios.post("http://localhost:3000/api/vendor/add", formData);

            toast.success("Registration Successful! Redirecting to Dashboard...", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                 // *** IMPORTANT: Update redirect path to vendor login ***
                onClose: () => navigate("/vendor/dashboard")
            });
            
        } catch (err) {
            console.error("Error during vendor signup:", err.response?.data || err.message || err);
            const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errorMsg, { transition: Bounce });
            if (err.response?.data?.errors) {
                setErrors(prev => ({ ...prev, ...err.response.data.errors }));
            }
        }
    };


    return (
        <>
            <style>{styles}</style>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
             />
             <div className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8">
                        <div className="card shadow p-4 p-md-5 card-signup">
                            <h3 className="text-center mb-4">Vendor Registration</h3>
                            <form onSubmit={verify} noValidate>
                                <div className="row">
                                    {/* Name */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="nameInput" className="form-label">Business/Owner Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="nameInput"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    {/* Username */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="usernameInput" className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                            id="usernameInput"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Password */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="passwordInput" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="passwordInput"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>

                                    {/* Aadhar Number */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="aadharInput" className="form-label">Aadhar Number (Owner)</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={`form-control ${errors.aadhar ? 'is-invalid' : ''}`}
                                            id="aadharInput"
                                            name="aadhar"
                                            value={formData.aadhar}
                                            onChange={handleChange}
                                            maxLength="12"
                                            required
                                        />
                                        {errors.aadhar && <div className="invalid-feedback">{errors.aadhar}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    {/* FSSAI ID */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="fssaiInput" className="form-label">FSSAI License No.</label>
                                        <input
                                            type="text" // Keep as text
                                            inputMode="numeric"
                                            className={`form-control ${errors.fssai ? 'is-invalid' : ''}`}
                                            id="fssaiInput"
                                            name="fssai"
                                            value={formData.fssai}
                                            onChange={handleChange}
                                            maxLength="14" // FSSAI is 14 digits
                                            required
                                        />
                                        {errors.fssai && <div className="invalid-feedback">{errors.fssai}</div>}
                                    </div>

                                     {/* Contact Number */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="contactInput" className="form-label">Contact Number</label>
                                        <input
                                            type="tel"
                                            inputMode="numeric"
                                            className={`form-control ${errors.contact_no ? 'is-invalid' : ''}`}
                                            id="contactInput"
                                            name="contact_no"
                                            value={formData.contact_no}
                                            onChange={handleChange}
                                            maxLength="10"
                                            required
                                        />
                                        {errors.contact_no && <div className="invalid-feedback">{errors.contact_no}</div>}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="mb-3">
                                    <label htmlFor="addressInput" className="form-label">Business Address</label>
                                    <textarea
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        id="addressInput"
                                        name="address"
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                </div>

                                <div className="row">
                                     {/* State */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="stateSelect" className="form-label">State</label>
                                        <select
                                            className={`form-select ${errors.state ? 'is-invalid' : ''}`}
                                            id="stateSelect"
                                            name="state"
                                            value={formData.state || ""}
                                            onChange={handleStateChange}
                                            required
                                        >
                                            <option value="" disabled>Select State...</option>
                                            {Object.keys(indianStates).sort().map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                                    </div>

                                    {/* City */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="citySelect" className="form-label">City / District</label>
                                        <select
                                            className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                                            id="citySelect"
                                            name="city"
                                            value={formData.city || ""}
                                            onChange={handleCityChange}
                                            required
                                            disabled={!formData.state}
                                        >
                                            <option value="" disabled>
                                                {formData.state ? "Select City..." : "Select State First..."}
                                            </option>
                                            {formData.state &&
                                                indianStates[formData.state] &&
                                                [...indianStates[formData.state]].sort().map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                        </select>
                                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-signup w-100 mt-4">
                                    Sign Up
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VendorSignup;