import { faTruckFieldUn } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boolAtom } from './Loged';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FarmerAtom } from './farmerAtom';
import { API_BASE_URL } from '../config';

// STATE-DATA
const stateData = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "Guntur", "Kadapa", "Krishna", "Nellore", "East Godavari", "West Godavari", "Srikakulam", "Vizianagaram", "Visakhapatnam"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat", "Bomdila", "Naharlagun", "Changlang", "Anjaw", "Kurung Kumey", "Lohit"],
    "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Tezpur", "Jorhat", "Bongaigaon", "Nagaon", "Karimganj", "Hailakandi", "Dhemaji"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Munger", "Nalanda", "Jehanabad", "Saran"],
    "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba", "Rajnandgaon", "Jagdalpur", "Kanker", "Surguja", "Janjgir-Champa", "Dhamtari"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Quepem", "Sanguem", "Canacona", "Salcete", "Bardez"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Junagadh", "Bhavnagar", "Mehsana", "Patan", "Porbandar"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Karnal", "Yamunanagar", "Jind", "Rohtak", "Sonipat"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Kullu", "Solan", "Mandi", "Kangra", "Bilaspur", "Hamirpur", "Una"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Dumka", "Chatra", "Pakur"],
    "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Udupi", "Hubli", "Dharwad", "Bellary", "Shimoga", "Chikmagalur", "Raichur"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Alappuzha", "Kollam", "Palakkad", "Kannur", "Wayanad", "Idukki"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Satna", "Rewa", "Burhanpur", "Mandsaur"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Kolhapur", "Jalgaon", "Amravati", "Solapur"],
    "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Bishnupur", "Kakching", "Senapati", "Tamenglong", "Ukhrul", "Jiribam", "Kangpokpi"],
    "Meghalaya": ["Shillong", "Tura", "Nongpoh", "Jowai", "Williamnagar", "Brihat", "Mairang", "Nongstoin", "Bholaganj", "Mawkyrwat"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Mamit", "Saiha", "Hnahthial", "Lawngtlai", "Lunglei"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Peren", "Zunheboto", "Mon", "Longleng", "Kiphire"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Berhampur", "Sambalpur", "Balasore", "Koraput", "Ganjam", "Khurda"],
    "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali", "Hoshiarpur", "Rupnagar", "Fatehgarh Sahib", "Bathinda"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Sikar", "Pali", "Churu"],
    "Sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan", "Rangpo", "Yuksom", "Khamdong", "Tadong", "Pakyong", "Lachung"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Thanjavur", "Vellore", "Erode", "Kanchipuram"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Mahbubnagar", "Nalgonda", "Medak", "Rangareddy", "Adilabad"],
    "Tripura": ["Agartala", "Udaipur", "Kailashahar", "Dharmanagar", "Ambassa", "Khowai", "Belonia", "Sepahijala", "North Tripura", "South Tripura"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Aligarh", "Ghaziabad", "Bareilly", "Moradabad", "Firozabad"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Roorkee", "Udham Singh Nagar", "Tehri Garhwal", "Pauri Garhwal", "Champawat", "Bageshwar", "Pithoragarh"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Kharagpur", "Burdwan", "Malda", "Jalpaiguri", "Medinipur"],
    "Andaman and Nicobar Islands": ["Port Blair", "Car Nicobar", "Havelock Island", "Diglipur", "Mayabunder", "Little Andaman", "Nicobar", "South Andaman", "North Andaman", "Middle Andaman"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott", "Kalapeni", "Suheli Par", "Maliku Atoll", "Viringili", "Cheriyam"],
    "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "East Delhi", "North Delhi", "West Delhi", "North East Delhi", "North West Delhi", "South West Delhi", "Shahdara"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
    "Ladakh": ["Leh", "Kargil"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Pulwama", "Kathua", "Doda", "Udhampur", "Rajouri", "Poonch"]
};

// CUSTOM DROP-DROP
const CustomDropdown = ({ items, onSelect, placeholder, searchValue, onSearch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const handleItemClick = (item) => {
        onSelect(item);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
                <ul className="absolute bottom-11 left-0 w-full border bg-white shadow-lg mt-1 rounded-md max-h-60 overflow-auto">
                    {items.length === 0 ? (
                        <li className="px-4 py-2 text-gray-500">No results</li>
                    ) : (
                        items.map((item) => (
                            <li
                                key={item}
                                onClick={() => handleItemClick(item)}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            >
                                {item}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

// SIGN-UP-COMPONENT
const SignUpComponent = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [farmName, setFarmName] = useState('')
    // const [farmLocation,setFarmLocation] = useState([])
    const [error, setError] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPass, setErrorPass] = useState('');
    const [pincode, setPincode] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [stateSearch, setStateSearch] = useState('');
    const [districtSearch, setDistrictSearch] = useState('');
    const [filteredStates, setFilteredStates] = useState(Object.keys(stateData));
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [state, setState] = useState(false)
    const [dist, setDist] = useState(false)
    const Navigate = useNavigate()
    const [isFarmer, setIsFarmer] = useState(true);
    
    
    const [phoneError, setPhoneError] = useState('');
    const [phoneVerifyError, setPhoneVerifyError] = useState('');
    const [phoneNumber,setPhoneNumber] = useState("")
    const [usernameU, setUsernameU] = useState('')
    const [passwordU, setPasswordU] = useState('')
    const [firstNameU, setFirstNameU] = useState('')
    const [lastNameU, setLastNameU] = useState('')
    const [errorU, setErrorU] = useState('');
    const [errorEmailU, setErrorEmailU] = useState('');
    const [errorPassU, setErrorPassU] = useState('');
    const [phoneErrorU, setPhoneErrorU] = useState('');
    const [pincodeU, setPincodeU] = useState('');
    const [selectedStateU, setSelectedStateU] = useState('');
    const [selectedDistrictU, setSelectedDistrictU] = useState('');
    const [stateSearchU, setStateSearchU] = useState('');
    const [districtSearchU, setDistrictSearchU] = useState('');
    const [filteredStatesU, setFilteredStatesU] = useState(Object.keys(stateData));
    const [filteredDistrictsU, setFilteredDistrictsU] = useState([]);
    const [stateU, setStateU] = useState(false)
    const [distU, setDistU] = useState(false)

    // IF SIGNED IN THEN CLEAN FROM THE HEADER SIGNUP AND LOGIN TAG--
    const setMyBoolean = useSetRecoilState(boolAtom);
    const bool = useRecoilValue(boolAtom)
    const setMyType = useSetRecoilState(FarmerAtom);
    const typwBool = useRecoilValue(FarmerAtom)

    const toggleBoolean = () => {
        // console.log(bool)
        setMyBoolean(prev => !prev);
        // console.log(bool)
    };
    const toggleType = () => {
        // console.log(bool)
        setMyType(true);
        // console.log(bool)
    };

    const HandleSubmit = async () => {

        try {
            if (username == "" || password == "" || firstName == "" || lastName == "" || farmName == "" || pincode == "" || selectedState == "" || selectedDistrict == "") {
                console.log("fill full form Properly")
                alert("Fill the Form Properly!!")
            } else {

                fetch(`${API_BASE_URL}/sign`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: username,
                        password: password,
                        firstName: firstName,
                        lastName: lastName,
                        farmName: farmName,
                        // orderHistory: ,
                        expenditure: 0,
                        income: 0,
                        profit: 0,
                        loss: 0,
                        farmLocation: [{
                            pincode: parseInt(pincode, 10), // Ensure pincode is an integer
                            state: selectedState,
                            district: selectedDistrict
                        }]
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(async function (res) {
                        if (res) {
                            const js = await res.json()
                            const { token } = js
                            console.log("JS", js)
                            toggleType()
                            toggleBoolean()  // Call function Toggle to make TRUE & unseen Signup And LOgin tag
                            Navigate('/')
                            console.log(js.farmerId)
                            console.log(js.token)
                            localStorage.setItem('FarmerId', js.farmerId)
                            localStorage.setItem('token', `Bearer ${js.token}`);
                        }
                        else {
                            alert("Fill the form Properly")
                            console.log("not signup")
                        }
                    })
            }

        } catch (err) {
            console.log("ERR", err)
            alert('Error in Fetching')
        }


    };
    // USER SUBMIT
    const HandleSubmitU = async () => {
        try {
            if (usernameU == "" || passwordU == "" || firstNameU == "" || lastNameU == "" || phoneNumber == "" || pincodeU == "" || selectedStateU == "" || selectedDistrictU == "") {
                console.log("fill full form Properly")
                toast.error("Fill the Form Properly!!")
            } else {
                // const present = await axios.get(`${API_BASE_URL}/getUSERS`)
                // if(present){
                //     return toast.error("Already registered Email") 
                // }
                const response = await axios.post(`${API_BASE_URL}/signUpUSER`,{
                    username: usernameU,
                    password: passwordU,
                    firstName: firstNameU,
                    lastName: lastNameU,
                    phoneNumber: phoneNumber,
                    address: [{
                        pincode: parseInt(pincodeU, 10), // Ensure pincode is an integer
                        state: selectedStateU,
                        district: selectedDistrictU
                    }]
                })
                if (response.status === 200) {
                    console.log(response.data.UserId)
                    console.log(response.data.token)
                    localStorage.setItem('UserId', response.data.UserId)
                    localStorage.setItem('token', `Bearer ${response.data.token}`);
                    toggleBoolean()  // Call function Toggle to make TRUE & unseen Signup And LOgin tag
                    Navigate('/')
                }
                else {
                    toast.error("Not Signed!")
                    console.log("not signup")
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                toast.error("Email already registered"); // Handle specific error
                // console.log("Email already registered");
            } else {
                toast.error('Error in Fetching');
                console.log("Error:", err);
            }
        }
    };

    ////PINCODE
    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value)) { // Validate input to ensure it has at most 6 digits
            setPincode(value);
            setError((value.length === 6 || value.length === 0) ? '' : 'Pincode must be 6 digits long');
        }
        else {
            setError('Invalid pincode');
        }
    };
    const handleChangeU = (e) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value)) { // Validate input to ensure it has at most 6 digits
            setPincodeU(value);
            setErrorU((value.length === 6 || value.length === 0) ? '' : 'Pincode must be 6 digits long');
        }
        else {
            setErrorU('Invalid pincode');
        }
    };
    const handleChangeEmail = (e) => {
        const value = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for basic email validation

        // // Validate input to ensure it matches the email format
        setUsername(value);
        if (emailRegex.test(value)) {
            setErrorEmail(''); // Clear error if the email is valid
        } else if (value == "") {
            setErrorEmail('')
        }
        else {
            setErrorEmail('Invalid email address');
        }
    };
    const handleChangeEmailU = (e) => {
        const value = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for basic email validation

        // // Validate input to ensure it matches the email format
        setUsernameU(value);
        if (emailRegex.test(value)) {
            setErrorEmailU(''); // Clear error if the email is valid
        } else if (value == "") {
            setErrorEmailU('')
        }
        else {
            setErrorEmailU('Invalid email address');
        }
    };

    const handleChangePassword = (e) => {
        const value = e.target.value;
        const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/~`-]{0,6}$/; // Allows up to 8 alphanumeric or special characters

        // Validate input to ensure it is 8 characters long and contains allowed characters
        if (passwordRegex.test(value)) {
            setPassword(value);
            if (value.length === 6) {
                setErrorPass('');
            } else if (value == "") {
                setErrorPass("")
            }
            else {
                setErrorPass('Password must be exactly 6 characters long');
            }
        } else {
            setErrorPass('');
        }
    }
    const handleChangePasswordU = (e) => {
        const value = e.target.value;
        const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/~`-]{0,6}$/; // Allows up to 8 alphanumeric or special characters

        // Validate input to ensure it is 8 characters long and contains allowed characters
        if (passwordRegex.test(value)) {
            setPasswordU(value);
            if (value.length === 6) {
                setErrorPassU('');
            } else if (value == "") {
                setErrorPassU("")
            }
            else {
                setErrorPassU('Password must be exactly 6 characters long');
            }
        } else {
            setErrorPassU('');
        }
    }

    //LOCATION
    useEffect(() => {
        setFilteredStates(Object.keys(stateData).filter(state =>
            state.toLowerCase().includes(stateSearch.toLowerCase())
        ));
    }, [stateSearch]);
    // USER----
    useEffect(() => {
        setFilteredStatesU(Object.keys(stateData).filter(state =>
            state.toLowerCase().includes(stateSearchU.toLowerCase())
        ));
    }, [stateSearchU]);

    useEffect(() => {
        if (selectedState) {
            setFilteredDistricts(stateData[selectedState].filter(district =>
                district.toLowerCase().includes(districtSearch.toLowerCase())
            ));
        } else {
            setFilteredDistricts([]);
        }
    }, [selectedState, districtSearch]);
    // USER----
    useEffect(() => {
        if (selectedStateU) {
            setFilteredDistrictsU(stateData[selectedStateU].filter(district =>
                district.toLowerCase().includes(districtSearchU.toLowerCase())
            ));
        } else {
            setFilteredDistrictsU([]);
        }
    }, [selectedStateU, districtSearchU]);

    const handleStateSelect = (state) => {
        setSelectedState(state);
        setStateSearch(''); // Clear search input when state is selected
        setState(true)
    };
    // USER---
    const handleStateSelectU = (stateU) => {
        setSelectedStateU(stateU);
        setStateSearchU(''); // Clear search input when state is selected
        setStateU(true)
    };

    const handleDistrictSelect = (district) => {
        setSelectedDistrict(district);
        setDist(true)
    };
    /// USER---
    const handleDistrictSelectU = (districtU) => {
        setSelectedDistrictU(districtU);
        setDistU(true)
    };

    const handleSwitch = () => {
        setIsFarmer(!isFarmer);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        const regex = /^[6-9]\d{9}$/;

        if (numericValue.length <= 10) {
            const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        const regex = /^[6-9]\d{9}$/;

        if (numericValue.length <= 10) {
            if (numericValue.length === 10) {
                if (regex.test(numericValue)) {
                    setPhoneVerifyError('Verified')
                    setTimeout(()=>{
                        setPhoneVerifyError(''); // Clear error if the input is valid
                        setPhoneVerifyError(''); // Clear error if the input is valid
                    },3000)
                } else {
                    setPhoneError('Phone number must be a 10-digit number starting with 6, 7, 8, or 9');
                }
            } else {
                setPhoneError(''); // Clear error if less than 10 digits
            }
            
            setPhoneNumber(numericValue); // Update phone number with numeric value
        }
        }
    }

    return (
        <>
        <div className=' max-h-screen overflow-y-auto mb-2'>
            <div className=" relative flex h-screen overflow-hidden bg-gray-100">
                <div
                    className={` absolute inset-0 flex justify-center items-center transition-transform duration-700 ease-in-out ${isFarmer ? 'translate-x-0' : '-translate-x-full'
                        } bg-gray-100 shadow-lg p-8`}
                >
                    <div className=" flex items-center justify-center min-h-screen bg-gray-100  p-4 pt-0">
                        <div className="h-full w-full max-w-md px-8 py-4 bg-white shadow-md rounded-lg space-y-0">
                        <div className='w-full h-12 flex justify-center content-center'>
                            <h2 className=" text-3xl font-semibold text-center text-blue-600 mb-2">Sign Up <span className='text-sm text-gray-400 '>as farmer</span></h2>
                                
                            <img className='bg-blue-400 relative left-1 -top-2 h-16 w-16 rounded-full border-0 border-blue-200'
                                src='data:image/jpeg;base64,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'
                                alt='Farmer Icon'
                            ></img>
                        </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <div className="space-y-3">
                                <div className='flex text-sm items-center justify-center gap-4'>
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={handleSwitch}
                                    >
                                        Switch to User Signup!
                                    </button>
                                    <p className='m-2'>Already Have Account ? <a href='/login' className='text-blue-600 font-medium hover:underline'>Login</a></p>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={handleChangeEmail}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errorEmail && <p className="mx-2 text-red-500 text-sm">{errorEmail}</p>}
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={handleChangePassword}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errorPass && <p className="px-2 text-red-500 text-sm">{errorPass}</p>}
                                </div>
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        placeholder="FirstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="flex-1 w-20 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="LastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="flex-1 w-20 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="FarmName"
                                        value={farmName}
                                        onChange={(e) => setFarmName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <p className="text-gray-700">Farm Location:</p>

                                    <div className="max-w-md mx-auto px-4 py-2 bg-white shadow-md rounded-md space-y-4">
                                        <label htmlFor="pincode" className="block text-gray-700 font-semibold">
                                            Pincode:
                                        </label>
                                        <input
                                            key={"12"}
                                            type="text"
                                            id="pincode"
                                            value={pincode}
                                            onChange={handleChange}
                                            placeholder="Enter 6-digit pincode"
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                                }`}
                                            maxLength="6"
                                            pattern="\d{6}"
                                            title="Pincode must be a 6-digit number"
                                        />
                                        {error && <p className="text-red-500 text-sm">{error}</p>}
                                    </div>

                                    <form className=" max-w-lg mx-auto p-4 bg-white shadow-md rounded-md space-y-6">

                                        <div className='flex'>
                                            <div className="space-y-2">
                                                <label htmlFor="state" className="block text-gray-700 font-semibold">
                                                    State:
                                                </label>
                                                <CustomDropdown
                                                    items={filteredStates}
                                                    onSelect={handleStateSelect}
                                                    placeholder={`${state ? selectedState : "select state"}`}
                                                    searchValue={stateSearch}
                                                    onSearch={setStateSearch}
                                                />
                                            </div>


                                            <div className="space-y-2">
                                                <label htmlFor="district" className="block text-gray-700 font-semibold">
                                                    District:
                                                </label>
                                                <CustomDropdown
                                                    items={filteredDistricts}
                                                    onSelect={handleDistrictSelect}
                                                    placeholder={`${dist ? selectedDistrict : "select state"}`}
                                                    searchValue={districtSearch}
                                                    onSearch={setDistrictSearch}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <button
                                    className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    onClick={HandleSubmit}
                                >
                                    Sign Up <span className='text-sm font-normal text-gray-200'>as farmer</span>
                                </button>
                                {/* <p className='m-2 '>Already Have Account ? <a href='/login' className='text-blue-600 font-medium hover:underline'>Login</a></p> */}
                            </div>
                        </div>
                    </div>

                </div>
            
            
                {/* AS USER----- */}
            <div
                className={`absolute inset-0 flex justify-center items-center transition-transform duration-700 ease-in-out ${isFarmer ? 'translate-x-full' : 'translate-x-0'
                    } bg-gray-100 shadow-lg p-8`}
                >
                <div className=" flex items-center justify-center min-h-screen bg-gray-100  p-4 pt-0">
                        <div className="h-full w-full max-w-md px-8 py-4 bg-white shadow-md rounded-lg space-y-0">
                        <div className='w-full h-12 flex justify-center content-center'>
                            <h2 className=" text-3xl font-semibold text-center text-blue-600 mb-2">Sign Up <span className='text-sm text-gray-400 '>as User</span></h2>
                                
                            <img className='bg-blue-400 relative left-1 -top-1 h-12 w-12 rounded-full border-0 border-blue-200'
                               src='data:image/png;base64,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'
                                alt='Farmer Icon'
                            ></img>
                        </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <div className="space-y-3">
                                <div className='flex text-sm items-center justify-center gap-4'>
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={handleSwitch}
                                    >
                                        Switch to Farmer Signup!
                                    </button>
                                    <p className='m-2'>Already Have Account ? <a href='/login' className='text-blue-600 font-medium hover:underline'>Login</a></p>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={usernameU}
                                        onChange={handleChangeEmailU}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errorEmailU && <p className="mx-2 text-red-500 text-sm">{errorEmailU}</p>}
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={passwordU}
                                        onChange={handleChangePasswordU}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errorPassU && <p className="px-2 text-red-500 text-sm">{errorPassU}</p>}
                                </div>
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        placeholder="FirstName"
                                        value={firstNameU}
                                        onChange={(e) => setFirstNameU(e.target.value)}
                                        className="flex-1 w-20 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="LastName"
                                        value={lastNameU}
                                        onChange={(e) => setLastNameU(e.target.value)}
                                        className="flex-1 w-20 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <input
                                        type='text'
                                        placeholder="PhoneNumber"
                                        value={phoneNumber}
                                        onChange={handlePhoneChange}
                                        maxLength="10"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {phoneError && <p className="px-2 text-red-500 text-sm">{phoneError}</p>}
                                    {phoneVerifyError && <p className="px-2 mt-1 text-green-500 text-sm">{phoneVerifyError}</p>}
                                </div>
                                <div>
                                    <p className="text-gray-700">Address:</p>

                                    <div className="max-w-md mx-auto px-4 py-2 bg-white shadow-md rounded-md space-y-4">
                                        <label htmlFor="pincode" className="block text-gray-700 font-semibold">
                                            Pincode:
                                        </label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            value={pincodeU}
                                            onChange={handleChangeU}
                                            placeholder="Enter 6-digit pincode"
                                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                                }`}
                                            maxLength="6"
                                            pattern="\d{6}"
                                            title="Pincode must be a 6-digit number"
                                        />
                                        {errorU && <p className="text-red-500 text-sm">{errorU}</p>}
                                    </div>

                                    <form className=" max-w-lg mx-auto p-4 bg-white shadow-md rounded-md space-y-6">

                                        <div className='flex'>
                                            <div className="space-y-2">
                                                <label htmlFor="state" className="block text-gray-700 font-semibold">
                                                    State:
                                                </label>
                                                <CustomDropdown
                                                    items={filteredStatesU}
                                                    onSelect={handleStateSelectU}
                                                    placeholder={`${stateU ? selectedStateU : "select state"}`}
                                                    searchValue={stateSearchU}
                                                    onSearch={setStateSearchU}
                                                />
                                            </div>


                                            <div className="space-y-2">
                                                <label htmlFor="district" className="block text-gray-700 font-semibold">
                                                    District:
                                                </label>
                                                <CustomDropdown
                                                    items={filteredDistrictsU}
                                                    onSelect={handleDistrictSelectU}
                                                    placeholder={`${distU ? selectedDistrictU : "select state"}`}
                                                    searchValue={districtSearchU}
                                                    onSearch={setDistrictSearchU}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <button
                                    className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    onClick={HandleSubmitU}
                                >
                                    Sign Up <span className='text-sm font-normal text-gray-200'>as user</span>
                                </button>
                                {/* <p className='m-2'>Already Have Account ? <a href='/login' className='text-blue-600 font-medium hover:underline'>Login</a></p> */}
                            </div>
                        </div>
    </div>
    </div>
    </div>
    </div>
    <Toaster/>
    </>
);
};



export default SignUpComponent;
