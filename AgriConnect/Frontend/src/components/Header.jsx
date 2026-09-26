import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserPlus, faSignInAlt, faUser, faEnvelope, faCog,
    faSignOutAlt, faBars, faTimes, faSeedling, faCartArrowDown,
    faDashboard, faHome, faStore, faComments, faMarker,
    faCloud, faLink, faPen, faMessage, faBoxOpen, faExchangeAlt, faTractor
} from '@fortawesome/free-solid-svg-icons';
import { boolAtom } from './Loged';
import { useRecoilState } from 'recoil';
import { customerAtom } from './customerAtom';
import { FarmerAtom } from './farmerAtom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

const NAV_LINKS = [
    { to: '/',           icon: faHome,     label: 'Home'     },
    { to: '/weather',    icon: faCloud,    label: 'Weather'  },
    { to: '/marketplace',icon: faStore,    label: 'Market'   },
    { to: '/chatbot',    icon: faComments, label: 'AgroHelp' },
    { to: '/blogsList',  icon: faMarker,   label: 'Blogs'    },
];

const Header = () => {
    const [sideOpen, setSideOpen]         = useState(false);
    const [mobileOpen, setMobileOpen]     = useState(false);
    const [verified, setVerified]         = useRecoilState(boolAtom);
    const [isHovered, setHovered]         = useState(false);
    const navigate                        = useNavigate();
    const [userBool, setUserBool]         = useRecoilState(customerAtom);
    const [farmerBool, setFarmerBool]     = useRecoilState(FarmerAtom);
    const [currentUser, setCurrentUser]   = useState({});
    const [currentName, setCurrentName]   = useState('');
    const [scrolled, setScrolled]         = useState(false);
    const [activeMode, setActiveMode]     = useState(
        () => localStorage.getItem('activeMode') || 'kendra'
    );

    const handleToggleMode = () => {
        const nextMode = activeMode === 'kendra' ? 'farmer' : 'kendra';
        setActiveMode(nextMode);
        localStorage.setItem('activeMode', nextMode);
        toast.success(`Switched to ${nextMode === 'kendra' ? '🏪 Kisan Seva Kendra' : '🚜 Farmer'} Mode!`, {
            icon: nextMode === 'kendra' ? '🏪' : '🚜',
            duration: 2500
        });
    };

    /* ── scroll shadow ──────────────── */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* ── fetch farmer ───────────────── */
    useEffect(() => {
        const fetchFarmer = async () => {
            try {
                const farmerID = localStorage.getItem('FarmerId');
                if (farmerID) {
                    const res = await axios.get(`${API_BASE_URL}/currentFarmerData?FarmerID=${farmerID}`);
                    if (res.status === 200) {
                        setCurrentUser(res.data.farmerData);
                        setCurrentName(res.data.farmerData.email.split('@')[0]);
                    }
                }
            } catch (err) { console.log('Farmer fetch error', err); }
        };
        fetchFarmer();
    }, [sideOpen]);

    /* ── fetch user ─────────────────── */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userID = localStorage.getItem('UserId');
                if (userID) {
                    const res = await axios.get(`${API_BASE_URL}/currentUserData?userId=${userID}`);
                    if (res.status === 200) {
                        setCurrentUser(res.data.userData);
                        setCurrentName(res.data.userData.email.split('@')[0]);
                    }
                }
            } catch (err) { console.log('User fetch error', err); }
        };
        fetchUser();
    }, [sideOpen]);

    /* ── auth state ─────────────────── */
    useEffect(() => {
        const farmerId = localStorage.getItem('FarmerId');
        const token    = localStorage.getItem('token');
        const userId   = localStorage.getItem('UserId');
        if (farmerId && token)      { setFarmerBool(true);  setVerified(true);  }
        else if (userId && token)   { setFarmerBool(false); setVerified(true);  }
        else                        { setVerified(false); }
    }, [verified]);

    const handleLogOut = () => {
        localStorage.removeItem('FarmerId');
        localStorage.removeItem('token');
        localStorage.removeItem('UserId');
        localStorage.removeItem('role');
        localStorage.removeItem('kendraName');
        setVerified(false);
        setFarmerBool(false);
        setSideOpen(false);
        navigate('/login');
    };

    const storedRole = localStorage.getItem('role');
    const isSupplier = storedRole === 'Supplier' || currentUser?.youAre === 'Supplier';
    const displayName = isSupplier 
        ? (currentUser?.farmName || localStorage.getItem('kendraName') || currentName) 
        : currentName;

    return (
        <>
            {/* ══ HEADER BAR ═══════════════════════════════════════════════ */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-emerald-900/95 backdrop-blur-lg shadow-2xl shadow-black/20'
                        : 'bg-emerald-900/90 backdrop-blur-md'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <FontAwesomeIcon icon={faSeedling} className="text-white text-base" />
                        </div>
                        <span className="hidden sm:block text-white font-bold text-lg tracking-wide">
                            Agro<span className="text-lime-400">Connect</span>
                        </span>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(({ to, icon, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-200 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={icon} className="text-lime-400 text-xs" />
                                {label}
                            </Link>
                        ))}

                        {/* Direct Shortcuts & Mode Switcher for Kendra / Supplier */}
                        {verified && isSupplier && (
                            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/20">
                                {/* Mode Switcher Pill */}
                                <button
                                    type="button"
                                    onClick={handleToggleMode}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all duration-200 shadow-sm ${
                                        activeMode === 'kendra'
                                            ? 'bg-amber-400/20 border-amber-400/50 text-amber-200 hover:bg-amber-400/30'
                                            : 'bg-lime-400/20 border-lime-400/50 text-lime-200 hover:bg-lime-400/30'
                                    }`}
                                    title="Toggle between Kendra store and Farmer crop mode"
                                >
                                    <FontAwesomeIcon icon={activeMode === 'kendra' ? faStore : faTractor} className="text-xs" />
                                    <span>{activeMode === 'kendra' ? 'Kendra' : 'Farmer'}</span>
                                    <FontAwesomeIcon icon={faExchangeAlt} className="text-[10px] text-white/60 ml-0.5" />
                                </button>

                                {activeMode === 'kendra' ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded-lg transition"
                                        >
                                            <FontAwesomeIcon icon={faDashboard} className="text-amber-300" />
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/userProducts"
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 rounded-lg transition"
                                        >
                                            <FontAwesomeIcon icon={faCartArrowDown} className="text-emerald-300" />
                                            Supplies
                                        </Link>
                                        <Link
                                            to="/OrderMessage"
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 rounded-lg transition"
                                        >
                                            <FontAwesomeIcon icon={faMessage} className="text-cyan-300" />
                                            Orders
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-lime-200 bg-lime-500/20 hover:bg-lime-500/30 border border-lime-400/40 rounded-lg transition"
                                        >
                                            <FontAwesomeIcon icon={faDashboard} className="text-lime-300" />
                                            Farm Hub
                                        </Link>
                                        <Link
                                            to="/userProducts"
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 rounded-lg transition"
                                        >
                                            <FontAwesomeIcon icon={faCartArrowDown} className="text-emerald-300" />
                                            My Crops
                                        </Link>
                                        <Link
                                            to="/marketplace"
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 rounded-lg transition"
                                        >
                                            <FontAwesomeIcon icon={faStore} className="text-cyan-300" />
                                            Farmer Store
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </nav>

                    {/* ── Right Side ── */}
                    <div className="flex items-center gap-2">

                        {verified ? (
                            <>
                                {/* Avatar button */}
                                <button
                                    onClick={() => setSideOpen(true)}
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                    className="relative flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200"
                                >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase ${
                                        isSupplier 
                                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900' 
                                            : 'bg-gradient-to-br from-lime-400 to-emerald-500'
                                    }`}>
                                        {isSupplier ? <FontAwesomeIcon icon={faStore} /> : (displayName?.[0] || <FontAwesomeIcon icon={faUser} />)}
                                    </div>
                                    <span className="hidden sm:block max-w-[120px] truncate">{displayName || 'Account'}</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Desktop auth buttons */}
                                <div className="hidden md:flex items-center gap-2">
                                    <Link
                                        to="/signup"
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white border border-white/25 rounded-xl hover:bg-white/10 transition-all duration-200"
                                    >
                                        <FontAwesomeIcon icon={faUserPlus} className="text-lime-400 text-xs" />
                                        Sign Up
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-900 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-xl hover:scale-105 shadow-md shadow-lime-500/20 transition-all duration-200"
                                    >
                                        <FontAwesomeIcon icon={faSignInAlt} className="text-xs" />
                                        Login
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-all"
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── spacer so content doesn't hide under fixed header ── */}
            <div className="h-16" />

            {/* ══ PROFILE SIDE DRAWER ══════════════════════════════════════ */}
            {sideOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSideOpen(false)}>
                    <div
                        className="w-80 h-full bg-emerald-900 shadow-2xl overflow-y-auto flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Drawer header */}
                        <div className={`px-6 py-5 ${
                            isSupplier 
                                ? 'bg-gradient-to-r from-teal-800 to-emerald-700' 
                                : 'bg-gradient-to-r from-emerald-700 to-green-600'
                        }`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-white font-bold text-lg">My Account</h2>
                                <button onClick={() => setSideOpen(false)} className="text-white/70 hover:text-white transition-colors">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            {/* User card */}
                            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg uppercase flex-shrink-0 ${
                                    isSupplier 
                                        ? 'bg-gradient-to-br from-amber-300 to-orange-400 text-slate-900' 
                                        : 'bg-gradient-to-br from-lime-300 to-emerald-400 text-emerald-900'
                                }`}>
                                    {isSupplier ? <FontAwesomeIcon icon={faStore} className="text-base" /> : (displayName?.[0] || '?')}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                                    <p className="text-emerald-200 text-xs truncate">{currentUser?.email}</p>
                                    <span className={`inline-block mt-1 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                        isSupplier 
                                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                                            : farmerBool 
                                                ? 'bg-lime-400/20 text-lime-300' 
                                                : 'bg-emerald-400/20 text-emerald-300'
                                    }`}>
                                        {isSupplier ? 'Kisan Seva Kendra' : (farmerBool ? 'Farmer' : 'Customer')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Menu items */}
                        <div className="flex-1 px-4 py-5 space-y-2">
                            {isSupplier ? (
                                <>
                                    {/* Active Workspace Banner & Switcher */}
                                    <div className="p-3 bg-white/10 rounded-2xl border border-white/15 mb-3">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Active Workspace</span>
                                            <button
                                                onClick={handleToggleMode}
                                                className="flex items-center gap-1 px-2.5 py-1 bg-lime-400 hover:bg-lime-300 text-emerald-950 text-xs font-bold rounded-lg transition shadow"
                                            >
                                                <FontAwesomeIcon icon={faExchangeAlt} className="text-[10px]" />
                                                <span>Switch</span>
                                            </button>
                                        </div>
                                        <p className="text-sm font-extrabold text-white flex items-center gap-2">
                                            {activeMode === 'kendra' ? (
                                                <>
                                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                                    <span>🏪 Kendra Mode</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                                                    <span>🚜 Farmer Crop Mode</span>
                                                </>
                                            )}
                                        </p>
                                        <p className="text-[11px] text-emerald-200/80 mt-1 leading-snug">
                                            {activeMode === 'kendra'
                                                ? 'Managing equipment inventory, seed stock & farmer supply orders.'
                                                : 'Managing your own farm produce, harvest sales & local mandi.'}
                                        </p>
                                    </div>

                                    {activeMode === 'kendra' ? (
                                        <>
                                            <DrawerItem icon={faDashboard}    label="Kendra Dashboard"          href="/dashboard"   />
                                            <DrawerItem icon={faCartArrowDown} label="My Equipment & Supplies"  href="/userProducts" />
                                            <DrawerItem icon={faMessage}      label="Order Messages & Requests" href="/OrderMessage" />
                                            <DrawerItem icon={faPen}          label="My Blogs & Advisory"       href="/manage-blogs" />
                                            <DrawerItem icon={faLink}         label="AgriLink Gov"              href="/connectGov"   />
                                            <DrawerItem icon={faCog}          label="Settings"                  href="#"             />
                                        </>
                                    ) : (
                                        <>
                                            <DrawerItem icon={faDashboard}    label="My Farm Dashboard"         href="/dashboard"   />
                                            <DrawerItem icon={faCartArrowDown} label="My Harvest & Crops"       href="/userProducts" />
                                            <DrawerItem icon={faStore}         label="Farmer Store (Buy Inputs)" href="/marketplace"  />
                                            <DrawerItem icon={faMessage}       label="Buyer Order Messages"     href="/OrderMessage" />
                                            <DrawerItem icon={faPen}          label="My Blogs"                  href="/manage-blogs" />
                                            <DrawerItem icon={faLink}         label="AgriLink Gov"              href="/connectGov"   />
                                            <DrawerItem icon={faCog}          label="Settings"                  href="#"             />
                                        </>
                                    )}
                                </>
                            ) : farmerBool ? (
                                <>
                                    {/* Upgrade Banner for Regular Farmer */}
                                    <div className="p-3 bg-gradient-to-br from-amber-500/15 to-emerald-500/15 border border-amber-400/30 rounded-2xl mb-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                                                <FontAwesomeIcon icon={faStore} className="text-amber-400" />
                                                Own an Agro Store?
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setSideOpen(false);
                                                    navigate('/signup?role=kendra');
                                                }}
                                                className="text-[11px] font-bold text-lime-300 hover:text-white underline underline-offset-2"
                                            >
                                                Open Kendra →
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-emerald-200/80 leading-relaxed">
                                            Supply fertilizers, seeds, or rent tractors to fellow farmers with dual-mode access.
                                        </p>
                                    </div>
                                    <DrawerItem icon={faDashboard}    label="My Dashboard"   href="/dashboard"   />
                                    <DrawerItem icon={faCartArrowDown} label="My Products"   href="/userProducts" />
                                    <DrawerItem icon={faPen}          label="My Blogs"       href="/manage-blogs" />
                                    <DrawerItem icon={faMessage}      label="Order Messages" href="/OrderMessage" />
                                    <DrawerItem icon={faLink}         label="AgriLink Gov"   href="/connectGov"   />
                                    <DrawerItem icon={faCog}          label="Settings"       href="#"             />
                                </>
                            ) : (
                                <>
                                    <DrawerItem icon={faBoxOpen}  label="My Orders"  href="/MyOrdersUser" />
                                    <DrawerItem icon={faPen}      label="My Blogs"   href="/manage-blogs" />
                                    <DrawerItem icon={faCog}      label="Settings"   href="#"             />
                                </>
                            )}
                        </div>

                        {/* Logout */}
                        <div className="px-4 pb-6">
                            <button
                                onClick={handleLogOut}
                                className="w-full flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 border border-red-400/30 text-red-300 hover:text-red-200 font-semibold px-4 py-3 rounded-xl transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ MOBILE NAV DRAWER ════════════════════════════════════════ */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end md:hidden" onClick={() => setMobileOpen(false)}>
                    <div
                        className="w-72 h-full bg-emerald-900 shadow-2xl flex flex-col overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Mobile drawer header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faSeedling} className="text-white text-sm" />
                                </div>
                                <span className="text-white font-bold">Agro<span className="text-lime-400">Connect</span></span>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        {/* Mobile nav links */}
                        <div className="flex-1 px-4 py-5 space-y-1">
                            {NAV_LINKS.map(({ to, icon, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-medium"
                                >
                                    <FontAwesomeIcon icon={icon} className="text-lime-400 w-4" />
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile auth */}
                        {!verified && (
                            <div className="px-4 pb-6 space-y-2 border-t border-white/10 pt-4">
                                <Link
                                    to="/signup"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-3 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                                >
                                    <FontAwesomeIcon icon={faUserPlus} className="text-lime-400" /> Sign Up
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-lime-400 to-emerald-400 text-emerald-900 font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg"
                                >
                                    <FontAwesomeIcon icon={faSignInAlt} /> Login
                                </Link>
                            </div>
                        )}
                        {verified && (
                            <div className="px-4 pb-6 border-t border-white/10 pt-4">
                                <button
                                    onClick={handleLogOut}
                                    className="w-full flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 border border-red-400/30 text-red-300 font-semibold px-4 py-3 rounded-xl transition-all"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

/* ─── Drawer menu item ───────────────────────────── */
const DrawerItem = ({ icon, label, href }) => (
    <a
        href={href}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-gray-200 hover:text-white font-medium transition-all duration-200 group"
    >
        <div className="w-8 h-8 rounded-lg bg-emerald-700/50 group-hover:bg-lime-400/20 flex items-center justify-center flex-shrink-0 transition-colors">
            <FontAwesomeIcon icon={icon} className="text-lime-400 text-sm" />
        </div>
        <span className="text-sm">{label}</span>
    </a>
);

export default Header;
