import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faShoppingBag,
    faCoins,
    faClock,
    faCheckCircle,
    faTruckFast,
    faShieldAlt,
    faArrowTrendUp,
    faChevronRight,
    faCloudSun,
    faRobot,
    faLandmark,
    faSeedling,
    faBoxesStacked
} from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../config';
import { CATEGORIES } from './CategorySelect';

const MyOrdersUser = () => {
    // User & Order state
    const [userData, setUserData]         = useState({});
    const [userOrders, setUserOrders]     = useState([]);
    const [userAddress, setUserAddress]   = useState({});
    const [userPhone, setUserPhone]       = useState('');
    
    // UI state
    const [loading, setLoading]           = useState(true);
    const [orderFilter, setOrderFilter]   = useState('all');

    const getCatInfo = (title = '') => {
        const lower = title.toLowerCase();
        for (const cat of CATEGORIES) {
            if (cat.keywords && cat.keywords.some(k => lower.includes(k))) {
                return cat;
            }
        }
        return { emoji: '🌾', label: 'Produce' };
    };

    // ── Fetch User Orders & Profile ──────────────────────────────────────────
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const userID = localStorage.getItem('UserId') || localStorage.getItem('FarmerId');
                if (!userID) {
                    setLoading(false);
                    return;
                }

                // Try fetching user data first
                try {
                    const response = await axios.get(`${API_BASE_URL}/currentUserData?userId=${userID}`);
                    if (response.status === 200 && response.data?.userData) {
                        const data = response.data.userData;
                        setUserData(data);
                        setUserPhone(data.phoneNumber || '');
                        setUserAddress(data.address?.[0] || {});
                        setUserOrders(data.myOrder || []);
                        setLoading(false);
                        return;
                    }
                } catch (userErr) {
                    console.log('User fetch fallback to farmer:', userErr);
                }

                // If logged in as Farmer, also check Farmer orders
                try {
                    const farmRes = await axios.get(`${API_BASE_URL}/currentFarmerData?FarmerID=${userID}`);
                    if (farmRes.status === 200 && farmRes.data?.farmerData) {
                        const fData = farmRes.data.farmerData;
                        setUserData(fData);
                        setUserAddress(fData.farmLocation?.[0] || {});
                        setUserOrders(fData.order || []);
                    }
                } catch (fErr) {
                    console.error('Farmer fetch error:', fErr);
                }

            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, []);

    // ── Filtered & Computed Metrics ──────────────────────────────────────────
    const pendingOrders  = userOrders.filter(o => o.status !== 'Accepted!');
    const acceptedOrders = userOrders.filter(o => o.status === 'Accepted!');

    const totalSpent = userOrders.reduce((sum, o) => {
        const p = Number(o.price) || 0;
        const q = Number(o.quantity) || 1;
        return sum + (p * q);
    }, 0);

    const displayedOrders = orderFilter === 'all'
        ? userOrders
        : orderFilter === 'pending'
            ? pendingOrders
            : acceptedOrders;

    // ── Loading Screen ───────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-emerald-800 font-semibold text-lg">Loading your orders...</p>
            </div>
        );
    }

    // ── Not Logged In Screen ─────────────────────────────────────────────────
    if (!localStorage.getItem('UserId') && !localStorage.getItem('FarmerId')) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-green-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">My Orders</h2>
                    <p className="text-gray-500 text-sm mb-6">Please log in to track your farm produce purchases and deliveries.</p>
                    <Link to="/login" className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-colors">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-50/20 pb-20">

            {/* ═══════════════════════════════════════════════════════════════════
                HERO BANNER & QUICK ACTIONS
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 p-6 sm:p-8 text-white shadow-xl">
                    
                    {/* Background glows */}
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        
                        {/* User Identity */}
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-300 text-emerald-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-2 border-white/30">
                                    {userData.firstName ? userData.firstName.charAt(0).toUpperCase() : '🛒'}
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-emerald-900 rounded-full flex items-center justify-center">
                                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                                </span>
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                        My Orders & Purchases
                                    </h1>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                        <FontAwesomeIcon icon={faShieldAlt} className="text-[10px]" /> Verified Buyer
                                    </span>
                                </div>
                                <p className="text-emerald-200 text-sm font-medium flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-white">{userData.firstName} {userData.lastName || ''}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-emerald-300">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                                        {userAddress.district ? `${userAddress.district}, ${userAddress.state}` : 'Direct Delivery Address'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <Link
                                to="/marketplace"
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 text-sm hover:-translate-y-0.5"
                            >
                                <FontAwesomeIcon icon={faShoppingBag} />
                                Browse Marketplace
                            </Link>

                            <Link
                                to="/weather"
                                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 text-sm hover:-translate-y-0.5"
                            >
                                <FontAwesomeIcon icon={faCloudSun} />
                                Weather Forecast
                            </Link>

                            <Link
                                to="/chatbot"
                                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 text-sm hover:-translate-y-0.5"
                            >
                                <FontAwesomeIcon icon={faRobot} />
                                AI Assistant
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                KPI STAT CARDS (4 Cards Grid)
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                    {/* Card 1: Total Spent */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Purchases</span>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faCoins} className="text-lg" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-800">
                                ₹{totalSpent.toLocaleString('en-IN')}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-semibold">
                                <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
                                <span>Across {userOrders.length} orders</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Total Orders Placed */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faShoppingBag} className="text-lg" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-800">
                                {userOrders.length} <span className="text-sm font-semibold text-slate-400">orders</span>
                            </div>
                            <div className="flex items-center justify-between mt-1 text-xs text-blue-600 font-semibold">
                                <span>Direct from local farms</span>
                                <Link to="/marketplace" className="hover:underline text-emerald-600">Buy More →</Link>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Pending Confirmation */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Awaiting Farmer</span>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform relative">
                                <FontAwesomeIcon icon={faClock} className="text-lg" />
                                {pendingOrders.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                                )}
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-800">
                                {pendingOrders.length} <span className="text-sm font-semibold text-slate-400">pending</span>
                            </div>
                            <div className="mt-1 text-xs text-amber-700 font-semibold">
                                {pendingOrders.length > 0 ? 'Farmer is reviewing request' : 'No pending requests'}
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Confirmed & Dispatched */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirmed Orders</span>
                            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-800">
                                {acceptedOrders.length} <span className="text-sm font-semibold text-slate-400">accepted</span>
                            </div>
                            <div className="mt-1 text-xs text-teal-700 font-semibold">
                                Ready for delivery / pickup
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                MAIN CONTENT (2 Column Layout)
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

                    {/* ───────────────────────────────────────────────────────────
                        LEFT COLUMN: Orders List & Tracking (8 cols)
                    ─────────────────────────────────────────────────────────── */}
                    <div className="lg:col-span-8 space-y-6">

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            
                            {/* Header & Filter Tabs */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faBoxesStacked} className="text-emerald-600" />
                                        Order History & Deliveries
                                    </h2>
                                    <p className="text-slate-400 text-xs mt-0.5">Track your farm fresh produce orders and dispatch status</p>
                                </div>

                                {/* Filter Pills */}
                                <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 self-start sm:self-auto">
                                    <button
                                        onClick={() => setOrderFilter('all')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${orderFilter === 'all' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                        All ({userOrders.length})
                                    </button>
                                    <button
                                        onClick={() => setOrderFilter('pending')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${orderFilter === 'pending' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                        Pending ({pendingOrders.length})
                                    </button>
                                    <button
                                        onClick={() => setOrderFilter('accepted')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${orderFilter === 'accepted' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                        Confirmed ({acceptedOrders.length})
                                    </button>
                                </div>
                            </div>

                            {/* Orders Cards List */}
                            <div className="pt-4">
                                {displayedOrders.length === 0 ? (
                                    <div className="py-16 text-center">
                                        <div className="text-6xl mb-3">🧺</div>
                                        <h3 className="text-slate-700 font-bold text-lg">No orders found</h3>
                                        <p className="text-slate-400 text-xs mt-1 mb-5">
                                            {orderFilter === 'pending'
                                                ? 'No orders are pending approval at this moment.'
                                                : 'Explore fresh farm produce in our marketplace and support rural farmers directly.'}
                                        </p>
                                        <Link
                                            to="/marketplace"
                                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                                        >
                                            <FontAwesomeIcon icon={faShoppingBag} />
                                            Explore Marketplace
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3.5">
                                        {displayedOrders.slice().reverse().map((order) => {
                                            const isAccepted = order.status === 'Accepted!';
                                            const catInfo = getCatInfo(order.title);
                                            const orderDate = order.orderDate
                                                ? new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : 'Recently';
                                            const orderTime = order.orderDate
                                                ? new Date(order.orderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                                                : '';
                                            const totalPrice = ((Number(order.price) || 0) * (Number(order.quantity) || 1)).toLocaleString('en-IN');

                                            return (
                                                <div
                                                    key={order._id}
                                                    className="p-4 sm:p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                                >
                                                    {/* Order Info */}
                                                    <div className="flex items-start gap-3.5">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-2xl flex items-center justify-center shrink-0">
                                                            {catInfo.emoji}
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className="font-bold text-slate-800 text-base">{order.title}</h4>
                                                                <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                                    #{order._id.slice(-6)}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                                                                <span className="font-semibold text-slate-700">₹{order.price}/kg</span>
                                                                <span>•</span>
                                                                <span>Qty: <strong>{order.quantity || 1} kg</strong></span>
                                                                <span>•</span>
                                                                <span>Total: <strong className="text-emerald-700 font-bold text-sm">₹{totalPrice}</strong></span>
                                                                <span>•</span>
                                                                <span className="text-slate-400">📅 {orderDate} {orderTime && `at ${orderTime}`}</span>
                                                            </div>

                                                            {order.farmLocation && (
                                                                <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1">
                                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-emerald-600 text-[10px]" />
                                                                    <span>Farm Source: {order.farmLocation.district || 'Local'}, {order.farmLocation.state || 'India'}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Status Badge & Action */}
                                                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                                                        {isAccepted ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
                                                                Confirmed by Farmer
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                                                <FontAwesomeIcon icon={faClock} className="text-amber-600 text-[10px]" />
                                                                Awaiting Confirmation
                                                            </span>
                                                        )}

                                                        <Link
                                                            to="/marketplace"
                                                            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
                                                        >
                                                            Buy Again
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ───────────────────────────────────────────────────────────
                        RIGHT COLUMN: Delivery Profile & Logistics (4 cols)
                    ─────────────────────────────────────────────────────────── */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* ── CARD 1: Delivery Address & Profile ── */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-emerald-600" />
                                Delivery Profile
                            </h3>

                            <div className="space-y-3.5">
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faUser} className="text-sm" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase">Customer Name</p>
                                        <p className="text-sm font-bold text-slate-800 truncate">
                                            {userData.firstName} {userData.lastName || ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase">Email Address</p>
                                        <p className="text-sm font-bold text-slate-800 truncate">{userData.email || '—'}</p>
                                    </div>
                                </div>

                                {userPhone && (
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                            <FontAwesomeIcon icon={faPhone} className="text-sm" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] text-slate-400 font-semibold uppercase">Phone Number</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{userPhone}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase">Delivery Location</p>
                                        <p className="text-xs font-semibold text-slate-700 leading-snug">
                                            {userAddress.district
                                                ? `${userAddress.district}, ${userAddress.state} - PIN ${userAddress.pincode}`
                                                : 'Standard delivery location'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── CARD 2: AgriConnect Delivery & Logistics Network ── */}
                        <div className="bg-gradient-to-br from-emerald-900 to-green-950 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />

                            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                                <FontAwesomeIcon icon={faTruckFast} className="text-emerald-400" />
                                3rd-Party Delivery Partner
                            </h3>
                            <p className="text-emerald-200 text-xs mb-4">Farm-fresh produce routed directly from rural farms to your doorstep</p>

                            <div className="space-y-3">
                                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                                        <span className="text-white">Delivery Network</span>
                                        <span className="text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full text-[10px]">Active</span>
                                    </div>
                                    <p className="text-[11px] text-emerald-200">Collaborated logistics partners handle pickup & transport safely.</p>
                                </div>

                                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                                        <span className="text-white">Quality Guarantee</span>
                                        <span className="text-amber-300">100% Fresh</span>
                                    </div>
                                    <p className="text-[11px] text-emerald-200">Harvested directly upon order confirmation.</p>
                                </div>
                            </div>
                        </div>

                        {/* ── CARD 3: Quick Shortcuts ── */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faSeedling} className="text-emerald-600" />
                                Explore AgriConnect
                            </h3>

                            <div className="space-y-2">
                                <Link
                                    to="/marketplace"
                                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faShoppingBag} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">Fresh Marketplace</p>
                                            <p className="text-[10px] text-slate-400">Fruits, veggies, grains & dairy</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                </Link>

                                <Link
                                    to="/chatbot"
                                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faRobot} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">AI Assistant</p>
                                            <p className="text-[10px] text-slate-400">Ask nutrition & farming questions</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <Toaster position="top-right" />
        </div>
    );
};

export default MyOrdersUser;
