import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { boolAtom } from './Loged';
import { useSetRecoilState } from 'recoil';
import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';
import { FarmerAtom } from './farmerAtom';
import { API_BASE_URL } from '../config';
import { 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaTractor, 
  FaShoppingBag, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight, 
  FaCheckCircle,
  FaLeaf,
  FaStore,
  FaBoxes,
  FaTools,
  FaShieldAlt
} from 'react-icons/fa';

const LoginComponent = () => {
  // 'farmer' | 'buyer' | 'kendra'
  const [activeRole, setActiveRole] = useState('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Farmer form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPass, setErrorPass] = useState('');

  // User form state
  const [usernameU, setUsernameU] = useState('');
  const [passwordU, setPasswordU] = useState('');
  const [errorEmailU, setErrorEmailU] = useState('');
  const [errorPassU, setErrorPassU] = useState('');

  // Kendra / Supplier form state
  const [usernameK, setUsernameK] = useState('');
  const [passwordK, setPasswordK] = useState('');
  const [errorEmailK, setErrorEmailK] = useState('');
  const [errorPassK, setErrorPassK] = useState('');

  const [formError, setFormError] = useState('');

  const navigate = useNavigate();
  const setMyBoolean = useSetRecoilState(boolAtom);
  const setMyType = useSetRecoilState(FarmerAtom);

  const toggleBoolean = () => {
    setMyBoolean(true);
  };

  const toggleType = (isFarmOrKendra = true) => {
    setMyType(isFarmOrKendra);
  };

  // Farmer Email Validation
  const handleChangeEmail = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setUsername(value);
    setFormError('');
    if (value === "") {
      setErrorEmail('');
    } else if (emailRegex.test(value)) {
      setErrorEmail('');
    } else {
      setErrorEmail('Please enter a valid email address');
    }
  };

  // User Email Validation
  const handleChangeEmailU = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setUsernameU(value);
    setFormError('');
    if (value === "") {
      setErrorEmailU('');
    } else if (emailRegex.test(value)) {
      setErrorEmailU('');
    } else {
      setErrorEmailU('Please enter a valid email address');
    }
  };

  // Kendra Email Validation
  const handleChangeEmailK = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setUsernameK(value);
    setFormError('');
    if (value === "") {
      setErrorEmailK('');
    } else if (emailRegex.test(value)) {
      setErrorEmailK('');
    } else {
      setErrorEmailK('Please enter a valid email address');
    }
  };

  // Farmer Password Validation
  const handleChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    setFormError('');
    if (value === "") {
      setErrorPass('');
    } else if (value.length < 6) {
      setErrorPass('Password must be at least 6 characters long');
    } else {
      setErrorPass('');
    }
  };

  // User Password Validation
  const handleChangePasswordU = (e) => {
    const value = e.target.value;
    setPasswordU(value);
    setFormError('');
    if (value === "") {
      setErrorPassU('');
    } else if (value.length < 6) {
      setErrorPassU('Password must be at least 6 characters long');
    } else {
      setErrorPassU('');
    }
  };

  // Kendra Password Validation
  const handleChangePasswordK = (e) => {
    const value = e.target.value;
    setPasswordK(value);
    setFormError('');
    if (value === "") {
      setErrorPassK('');
    } else if (value.length < 6) {
      setErrorPassK('Password must be at least 6 characters long');
    } else {
      setErrorPassK('');
    }
  };

  // Farmer Submit
  const handleFarmerSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      setFormError('Please enter both email and password.');
      toast.error('Please fill in all fields');
      return;
    }
    if (errorEmail || errorPass) {
      toast.error('Please resolve validation errors first');
      return;
    }

    try {
      setLoading(true);
      setFormError('');
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: username,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem('token', `Bearer ${result.token}`);
        const decodedToken = jwtDecode(result.token);
        const farmerId = result.userId || result.farmerId || decodedToken.userId;
        localStorage.setItem('FarmerId', farmerId);
        localStorage.setItem('role', result.role || 'Farmer');

        toggleType(true);
        toggleBoolean();
        toast.success('Welcome back, Farmer!');
        navigate('/');
      } else {
        setFormError(result.error || result.msg || 'Login failed. Please check credentials.');
        toast.error(result.error || result.msg || 'Login failed');
      }
    } catch (err) {
      setLoading(false);
      console.error("Error during login:", err);
      setFormError('Cannot connect to server. Please try again later.');
      toast.error('Server error during login');
    }
  };

  // User Submit
  const handleUserSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!usernameU || !passwordU) {
      setFormError('Please enter both email and password.');
      toast.error('Please fill in all fields');
      return;
    }
    if (errorEmailU || errorPassU) {
      toast.error('Please resolve validation errors first');
      return;
    }

    try {
      setLoading(true);
      setFormError('');
      const response = await fetch(`${API_BASE_URL}/loginUSER`, {
        method: 'POST',
        body: JSON.stringify({
          email: usernameU,
          password: passwordU,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem('token', `Bearer ${result.token}`);
        const decodedToken = jwtDecode(result.token);
        localStorage.setItem('UserId', decodedToken.userId);
        localStorage.setItem('role', 'Customer');

        toggleType(false);
        toggleBoolean();
        toast.success('Welcome back to AgriConnect!');
        navigate('/');
      } else {
        setFormError(result.error || result.msg || 'Login failed. Please check credentials.');
        toast.error(result.error || result.msg || 'Login failed');
      }
    } catch (err) {
      setLoading(false);
      console.error("Error during login:", err);
      setFormError('Cannot connect to server. Please try again later.');
      toast.error('Server error during login');
    }
  };

  // Kisan Seva Kendra / Supplier Submit
  const handleKendraSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!usernameK || !passwordK) {
      setFormError('Please enter both Kendra email and password.');
      toast.error('Please fill in all fields');
      return;
    }
    if (errorEmailK || errorPassK) {
      toast.error('Please resolve validation errors first');
      return;
    }

    try {
      setLoading(true);
      setFormError('');

      const parseSafeJson = async (res) => {
        try {
          const text = await res.text();
          return JSON.parse(text);
        } catch (_) {
          return { error: `Server error (${res.status}): ${res.statusText || 'Unexpected response'}` };
        }
      };

      // 1. Attempt /loginSupplier
      let response = await fetch(`${API_BASE_URL}/loginSupplier`, {
        method: 'POST',
        body: JSON.stringify({
          email: usernameK.trim().toLowerCase(),
          password: passwordK,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // 2. If 404 (not yet deployed on remote Render backend), fall back to /login
      if (response.status === 404) {
        response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          body: JSON.stringify({
            email: usernameK.trim().toLowerCase(),
            password: passwordK,
          }),
          headers: {
            'Content-Type': 'application/json',
          }
        });
      }

      const result = await parseSafeJson(response);
      setLoading(false);

      if (response.ok && result.token) {
        localStorage.setItem('token', `Bearer ${result.token}`);
        const decodedToken = jwtDecode(result.token);
        const supplierId = result.userId || result.farmerId || decodedToken.userId;
        localStorage.setItem('FarmerId', supplierId);
        localStorage.setItem('role', 'Supplier');
        if (result.kendraName || result.farmName) {
          localStorage.setItem('kendraName', result.kendraName || result.farmName);
        }

        toggleType(true);
        toggleBoolean();
        toast.success(`Welcome to Kisan Seva Kendra Portal, ${result.kendraName || result.farmName || 'Supplier'}!`);
        navigate('/dashboard');
      } else {
        const errorMsg = result.error || result.msg || 'Login failed. Please check Kendra credentials.';
        setFormError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error during Kendra login:", err);
      setFormError('Cannot connect to server. Please try again later.');
      toast.error('Server error during Kendra login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 py-10 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-all">
        
        {/* Left Side: Brand & Feature Highlights */}
        <div className="md:col-span-5 bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-emerald-200 mb-6">
              <FaLeaf className="text-emerald-300" /> AgriConnect Portal
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-3">
              Direct Agri Trade, Inputs & Services
            </h1>
            <p className="text-emerald-100/90 text-sm leading-relaxed mb-6">
              Connecting farmers, input suppliers, and consumers directly. Access fair pricing, certified seeds & machinery, and live agronomy intelligence.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <FaCheckCircle className="text-emerald-300 text-sm flex-shrink-0" />
                <span>Zero middlemen commissions & direct buyer connect</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <FaCheckCircle className="text-emerald-300 text-sm flex-shrink-0" />
                <span>Kisan Seva Kendra equipment & fertilizer management</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <FaCheckCircle className="text-emerald-300 text-sm flex-shrink-0" />
                <span>Real-time local weather & soil recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <FaCheckCircle className="text-emerald-300 text-sm flex-shrink-0" />
                <span>Direct farmer booking requests & order tracking</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-8 text-xs text-emerald-200/80 flex items-center justify-between">
            <span>Verified Agriculture Ecosystem</span>
            <span className="font-semibold text-white">100% Free Access</span>
          </div>
        </div>

        {/* Right Side: Login Form with Tabs */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select your role to access your dedicated AgriConnect dashboard.
            </p>
          </div>

          {/* Account Type Toggle Tabs (3 options) */}
          <div className="grid grid-cols-3 p-1.5 bg-slate-100 rounded-2xl mb-6 border border-slate-200/60 gap-1">
            <button
              type="button"
              onClick={() => { setActiveRole('farmer'); setFormError(''); }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-1 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
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
              onClick={() => { setActiveRole('buyer'); setFormError(''); }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-1 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
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
              onClick={() => { setActiveRole('kendra'); setFormError(''); }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-1 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeRole === 'kendra' 
                  ? 'bg-white text-teal-800 shadow-md border border-teal-200/60' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaStore className={activeRole === 'kendra' ? 'text-teal-600' : 'text-slate-400'} />
              <span className="truncate">Kisan Seva Kendra</span>
            </button>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. FARMER LOGIN FORM */}
          {activeRole === 'farmer' && (
            <form onSubmit={handleFarmerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Farmer Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <input
                    type="text"
                    placeholder="farmer@example.com"
                    value={username}
                    onChange={handleChangeEmail}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errorEmail 
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                        : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {errorEmail && <p className="text-red-500 text-xs mt-1 ml-1">{errorEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handleChangePassword}
                    className={`w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errorPass 
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                        : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {errorPass && <p className="text-red-500 text-xs mt-1 ml-1">{errorPass}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in as Farmer...
                  </span>
                ) : (
                  <>
                    <span>Sign In as Farmer</span>
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. BUYER LOGIN FORM */}
          {activeRole === 'buyer' && (
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Buyer Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <input
                    type="text"
                    placeholder="buyer@example.com"
                    value={usernameU}
                    onChange={handleChangeEmailU}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errorEmailU 
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                        : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {errorEmailU && <p className="text-red-500 text-xs mt-1 ml-1">{errorEmailU}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={passwordU}
                    onChange={handleChangePasswordU}
                    className={`w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errorPassU 
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                        : 'border-slate-200 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {errorPassU && <p className="text-red-500 text-xs mt-1 ml-1">{errorPassU}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in as Buyer...
                  </span>
                ) : (
                  <>
                    <span>Sign In as Buyer</span>
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. KISAN SEVA KENDRA / SUPPLIER LOGIN FORM */}
          {activeRole === 'kendra' && (
            <form onSubmit={handleKendraSubmit} className="space-y-4">
              <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-xl text-teal-800 text-xs flex items-start gap-2.5">
                <FaStore className="text-teal-600 text-base flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-teal-900">Kisan Seva Kendra & Equipment Supplier Portal</p>
                  <p className="text-teal-700 mt-0.5">Manage agricultural inputs, seeds, fertilizers, machinery, and fulfill farmer orders.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kendra / Supplier Official Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <input
                    type="text"
                    placeholder="kendra@agriconnect.in"
                    value={usernameK}
                    onChange={handleChangeEmailK}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errorEmailK 
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                        : 'border-slate-200 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                </div>
                {errorEmailK && <p className="text-red-500 text-xs mt-1 ml-1">{errorEmailK}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Kendra password"
                    value={passwordK}
                    onChange={handleChangePasswordK}
                    className={`w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      errorPassK 
                        ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                        : 'border-slate-200 focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {errorPassK && <p className="text-red-500 text-xs mt-1 ml-1">{errorPassK}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg shadow-teal-700/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in to Kendra Portal...
                  </span>
                ) : (
                  <>
                    <span>Sign In to Kendra Portal</span>
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-600 gap-2">
            <span>
              {activeRole === 'kendra' ? "New Kendra or Equipment Supplier?" : "Don't have an account yet?"}
            </span>
            <Link
              to={`/signup?role=${activeRole}`}
              className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 hover:underline"
            >
              <span>{activeRole === 'kendra' ? "Register Kendra / Supplier" : "Create Account"}</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

        </div>

      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default LoginComponent;
