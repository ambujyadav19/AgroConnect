import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faEnvelope,
    faHome,
    faMapMarkerAlt,
    faSeedling,
    faCoins,
    faShoppingBag,
    faClipboardList,
    faHeart,
    faArrowTrendUp,
    faPlus,
    faPen,
    faCalendarAlt,
    faChevronRight,
    faBoxesStacked,
    faTruckFast,
    faCheckCircle,
    faClock,
    faCloudSun,
    faRobot,
    faLandmark,
    faShieldAlt,
    faTag,
    faStore,
    faMessage
} from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../config';
import { CATEGORIES } from './CategorySelect';

const Dashboard = () => {
    // Farmer state
    const [FarmerAllData, setFarmerAllData]           = useState({});
    const [FarmerSellProducts, setFarmerSellProducts] = useState([]);
    const [FarmerAllBlogs, setFarmerAllBlogs]         = useState([]);
    const [FarmAddress, setFarmAddress]               = useState({});
    const [customersOrders, setCustomersOrders]       = useState([]);
    
    // UI state
    const [loading, setLoading]                     = useState(true);
    const [orderFilter, setOrderFilter]             = useState('all');
    const [acceptingOrderId, setAcceptingOrderId]   = useState(null);
    const [refreshTrigger, setRefreshTrigger]       = useState(false);

    // Helper for category display
    const getCatInfo = (catId) => CATEGORIES.find(c => c.id === catId) || { emoji: '📦', label: 'Other', color: 'from-gray-400 to-gray-500' };

    // ── Fetch all farmer data ────────────────────────────────────────────────
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const farmerID = localStorage.getItem('FarmerId');
                if (!farmerID) {
                    setLoading(false);
                    return;
                }

                // 1. Fetch main farmer profile & orders
                const response = await axios.get(`${API_BASE_URL}/currentFarmerData?FarmerID=${farmerID}`);
                if (response.status === 200 && response.data?.farmerData) {
                    const data = response.data.farmerData;
                    setFarmerAllData(data);
                    setFarmerSellProducts(data.productSell || []);
                    if (data.farmLocation?.[0]) {
                        setFarmAddress(data.farmLocation[0]);
                    }
                    // Deduplicate duplicate orders from historical double-saves
                    const rawOrders = data.order || [];
                    const uniqueOrders = [];
                    const seenKeys = new Set();
                    rawOrders.forEach(order => {
                        const dateKey = order.orderDate ? new Date(order.orderDate).toISOString().slice(0, 16) : '';
                        const key = order.userOrder
                            ? `userOrder-${order.userOrder}`
                            : `${order.buyerId || ''}-${order.title}-${order.price}-${order.quantity}-${dateKey}`;
                        if (!seenKeys.has(key)) {
                            seenKeys.add(key);
                            uniqueOrders.push(order);
                        }
                    });
                    setCustomersOrders(uniqueOrders);
                }

                // 2. Fetch farmer blogs / posts
                try {
                    const responsePosts = await axios.get(`${API_BASE_URL}/currentFarmerDataPosts?FarmerID=${farmerID}`);
                    if (responsePosts.status === 200 && responsePosts.data?.Blog) {
                        setFarmerAllBlogs(responsePosts.data.Blog);
                    }
                } catch (postErr) {
                    console.error('Error fetching blogs:', postErr);
                }

            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [refreshTrigger]);

    // ── Handle Order Acceptance ──────────────────────────────────────────────
    const handleAcceptOrder = async (order) => {
        setAcceptingOrderId(order._id);
        try {
            const farmerId = localStorage.getItem('FarmerId');
            // 1. Update status in farmer's order array
            await axios.post(`${API_BASE_URL}/orderUpdateFarmerAccept?farmerId=${farmerId}&orderId=${order._id}`);

            // 2. Attempt updating status in user's order array if buyerId is present
            if (order.buyerId) {
                try {
                    await axios.post(`${API_BASE_URL}/orderUpdateUserAccept?userId=${order.buyerId}&orderId=${order.userOrder || order._id}`);
                } catch (uErr) {
                    console.log('User status update error (optional):', uErr);
                }
            }

            toast.success(`Order for "${order.title}" accepted! 🚚`);
            setRefreshTrigger(prev => !prev);
        } catch (err) {
            console.error('Error accepting order:', err);
            toast.error('Failed to accept order. Please try again.');
        } finally {
            setAcceptingOrderId(null);
        }
    };

    // ── Computed Metrics ─────────────────────────────────────────────────────
    const pendingOrders   = customersOrders.filter(o => o.status !== 'Accepted!');
    const acceptedOrders  = customersOrders.filter(o => o.status === 'Accepted!');
    
    // Revenue calculated from accepted orders
    const calculatedRevenue = acceptedOrders.reduce((acc, o) => {
        const p = Number(o.price) || 0;
        const q = Number(o.quantity) || 1;
        return acc + (p * q);
    }, 0);

    const totalStockKg = FarmerSellProducts.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
    const totalBlogLikes = FarmerAllBlogs.reduce((acc, b) => acc + (Number(b.likes) || 0), 0);

    // Filtered orders
    const displayedOrders = orderFilter === 'all'
        ? customersOrders
        : orderFilter === 'pending'
            ? pendingOrders
            : acceptedOrders;

    // ── Loading Screen ───────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-emerald-800 font-semibold text-lg">Loading your farm dashboard...</p>
            </div>
        );
    }

    // ── Check Role ─────────────────────────────────────────────────────────
    const isSupplier = localStorage.getItem('role') === 'Supplier' || FarmerAllData.youAre === 'Supplier';

    // ── Not Logged In State ──────────────────────────────────────────────────
    if (!localStorage.getItem('FarmerId')) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-green-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                    <div className="text-6xl mb-4">🌾</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">AgriConnect Dashboard</h2>
                    <p className="text-gray-500 text-sm mb-6">Please log in with your Farmer or Kisan Seva Kendra account to access your command center, sales, and inventory.</p>
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
                <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl ${
                    isSupplier 
                        ? 'bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900' 
                        : 'bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900'
                }`}>
                    
                    {/* Background glow & decorative circles */}
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        
                        {/* Identity */}
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="relative">
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-2 border-white/30 ${
                                    isSupplier 
                                        ? 'bg-gradient-to-tr from-amber-400 to-orange-400 text-slate-950' 
                                        : 'bg-gradient-to-tr from-amber-400 to-emerald-300 text-emerald-950'
                                }`}>
                                    {isSupplier 
                                        ? <FontAwesomeIcon icon={faStore} className="text-2xl sm:text-3xl" /> 
                                        : (FarmerAllData.firstName ? FarmerAllData.firstName.charAt(0).toUpperCase() : '👨‍🌾')
                                    }
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-emerald-900 rounded-full flex items-center justify-center" title="Online & Active">
                                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                                </span>
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                        Welcome, {isSupplier ? (FarmerAllData.farmName || FarmerAllData.firstName || 'Kisan Seva Kendra') : (FarmerAllData.firstName || 'Farmer')}!
                                    </h1>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        isSupplier 
                                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                                            : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                                    }`}>
                                        <FontAwesomeIcon icon={isSupplier ? faStore : faShieldAlt} className="text-[10px]" /> 
                                        {isSupplier ? '🏪 Verified Kisan Seva Kendra' : 'Verified Farmer'}
                                    </span>
                                </div>
                                <p className="text-emerald-200 text-sm font-medium flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-white">{FarmerAllData.farmName || (isSupplier ? 'Kisan Seva Kendra Hub' : 'My Farm')}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-emerald-300">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                                        {FarmAddress.district ? `${FarmAddress.district}, ${FarmAddress.state}` : 'Location configured'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Quick Action Navigation Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <Link
                                to="/addProducts"
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 text-sm hover:-translate-y-0.5"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                {isSupplier ? 'List Equipment & Supplies' : 'List New Product'}
                            </Link>

                            <Link
                                to="/OrderMessage"
                                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 text-sm hover:-translate-y-0.5"
                            >
                                <FontAwesomeIcon icon={faMessage} />
                                Order Messages
                            </Link>

                            <Link
                                to="/marketplace"
                                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 text-sm hover:-translate-y-0.5"
                            >
                                <FontAwesomeIcon icon={faShoppingBag} />
                                Marketplace
                            </Link>

                            <Link
                                to="/weather"
                                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-3 py-2.5 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 text-sm hover:-translate-y-0.5"
                                title="Check Weather"
                            >
                                <FontAwesomeIcon icon={faCloudSun} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                KPI / METRIC CARDS (4 Cards Grid)
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                    {/* Card 1: Total Revenue */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales</span>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faCoins} className="text-lg" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-800">
                                ₹{calculatedRevenue.toLocaleString('en-IN')}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-semibold">
                                <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
                                <span>{acceptedOrders.length} completed orders</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Produce in Stock */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Products Listed</span>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faBoxesStacked} className="text-lg" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-800">
                                {FarmerSellProducts.length} <span className="text-sm font-semibold text-slate-400">items</span>
                            </div>
                            <div className="flex items-center justify-between mt-1 text-xs text-amber-700 font-semibold">
                                <span>{totalStockKg.toLocaleString('en-IN')} kg available</span>
                                <Link to="/addProducts" className="hover:underline text-emerald-600">Manage →</Link>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Orders Received */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Orders</span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform relative">
                                <FontAwesomeIcon icon={faShoppingBag} className="text-lg" />
                                {pendingOrders.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-800">
                                {customersOrders.length} <span className="text-sm font-semibold text-slate-400">orders</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                                {pendingOrders.length > 0 ? (
                                    <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                        ⚡ {pendingOrders.length} pending approval
                                    </span>
                                ) : (
                                    <span className="text-emerald-600 font-semibold">All orders fulfilled</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Knowledge Community */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-100 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Community Posts</span>
                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faHeart} className="text-lg" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-800">
                                {totalBlogLikes} <span className="text-sm font-semibold text-slate-400">likes</span>
                            </div>
                            <div className="flex items-center justify-between mt-1 text-xs text-rose-600 font-semibold">
                                <span>{FarmerAllBlogs.length} articles published</span>
                                <Link to="/manage-blogs" className="hover:underline text-emerald-600">View →</Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                MAIN DASHBOARD CONTENT (2 Column Layout)
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

                    {/* ───────────────────────────────────────────────────────────
                        LEFT COLUMN: Orders Management & Products Inventory (8 cols)
                    ─────────────────────────────────────────────────────────── */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* ── SECTION A: Customer Orders ── */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            
                            {/* Card Header & Filter Tabs */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faClipboardList} className="text-emerald-600" />
                                        Customer Orders & Requests
                                    </h2>
                                    <p className="text-slate-400 text-xs mt-0.5">Manage customer purchase requests and accept deliveries</p>
                                </div>

                                {/* Filter Pills */}
                                <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 self-start sm:self-auto">
                                    <button
                                        onClick={() => setOrderFilter('all')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${orderFilter === 'all' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                        All ({customersOrders.length})
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
                                        Accepted ({acceptedOrders.length})
                                    </button>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="pt-4">
                                {displayedOrders.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <div className="text-5xl mb-3">📦</div>
                                        <h3 className="text-slate-700 font-bold text-base">No orders found</h3>
                                        <p className="text-slate-400 text-xs mt-1">
                                            {orderFilter === 'pending'
                                                ? 'You have responded to all customer requests! 🎉'
                                                : 'When buyers purchase your products in the marketplace, requests appear here.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {displayedOrders.slice().reverse().map((order) => {
                                            const isAccepted = order.status === 'Accepted!';
                                            const orderDate = order.orderDate
                                                ? new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : 'Recently';
                                            const isAccepting = acceptingOrderId === order._id;

                                            return (
                                                <div
                                                    key={order._id}
                                                    className="p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                                >
                                                    {/* Order Info */}
                                                    <div className="flex items-start gap-3.5">
                                                        <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0">
                                                            🌾
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className="font-bold text-slate-800 text-base">{order.title}</h4>
                                                                <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                                    #{order._id.slice(-6)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                                                                <span className="font-semibold text-slate-700">₹{order.price}</span>
                                                                <span>•</span>
                                                                <span>Qty: {order.quantity || 1} kg</span>
                                                                <span>•</span>
                                                                <span>Total: <strong className="text-emerald-700 font-bold">₹{((order.price || 0) * (order.quantity || 1)).toLocaleString('en-IN')}</strong></span>
                                                                <span>•</span>
                                                                <span className="text-slate-400">📅 {orderDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions & Status Pill */}
                                                    <div className="flex items-center gap-3 self-end sm:self-center">
                                                        {isAccepted ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
                                                                Accepted
                                                            </span>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                                                    <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                                                                    Pending
                                                                </span>
                                                                <button
                                                                    onClick={() => handleAcceptOrder(order)}
                                                                    disabled={isAccepting}
                                                                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                                                                >
                                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                                    {isAccepting ? 'Accepting...' : 'Accept Order'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── SECTION B: My Listed Produce (Quick Stock Overview) ── */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            
                            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faSeedling} className="text-emerald-600" />
                                        My Active Listings ({FarmerSellProducts.length})
                                    </h2>
                                    <p className="text-slate-400 text-xs mt-0.5">Quickly check remaining stock and pricing</p>
                                </div>
                                <Link
                                    to="/addProducts"
                                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faPen} className="text-[10px]" />
                                    Manage & Edit Prices
                                </Link>
                            </div>

                            <div className="pt-5">
                                {FarmerSellProducts.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <div className="text-5xl mb-3">🌱</div>
                                        <h3 className="text-slate-700 font-bold">No farm products listed yet</h3>
                                        <p className="text-slate-400 text-xs mt-1 mb-4">Start selling your harvest directly to customers and dealers.</p>
                                        <Link to="/addProducts" className="inline-block bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow hover:bg-emerald-500 transition-colors">
                                            + Add Your First Product
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {FarmerSellProducts.slice().reverse().slice(0, 6).map((product) => {
                                            const catInfo = getCatInfo(product.category);
                                            return (
                                                <div
                                                    key={product._id}
                                                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200 bg-gradient-to-b from-white to-slate-50/50 flex flex-col justify-between"
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between gap-1 mb-2">
                                                            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 flex items-center gap-1">
                                                                <span>{catInfo.emoji}</span>
                                                                <span>{catInfo.label}</span>
                                                            </span>
                                                            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                                                {product.quantity} kg
                                                            </span>
                                                        </div>

                                                        <h4 className="font-bold text-slate-800 text-sm truncate" title={product.title}>
                                                            {product.title}
                                                        </h4>
                                                        <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">{product.description}</p>
                                                    </div>

                                                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                                        <span className="text-emerald-700 font-black text-base">
                                                            ₹{product.rate}<span className="text-[10px] text-slate-400 font-normal">/kg</span>
                                                        </span>
                                                        <Link
                                                            to="/addProducts"
                                                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 bg-white hover:bg-emerald-50 px-2 py-1 rounded-lg border border-slate-200"
                                                        >
                                                            <FontAwesomeIcon icon={faPen} className="text-[9px]" /> Edit
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
                        RIGHT COLUMN: Profile, Quick Tools & Advisory (4 cols)
                    ─────────────────────────────────────────────────────────── */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* ── CARD 1: Farm & Farmer Profile ── */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faHome} className="text-emerald-600" />
                                Farm Profile
                            </h3>

                            <div className="space-y-3.5">
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faUser} className="text-sm" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase">Farmer Name</p>
                                        <p className="text-sm font-bold text-slate-800 truncate">
                                            {FarmerAllData.firstName} {FarmerAllData.lastName || ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase">Contact Email</p>
                                        <p className="text-sm font-bold text-slate-800 truncate">{FarmerAllData.email || '—'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faHome} className="text-sm" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase">Farm Facility</p>
                                        <p className="text-sm font-bold text-slate-800 truncate">{FarmerAllData.farmName || 'Direct Farm'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-400 font-semibold uppercase">Location Address</p>
                                        <p className="text-xs font-semibold text-slate-700 leading-snug">
                                            {FarmAddress.district
                                                ? `${FarmAddress.district}, ${FarmAddress.state} - PIN ${FarmAddress.pincode}`
                                                : 'Not configured'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── CARD 2: Quick Agri Tools & Shortcuts ── */}
                        <div className="bg-gradient-to-br from-emerald-900 to-green-950 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />

                            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                                <FontAwesomeIcon icon={faSeedling} className="text-emerald-400" />
                                Agri Services & Tools
                            </h3>
                            <p className="text-emerald-200 text-xs mb-4">Empowering your farm with modern digital agriculture</p>

                            <div className="space-y-2.5">
                                <Link
                                    to="/weather"
                                    className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faCloudSun} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">Weather & Advisory</p>
                                            <p className="text-[10px] text-emerald-300">Live rain & temp forecast</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
                                </Link>

                                <Link
                                    to="/chatbot"
                                    className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faRobot} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">AI Farming Assistant</p>
                                            <p className="text-[10px] text-emerald-300">Ask crop & pest questions</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
                                </Link>

                                <Link
                                    to="/connectGov"
                                    className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-400/20 text-teal-300 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faLandmark} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">Government Schemes</p>
                                            <p className="text-[10px] text-emerald-300">Subsidies, PM-Kisan & portals</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
                                </Link>

                                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-400/20 text-blue-300 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faTruckFast} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">Delivery Network</p>
                                            <p className="text-[10px] text-emerald-300">3rd-party logistics ready</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── CARD 3: My Agri Articles & Knowledge Sharing ── */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faHeart} className="text-rose-500" />
                                    My Articles & Tips
                                </h3>
                                <Link to="/create" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                                    + Write
                                </Link>
                            </div>

                            {FarmerAllBlogs.length === 0 ? (
                                <div className="text-center py-6 text-slate-400 text-xs">
                                    <p>Share your farming experiences and tips with the community!</p>
                                    <Link to="/create" className="mt-2 inline-block font-semibold text-emerald-600 hover:underline">
                                        Write your first post
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {FarmerAllBlogs.slice(0, 4).map(blog => (
                                        <Link
                                            key={blog._id}
                                            to={`/blogs/${blog._id}`}
                                            className="block p-3 rounded-2xl hover:bg-emerald-50/40 border border-slate-100 transition-colors"
                                        >
                                            <p className="font-bold text-slate-800 text-xs line-clamp-1">{blog.title}</p>
                                            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                                                <span className="text-rose-500 font-semibold flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faHeart} className="text-[9px]" /> {blog.likes || 0} likes
                                                </span>
                                                <span>Read article →</span>
                                            </div>
                                        </Link>
                                    ))}
                                    {FarmerAllBlogs.length > 4 && (
                                        <Link to="/manage-blogs" className="block text-center text-xs font-bold text-emerald-600 hover:underline pt-1">
                                            View all {FarmerAllBlogs.length} articles →
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>

            <Toaster position="top-right" />
        </div>
    );
};

export default Dashboard;
