import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { boolAtom } from './Loged';
import { useSetRecoilState } from 'recoil';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FarmerAtom } from './farmerAtom';
import { API_BASE_URL } from '../config';
import {
  FaTractor,
  FaShoppingBag,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaCheckCircle,
  FaArrowRight,
  FaLeaf,
  FaChevronDown,
  FaStore,
  FaBoxes,
  FaTools,
  FaIdCard,
  FaFileContract
} from 'react-icons/fa';

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
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Mamit", "Saiha", "Hnahthial", "Lawngtlai"],
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
  "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "East Delhi", "North Delhi", "West Delhi", "North East Delhi", "North West Delhi", "South West Delhi", "Shahdara"],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Ladakh": ["Leh", "Kargil"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Pulwama", "Kathua", "Doda", "Udhampur", "Rajouri", "Poonch"]
};

// Modern Custom Searchable Dropdown
const CustomDropdown = ({ items, onSelect, placeholder, searchValue, onSearch, selectedValue }) => {
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
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between text-sm hover:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500 transition"
      >
        <span className={selectedValue ? "text-slate-800 font-medium truncate" : "text-slate-400 truncate"}>
          {selectedValue || placeholder}
        </span>
        <FaChevronDown className={`text-xs text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <FaSearch className="text-xs text-slate-400 ml-1" />
            <input
              type="text"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-transparent text-xs py-1 px-1 focus:outline-none text-slate-700"
              autoFocus
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1 divide-y divide-slate-50">
            {items.length === 0 ? (
              <li className="px-4 py-3 text-xs text-slate-400 text-center">No options found</li>
            ) : (
              items.map((item) => (
                <li
                  key={item}
                  onClick={() => handleItemClick(item)}
                  className={`px-4 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    selectedValue === item 
                      ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item}</span>
                  {selectedValue === item && <FaCheckCircle className="text-emerald-600 text-xs" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const SignUpComponent = () => {
  const [searchParams] = useSearchParams();
  const urlRole = searchParams.get('role');
  // 'farmer' | 'buyer' | 'kendra'
  const [activeRole, setActiveRole] = useState(
    urlRole === 'kendra' ? 'kendra' : urlRole === 'buyer' ? 'buyer' : 'farmer'
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Farmer form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [filteredStates, setFilteredStates] = useState(Object.keys(stateData));
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPass, setErrorPass] = useState('');
  const [pincodeError, setPincodeError] = useState('');

  // User form state
  const [usernameU, setUsernameU] = useState('');
  const [passwordU, setPasswordU] = useState('');
  const [firstNameU, setFirstNameU] = useState('');
  const [lastNameU, setLastNameU] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneVerify, setPhoneVerify] = useState('');
  const [pincodeU, setPincodeU] = useState('');
  const [selectedStateU, setSelectedStateU] = useState('');
  const [selectedDistrictU, setSelectedDistrictU] = useState('');
  const [stateSearchU, setStateSearchU] = useState('');
  const [districtSearchU, setDistrictSearchU] = useState('');
  const [filteredStatesU, setFilteredStatesU] = useState(Object.keys(stateData));
  const [filteredDistrictsU, setFilteredDistrictsU] = useState([]);
  const [errorEmailU, setErrorEmailU] = useState('');
  const [errorPassU, setErrorPassU] = useState('');
  const [pincodeErrorU, setPincodeErrorU] = useState('');

  // Kendra / Supplier form state
  const [kendraName, setKendraName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [emailK, setEmailK] = useState('');
  const [passwordK, setPasswordK] = useState('');
  const [phoneK, setPhoneK] = useState('');
  const [phoneErrorK, setPhoneErrorK] = useState('');
  const [isDualFarmer, setIsDualFarmer] = useState(true);
  const [supplierType, setSupplierType] = useState('Kisan Seva Kendra (Full Service)');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [pincodeK, setPincodeK] = useState('');
  const [selectedStateK, setSelectedStateK] = useState('');
  const [selectedDistrictK, setSelectedDistrictK] = useState('');
  const [stateSearchK, setStateSearchK] = useState('');
  const [districtSearchK, setDistrictSearchK] = useState('');
  const [filteredStatesK, setFilteredStatesK] = useState(Object.keys(stateData));
  const [filteredDistrictsK, setFilteredDistrictsK] = useState([]);
  const [errorEmailK, setErrorEmailK] = useState('');
  const [errorPassK, setErrorPassK] = useState('');
  const [pincodeErrorK, setPincodeErrorK] = useState('');

  const navigate = useNavigate();
  const setMyBoolean = useSetRecoilState(boolAtom);
  const setMyType = useSetRecoilState(FarmerAtom);

  const toggleBoolean = () => {
    setMyBoolean(true);
  };

  const toggleType = (isFarmOrKendra = true) => {
    setMyType(isFarmOrKendra);
  };

  // Farmer State filtering
  useEffect(() => {
    setFilteredStates(
      Object.keys(stateData).filter(state =>
        state.toLowerCase().includes(stateSearch.toLowerCase())
      )
    );
  }, [stateSearch]);

  // Buyer State filtering
  useEffect(() => {
    setFilteredStatesU(
      Object.keys(stateData).filter(state =>
        state.toLowerCase().includes(stateSearchU.toLowerCase())
      )
    );
  }, [stateSearchU]);

  // Kendra State filtering
  useEffect(() => {
    setFilteredStatesK(
      Object.keys(stateData).filter(state =>
        state.toLowerCase().includes(stateSearchK.toLowerCase())
      )
    );
  }, [stateSearchK]);

  // Farmer District filtering
  useEffect(() => {
    if (selectedState && stateData[selectedState]) {
      setFilteredDistricts(
        stateData[selectedState].filter(dist =>
          dist.toLowerCase().includes(districtSearch.toLowerCase())
        )
      );
    } else {
      setFilteredDistricts([]);
    }
  }, [selectedState, districtSearch]);

  // Buyer District filtering
  useEffect(() => {
    if (selectedStateU && stateData[selectedStateU]) {
      setFilteredDistrictsU(
        stateData[selectedStateU].filter(dist =>
          dist.toLowerCase().includes(districtSearchU.toLowerCase())
        )
      );
    } else {
      setFilteredDistrictsU([]);
    }
  }, [selectedStateU, districtSearchU]);

  // Kendra District filtering
  useEffect(() => {
    if (selectedStateK && stateData[selectedStateK]) {
      setFilteredDistrictsK(
        stateData[selectedStateK].filter(dist =>
          dist.toLowerCase().includes(districtSearchK.toLowerCase())
        )
      );
    } else {
      setFilteredDistrictsK([]);
    }
  }, [selectedStateK, districtSearchK]);

  // Email validations
  const handleChangeEmail = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setUsername(value);
    if (!value || emailRegex.test(value)) setErrorEmail('');
    else setErrorEmail('Please enter a valid email address');
  };

  const handleChangeEmailU = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setUsernameU(value);
    if (!value || emailRegex.test(value)) setErrorEmailU('');
    else setErrorEmailU('Please enter a valid email address');
  };

  const handleChangeEmailK = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailK(value);
    if (!value || emailRegex.test(value)) setErrorEmailK('');
    else setErrorEmailK('Please enter a valid official email address');
  };

  // Password validations
  const handleChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!value || value.length >= 6) setErrorPass('');
    else setErrorPass('Password must be at least 6 characters');
  };

  const handleChangePasswordU = (e) => {
    const value = e.target.value;
    setPasswordU(value);
    if (!value || value.length >= 6) setErrorPassU('');
    else setErrorPassU('Password must be at least 6 characters');
  };

  const handleChangePasswordK = (e) => {
    const value = e.target.value;
    setPasswordK(value);
    if (!value || value.length >= 6) setErrorPassK('');
    else setErrorPassK('Password must be at least 6 characters');
  };

  // Phone Validation
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setPhoneNumber(val);
      if (val.length === 10) {
        setPhoneError('');
        setPhoneVerify('Valid 10-digit number');
      } else if (val.length > 0) {
        setPhoneError('Must be exactly 10 digits');
        setPhoneVerify('');
      } else {
        setPhoneError('');
        setPhoneVerify('');
      }
    }
  };

  // Pincode validations
  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 6) {
      setPincode(val);
      if (val.length === 6) setPincodeError('');
      else if (val.length > 0) setPincodeError('Pincode must be 6 digits');
      else setPincodeError('');
    }
  };

  const handlePincodeChangeU = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 6) {
      setPincodeU(val);
      if (val.length === 6) setPincodeErrorU('');
      else if (val.length > 0) setPincodeErrorU('Pincode must be 6 digits');
      else setPincodeErrorU('');
    }
  };

  const handlePincodeChangeK = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 6) {
      setPincodeK(val);
      if (val.length === 6) setPincodeErrorK('');
      else if (val.length > 0) setPincodeErrorK('Pincode must be 6 digits');
      else setPincodeErrorK('');
    }
  };

  const handlePhoneChangeK = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setPhoneK(val);
      if (val.length === 10 || val.length === 0) {
        setPhoneErrorK('');
      } else {
        setPhoneErrorK('Must be 10 digits');
      }
    }
  };

  // Farmer Submit
  const handleFarmerSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username || !password || !firstName || !lastName || !farmName || !pincode || !selectedState || !selectedDistrict) {
      toast.error("Please fill in all the details!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/sign`, {
        method: 'POST',
        body: JSON.stringify({
          email: username,
          password: password,
          firstName: firstName,
          lastName: lastName,
          farmName: farmName,
          expenditure: 0,
          income: 0,
          profit: 0,
          loss: 0,
          farmLocation: [{
            pincode: parseInt(pincode, 10),
            state: selectedState,
            district: selectedDistrict
          }]
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const js = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success("Farmer account created successfully!");
        toggleType(true);
        toggleBoolean();
        if (js.farmerId) localStorage.setItem('FarmerId', js.farmerId);
        if (js.token) localStorage.setItem('token', `Bearer ${js.token}`);
        localStorage.setItem('role', 'Farmer');
        navigate('/');
      } else {
        toast.error(js.error || "Failed to create account. Please check details.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Farmer signup error:", err);
      toast.error('Network or server error during sign up');
    }
  };

  // Buyer Submit
  const handleUserSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!usernameU || !passwordU || !firstNameU || !lastNameU || !phoneNumber || !pincodeU || !selectedStateU || !selectedDistrictU) {
      toast.error("Please fill in all the details!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/signUpUSER`, {
        username: usernameU,
        password: passwordU,
        firstName: firstNameU,
        lastName: lastNameU,
        phoneNumber: phoneNumber,
        address: [{
          pincode: parseInt(pincodeU, 10),
          state: selectedStateU,
          district: selectedDistrictU
        }]
      });
      setLoading(false);

      if (response.status === 200 || response.status === 201) {
        toast.success("Account created successfully!");
        if (response.data.UserId) localStorage.setItem('UserId', response.data.UserId);
        if (response.data.token) localStorage.setItem('token', `Bearer ${response.data.token}`);
        localStorage.setItem('role', 'Customer');
        toggleType(false);
        toggleBoolean();
        navigate('/');
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 400) {
        toast.error("Email or Username already registered");
      } else {
        toast.error('Error connecting to server');
        console.error("User signup error:", err);
      }
    }
  };

  // Kisan Seva Kendra / Supplier Submit
  const handleKendraSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!kendraName || !emailK || !passwordK || !selectedStateK || !selectedDistrictK || !pincodeK) {
      toast.error("Please fill in all required Kendra details!");
      return;
    }
    if (errorEmailK || errorPassK || pincodeErrorK) {
      toast.error("Please resolve validation errors first!");
      return;
    }

    try {
      setLoading(true);

      const parseSafeJson = async (res) => {
        try {
          const text = await res.text();
          return JSON.parse(text);
        } catch (_) {
          return { error: `Server error (${res.status}): ${res.statusText || 'Unexpected response'}` };
        }
      };

      // 1. First attempt /signSupplier
      let response = await fetch(`${API_BASE_URL}/signSupplier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kendraName,
          ownerName: ownerName || kendraName,
          email: emailK.trim().toLowerCase(),
          password: passwordK,
          phoneNumber: phoneK,
          supplierType,
          licenseNumber,
          isDualFarmer,
          pincode: pincodeK,
          state: selectedStateK,
          district: selectedDistrictK
        })
      });

      // 2. If the deployed server returns 404 (route not yet deployed on Render), seamlessly fall back to /sign
      if (response.status === 404) {
        response = await fetch(`${API_BASE_URL}/sign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailK.trim().toLowerCase(),
            password: passwordK,
            firstName: ownerName || kendraName,
            lastName: `(Kendra - ${supplierType || 'Supplier'})`,
            farmName: kendraName,
            expenditure: 0,
            income: 0,
            profit: 0,
            loss: 0,
            farmLocation: [{
              pincode: parseInt(pincodeK, 10) || 110001,
              state: selectedStateK,
              district: selectedDistrictK
            }]
          })
        });
      }

      const data = await parseSafeJson(response);
      setLoading(false);

      if (response.ok) {
        toast.success("Kisan Seva Kendra registered successfully! 🏪");
        if (data.token) localStorage.setItem('token', `Bearer ${data.token}`);
        const supplierId = data.farmerId || data.userId || (data.user && data.user._id);
        if (supplierId) localStorage.setItem('FarmerId', supplierId);
        localStorage.setItem('role', 'Supplier');
        localStorage.setItem('kendraName', kendraName);
        if (isDualFarmer) {
          localStorage.setItem('isDualFarmer', 'true');
        }
        localStorage.setItem('activeMode', 'kendra');

        toggleType(true);
        toggleBoolean();
        navigate('/dashboard');
      } else {
        toast.error(data.error || data.msg || "Failed to register Kendra. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Kendra signup error:", err);
      toast.error('Network or server error during registration');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 py-10 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-4">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 px-6 sm:px-10 py-8 text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-emerald-100 mb-2">
                <FaLeaf className="text-emerald-300" /> Join India's Agri Network
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Create Your AgriConnect Account
              </h1>
              <p className="text-emerald-100/90 text-sm mt-1">
                Direct trade, farm supplies, equipment inventory, and fair market analytics.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-emerald-200">Already registered?</span>
              <div>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 mt-1 rounded-xl bg-white text-emerald-800 font-semibold text-xs sm:text-sm hover:bg-emerald-50 transition shadow-sm"
                >
                  <span>Sign In</span>
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Role Toggle Switcher (3 options) */}
        <div className="p-6 sm:px-10 pb-0">
          <div className="grid grid-cols-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/60 max-w-xl mx-auto gap-1">
            <button
              type="button"
              onClick={() => setActiveRole('farmer')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeRole === 'farmer'
                  ? 'bg-white text-emerald-700 shadow-md border border-slate-200/40'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaTractor className={activeRole === 'farmer' ? 'text-emerald-600' : 'text-slate-400'} />
              <span>Farmer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('buyer')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeRole === 'buyer'
                  ? 'bg-white text-emerald-700 shadow-md border border-slate-200/40'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaShoppingBag className={activeRole === 'buyer' ? 'text-emerald-600' : 'text-slate-400'} />
              <span>Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('kendra')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeRole === 'kendra'
                  ? 'bg-white text-teal-800 shadow-md border border-teal-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaStore className={activeRole === 'kendra' ? 'text-teal-600' : 'text-slate-400'} />
              <span className="truncate">Kisan Seva Kendra</span>
            </button>
          </div>

          {/* Role Guidance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 max-w-2xl mx-auto">
            <div 
              onClick={() => setActiveRole('farmer')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                activeRole === 'farmer' 
                  ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm' 
                  : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900 mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px]">🚜</span>
                Farmer Account
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                For crop producers. Sell harvests, view mandi rates & order supplies from local Kendras.
              </p>
            </div>

            <div 
              onClick={() => setActiveRole('buyer')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                activeRole === 'buyer' 
                  ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm' 
                  : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900 mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px]">🛒</span>
                Buyer / Trader
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                For wholesalers, retailers & consumers sourcing fresh produce directly from farmers.
              </p>
            </div>

            <div 
              onClick={() => setActiveRole('kendra')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 relative ${
                activeRole === 'kendra' 
                  ? 'bg-teal-50/90 border-teal-400 ring-2 ring-teal-500/20 shadow-sm' 
                  : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/70'
              }`}
            >
              <span className="absolute -top-2 right-2 text-[9px] font-extrabold uppercase bg-teal-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                Dual Access
              </span>
              <div className="flex items-center gap-1.5 font-bold text-xs text-teal-950 mb-1">
                <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-900 flex items-center justify-center text-[10px]">🏪</span>
                Kisan Seva Kendra
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Supply equipment, seeds & fertilizers. <strong>Includes full Farmer features</strong> so you can also sell your own farm produce!
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-10">
          
          {/* 1. FARMER SIGNUP */}
          {activeRole === 'farmer' && (
            <form onSubmit={handleFarmerSubmit} className="space-y-6">
              
              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">1</span>
                  Farmer Profile & Farm Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Ramesh"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Kumar"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Farm / Enterprise Name *</label>
                    <div className="relative">
                      <FaTractor className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Green Meadows Organic Farm"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Account Credentials */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">2</span>
                  Account Credentials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="farmer@example.com"
                        value={username}
                        onChange={handleChangeEmail}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          errorEmail ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                        }`}
                        required
                      />
                    </div>
                    {errorEmail && <p className="text-xs text-red-500 mt-1">{errorEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={handleChangePassword}
                        className={`w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          errorPass ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                      </button>
                    </div>
                    {errorPass && <p className="text-xs text-red-500 mt-1">{errorPass}</p>}
                  </div>
                </div>
              </div>

              {/* Section 3: Farm Location */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">3</span>
                  Farm Location & State
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit Pincode *</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. 201001"
                        value={pincode}
                        onChange={handlePincodeChange}
                        maxLength={6}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          pincodeError ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                        }`}
                        required
                      />
                    </div>
                    {pincodeError && <p className="text-xs text-red-500 mt-1">{pincodeError}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                    <CustomDropdown
                      items={filteredStates}
                      selectedValue={selectedState}
                      onSelect={(st) => {
                        setSelectedState(st);
                        setSelectedDistrict('');
                        setStateSearch('');
                      }}
                      placeholder="Select State"
                      searchValue={stateSearch}
                      onSearch={setStateSearch}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                    <CustomDropdown
                      items={filteredDistricts}
                      selectedValue={selectedDistrict}
                      onSelect={(dist) => setSelectedDistrict(dist)}
                      placeholder={selectedState ? "Select District" : "Select State First"}
                      searchValue={districtSearch}
                      onSearch={setDistrictSearch}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed text-base"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering Farmer Account...
                  </span>
                ) : (
                  <>
                    <span>Complete Farmer Registration</span>
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. BUYER SIGNUP */}
          {activeRole === 'buyer' && (
            <form onSubmit={handleUserSubmit} className="space-y-6">
              
              {/* Section 1: Personal Details */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">1</span>
                  Personal Details & Login
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Priya"
                        value={firstNameU}
                        onChange={(e) => setFirstNameU(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Sharma"
                        value={lastNameU}
                        onChange={(e) => setLastNameU(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="buyer@example.com"
                        value={usernameU}
                        onChange={handleChangeEmailU}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          errorEmailU ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                        }`}
                        required
                      />
                    </div>
                    {errorEmailU && <p className="text-xs text-red-500 mt-1">{errorEmailU}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 6 characters"
                        value={passwordU}
                        onChange={handleChangePasswordU}
                        className={`w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          errorPassU ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                      </button>
                    </div>
                    {errorPassU && <p className="text-xs text-red-500 mt-1">{errorPassU}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (10 digits) *</label>
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="9876543210"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          phoneError ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                        }`}
                        required
                      />
                    </div>
                    {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                    {phoneVerify && <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1"><FaCheckCircle /> {phoneVerify}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">2</span>
                  Delivery Address & Pincode
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit Pincode *</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. 110001"
                        value={pincodeU}
                        onChange={handlePincodeChangeU}
                        maxLength={6}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          pincodeErrorU ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-500'
                        }`}
                        required
                      />
                    </div>
                    {pincodeErrorU && <p className="text-xs text-red-500 mt-1">{pincodeErrorU}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                    <CustomDropdown
                      items={filteredStatesU}
                      selectedValue={selectedStateU}
                      onSelect={(st) => {
                        setSelectedStateU(st);
                        setSelectedDistrictU('');
                        setStateSearchU('');
                      }}
                      placeholder="Select State"
                      searchValue={stateSearchU}
                      onSearch={setStateSearchU}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                    <CustomDropdown
                      items={filteredDistrictsU}
                      selectedValue={selectedDistrictU}
                      onSelect={(dist) => setSelectedDistrictU(dist)}
                      placeholder={selectedStateU ? "Select District" : "Select State First"}
                      searchValue={districtSearchU}
                      onSearch={setDistrictSearchU}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed text-base"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Buyer Account...
                  </span>
                ) : (
                  <>
                    <span>Complete Buyer Registration</span>
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. KISAN SEVA KENDRA / SUPPLIER SIGNUP */}
          {activeRole === 'kendra' && (
            <form onSubmit={handleKendraSubmit} className="space-y-6">
              
              <div className="p-4 bg-teal-50 border border-teal-200/80 rounded-2xl text-teal-800 text-xs sm:text-sm flex items-start gap-3">
                <FaStore className="text-teal-600 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-teal-950">Official Kisan Seva Kendra & Agri Input Supplier Onboarding</p>
                  <p className="text-teal-800/90 mt-1 text-xs leading-relaxed">
                    Register your Kendra to showcase farm equipment, seed varieties, fertilizers, and tractors directly to thousands of verified local farmers in your district.
                  </p>
                </div>
              </div>

              {/* Section 1: Kendra / Business Profile */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">1</span>
                  Kendra / Supplier Center Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kendra / Business Enterprise Name *</label>
                    <div className="relative">
                      <FaStore className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Kisan Seva Kendra & Agro Equipment Center"
                        value={kendraName}
                        onChange={(e) => setKendraName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Center Manager / Owner Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Suresh Patel"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Center Category / Specialty *</label>
                    <div className="relative">
                      <FaTools className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <select
                        value={supplierType}
                        onChange={(e) => setSupplierType(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition cursor-pointer"
                      >
                        <option value="Kisan Seva Kendra (Full Service)">Kisan Seva Kendra (Full Service)</option>
                        <option value="Farm Equipment & Machinery Dealer">Farm Equipment & Machinery Dealer</option>
                        <option value="Fertilizers & Crop Nutrients Depot">Fertilizers & Crop Nutrients Depot</option>
                        <option value="Certified Seeds & Nursery Saplings">Certified Seeds & Nursery Saplings</option>
                        <option value="Irrigation Systems & Solar Pumps">Irrigation Systems & Solar Pumps</option>
                        <option value="Agri Drone & Custom Hiring Center">Agri Drone & Custom Hiring Center</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">License / GST / Department Registration No. (Optional)</label>
                    <div className="relative">
                      <FaFileContract className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. FERT-2024-UP-8842 or GSTIN"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      />
                    </div>
                  </div>

                  {/* Dual Mode / Farmer Capability Selection */}
                  <div className="sm:col-span-2 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="dualFarmerCheck"
                      checked={isDualFarmer}
                      onChange={(e) => setIsDualFarmer(e.target.checked)}
                      className="mt-1 w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                    />
                    <label htmlFor="dualFarmerCheck" className="text-xs text-slate-700 cursor-pointer select-none">
                      <span className="font-bold text-emerald-950 block">
                        I also cultivate crops / operate a farm (Enable Dual Farmer + Kendra Mode)
                      </span>
                      <span className="text-slate-600 text-[11px] leading-relaxed block mt-0.5">
                        Gives you 1-click mode switching in your header between your Kendra inventory (equipment, seeds, fertilizers) and your personal farm crops (selling harvest produce).
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Authentication */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">2</span>
                  Official Contact & Security
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Kendra Email *</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        id="kendra_official_email"
                        name="kendra_official_email"
                        type="email"
                        autoComplete="username"
                        placeholder="kendra@agriconnect.in"
                        value={emailK}
                        onChange={handleChangeEmailK}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          errorEmailK ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-teal-500'
                        }`}
                        required
                      />
                    </div>
                    {errorEmailK && <p className="text-xs text-red-500 mt-1">{errorEmailK}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone / WhatsApp</label>
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        id="kendra_contact_phone"
                        name="kendra_contact_phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        placeholder="9876543210 (10 digits)"
                        value={phoneK}
                        onChange={handlePhoneChangeK}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          phoneErrorK ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-teal-500'
                        }`}
                      />
                    </div>
                    {phoneErrorK && <p className="text-xs text-red-500 mt-1">{phoneErrorK}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Login Password *</label>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        id="kendra_security_password"
                        name="kendra_security_password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Min 6 characters"
                        value={passwordK}
                        onChange={handleChangePasswordK}
                        className={`w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          errorPassK ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-teal-500'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                      </button>
                    </div>
                    {errorPassK && <p className="text-xs text-red-500 mt-1">{errorPassK}</p>}
                  </div>
                </div>
              </div>

              {/* Section 3: Location */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">3</span>
                  Center Hub Location & Mandi Region
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit Pincode *</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-xs text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. 201001"
                        value={pincodeK}
                        onChange={handlePincodeChangeK}
                        maxLength={6}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                          pincodeErrorK ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-teal-500'
                        }`}
                        required
                      />
                    </div>
                    {pincodeErrorK && <p className="text-xs text-red-500 mt-1">{pincodeErrorK}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                    <CustomDropdown
                      items={filteredStatesK}
                      selectedValue={selectedStateK}
                      onSelect={(st) => {
                        setSelectedStateK(st);
                        setSelectedDistrictK('');
                        setStateSearchK('');
                      }}
                      placeholder="Select State"
                      searchValue={stateSearchK}
                      onSearch={setStateSearchK}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                    <CustomDropdown
                      items={filteredDistrictsK}
                      selectedValue={selectedDistrictK}
                      onSelect={(dist) => setSelectedDistrictK(dist)}
                      placeholder={selectedStateK ? "Select District" : "Select State First"}
                      searchValue={districtSearchK}
                      onSearch={setDistrictSearchK}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg shadow-teal-700/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed text-base"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering Kisan Seva Kendra...
                  </span>
                ) : (
                  <>
                    <span>Register Kisan Seva Kendra</span>
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default SignUpComponent;
