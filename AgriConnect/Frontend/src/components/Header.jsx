import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUserPlus, faSignInAlt, faUser, faEnvelope, faCog, faSignOutAlt, faBars, faTimes, faSeedling, faBox, faShoppingBag, faPen, faCartArrowDown, faReorder, faDashboard, faHome, faMapMarkedAlt, faStore, faChartArea, faMarker, faArrowPointer, faComments, faMessage, faCloud, faLink } from '@fortawesome/free-solid-svg-icons';
import { boolAtom } from './Loged';
import { useRecoilState } from 'recoil';
import { customerAtom } from './customerAtom';
import { FarmerAtom } from './farmerAtom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
const Header = () => {
    const [side, setSide] = useState(false);
    const [verified, setVerified] = useRecoilState(boolAtom);
    const [isHovered, setHovered] = useState(false);
    const navigate = useNavigate()
    const [userBool, setUserBool] = useRecoilState(customerAtom)
    const [farmerBool, setFarmerBool] = useRecoilState(FarmerAtom)
    const [currentUser, setCurrentUser] = useState('')
    const [currentName,setCurrentName] = useState('')
    
    function setUp() {
        setSide(!side);
    }
    // FARMER-DATA----
    useEffect(()=>{
        const fetch = async ()=>{
            try{
                const farmerID = localStorage.getItem('FarmerId')
                // console.log("FarmerID: ",farmerID)
                if(farmerID){
                    const response = await axios.get(`${API_BASE_URL}/currentFarmerData?FarmerID=${farmerID}`)
                    if(response.status === 200){
                        const data = response.data.farmerData
                        console.log(data)
                        setCurrentUser(data)
                        const Name = response.data.farmerData.email.split('@')[0]
                        setCurrentName(Name)
                    }
                }else{
                    console.log("FarmerId not present")
                }
            }catch(err){
                if(err.response && err.response.status === 300){
                    console.log("Farmer is not LOgged")
                }else{
                    console.log("ERROR",err)
                }
            }
        }
        fetch()
    },[side])
    // USER-DATA----
    useEffect(()=>{
        const fetch = async ()=>{
            try{
                const userID = localStorage.getItem('UserId')
                if(userID){
                    const response = await axios.get(`${API_BASE_URL}/currentUserData?userId=${userID}`)
                    if(response.status === 200){
                        const data = response.data.userData
                        // console.log(data)
                        setCurrentUser(data)
                        const Name = response.data.userData.email.split('@')[0]
                        // console.log(Name)
                        setCurrentName(Name)
                    }
                }else{
                    console.log("userId not present")
                }
            }catch(err){
                if(err.response && err.response.status === 404){
                    console.log("User is not LOgged In")
                }else if(err.response && err.response.status === 300){
                    console.log("User is not LOgged In")
                }else{
                    console.log("ERROR",err)
                }
            }
        }
        fetch()
    },[side])

    useEffect(()=>{
        const farmerId = localStorage.getItem('FarmerId')
        const token = localStorage.getItem('token')
        const UserID = localStorage.getItem('UserId')
        if( farmerId && token ){
            setFarmerBool(true)
            setVerified(true);
        }else if( UserID && token){
            setFarmerBool(false)
            setVerified(true);
        }else{
            setVerified(false)
        }
    },[verified])
    
    const HandleLogOut = ()=>{
        localStorage.removeItem('FarmerId')
        localStorage.removeItem('token')
        localStorage.removeItem('UserId')
        setVerified(false)
        setFarmerBool(false)
        setUp()
        navigate('/login')
    }

    // const verified = useRecoilValue(boolAtom);
    // console.log(verified)


    const toggleHover = () => {
        setHovered(!isHovered);
    };
    const navigateToDashboard = ()=>{
        navigate('/dashboard')
        toast.success('Your Dashboard')
    }
    const HandleBOOL = ()=>{
        setFarmerBool(true)
    }

    return (
        // <header className="flex items-center justify-between bg-green-600 p-4 h-20 w-full">
        <header className="flex items-center justify-between bg-green-800 shadow-xl p-4 h-20 w-full">

            <div className="flex items-center justify-between p-0 sm:p-1 ">
                
            <div className="hidden sm:block">
                <FontAwesomeIcon icon={faSeedling} className="text-gray-100 text-3xl sm:p-0" />
            </div>

                <div className="hidden md:block text-white text-xl font-bold">
                    AgroConnect
                </div>
                {/* {farmerBool ? <>Yes</> : <>No</>} */}

            </div>

            <nav className="flex sm:space-x-4 space-x-3 ">
                <Link to="/" className="text-gray-100  font-medium hover:underline  md:text-xl sm:text-lg"><FontAwesomeIcon className=' mx-1' icon={faHome} ></FontAwesomeIcon>Home</Link>
                <Link to="/weather" className="text-gray-100  font-medium hover:underline  md:text-xl sm:text-lg"><FontAwesomeIcon className=' mx-1' icon={faCloud} ></FontAwesomeIcon>Weather</Link>
                <Link to="/marketplace" className="text-gray-100  font-medium hover:underline  md:text-xl sm:text-lg "><FontAwesomeIcon className='mx-1' icon={faStore} ></FontAwesomeIcon>Market</Link>
                <Link to="/chatbot" className=" text-gray-100  font-medium  hover:underline   md:text-xl sm:text-lg "><FontAwesomeIcon className='mx-1' icon={faComments} ></FontAwesomeIcon>AgroHelp</Link>
                <Link to="/blogsList" className=" text-gray-100  font-medium  hover:underline   md:text-xl sm:text-lg "><FontAwesomeIcon className='mx-1' icon={faMarker} ></FontAwesomeIcon>Blogs</Link>
            </nav>
        
            {verified ? (
                <>
                    <div 
                        className="relative flex items-center justify-center" 
                        onMouseEnter={toggleHover} 
                        onMouseLeave={toggleHover}
                    >
                        
                        <button 
                            onClick={setUp} 
                            className={`text-gray-700 transition-transform duration-300 ${
                                isHovered ? 'transform scale-110' : ''
                            }`}
                        >
                            <FontAwesomeIcon className="text-gray-100 w-6 h-6" icon={faUser}  />
                        </button>

                        {isHovered && (
                            <span  className="absolute top-full mt-0 text-sm font-medium text-gray-700 bg-white shadow-lg px-2 py-1 rounded transform transition-opacity duration-300 opacity-100">
                                Profile
                            </span>
                        )}
                    </div>
                

                    
                    {side && <div className=" fixed inset-0 bg-black opacity-50 z-40" onClick={setUp}></div>}

                    
                    <div className={` bg-green-800 rounded-xl fixed right-0 top-0 h-full sm:w-96 w-56 shadow-lg transform transition-transform ease-in-out duration-300 z-50 ${side ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="p-4 sm:p-0">
                            <h2 className="text-2xl text-gray-100 font-semibold mb-2 text-center mt-3">Your Account</h2>
                            {/* {farmerBool ? <>Yes</> : <>No</>} */}
                            <ul className="space-y-0">
                                <div className=' bg-gray-100 flex-col w-auto h-28 p-4 rounded-xl space-y-2 sm:h-24 sm:px-6 sm:mx-6 sm:space-y-3 sm:mb-0'>
                                    <li className="flex items-center">
                                        <FontAwesomeIcon icon={faUser} className="text-purple-800 sm:text-xl" />
                                        <span className="ml-2 sm:ml-3 sm:text-lg">Username: {currentName}</span>
                                    </li>
                                    <li className="flex items-center">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-purple-800 sm:text-xl" />
                                        <span className="ml-2 sm:ml-3 sm:text-lg">Email: {currentUser.email}</span>
                                    </li>
                                </div>
                                {farmerBool ? 
                                    <>
                                        <div className="bg-green-800 p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-4">
                                            <ul className="space-y-4">
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                                                    <li className="flex font-medium items-center bg-gray-100 h-16 w-full p-3 rounded-xl hover:bg-gray-50 transition-all">
                                                        <FontAwesomeIcon icon={faDashboard} className="text-purple-800 text-xl" />
                                                        <span className="ml-3 text-lg">
                                                            <a href='/dashboard' className="hover:underline">Dashboard</a>
                                                        </span>
                                                    </li>
                                                    <li className="flex font-medium items-center bg-gray-100 h-16 w-full p-3 rounded-xl hover:bg-gray-300 transition-all">
                                                        <FontAwesomeIcon icon={faCartArrowDown} className="text-purple-800 text-xl" />
                                                        <span className="ml-3 text-lg">
                                                            <a href='/userProducts' className="hover:underline">My Products</a>
                                                        </span>
                                                    </li>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <li className="flex font-medium items-center bg-gray-100 h-16 w-full p-3 rounded-xl hover:bg-gray-300 transition-all">
                                                        <FontAwesomeIcon icon={faPen} className="text-purple-800 text-xl" />
                                                        <span className="ml-3 text-lg">
                                                            <a href={'/manage-blogs'} className='hover:underline'>My Blogs</a>
                                                        </span>
                                                    </li>
                                                    <li className="flex font-medium items-center bg-gray-100 h-16 w-full p-3 rounded-xl hover:bg-gray-300 transition-all">
                                                        <FontAwesomeIcon icon={faCog} className="text-purple-800 text-xl" />
                                                        <span className="ml-3 text-lg">Settings</span>
                                                    </li>
                                                </div>

                                                <li className="flex items-center bg-gray-100 h-12 w-full p-3 rounded-xl hover:bg-gray-300 transition-all">
                                                    <FontAwesomeIcon icon={faMessage} className="text-purple-800 text-xl" />
                                                    <span className="ml-3 font-medium text-lg">
                                                        <a href='/OrderMessage' className=" hover:underline">Order Messages</a>
                                                    </span>
                                                </li>
                                                <li className="flex items-center bg-gray-100 h-12 w-full p-3 rounded-xl hover:bg-gray-300 transition-all">
                                                    <FontAwesomeIcon icon={faLink} className="text-purple-800 text-xl" />
                                                    <span className="ml-3 font-medium text-lg">
                                                        <a href='/connectGov' className=" hover:underline">AgriLinkGov </a>
                                                    </span>
                                                </li>
                                                <li className="flex items-center bg-gray-100 h-12 w-full p-3 rounded-xl hover:bg-gray-300 transition-all">
                                                    <FontAwesomeIcon icon={faSignOutAlt} className="text-purple-800 text-xl" />
                                                    <button className="font-medium ml-3 text-lg" onClick={HandleLogOut}>Logout</button>
                                                </li>
                                            </ul>
                                        </div>
                                    </>

                                    :
                                    <>
                                        
                                        <div className="bg-green-800 p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-4">
                                            <ul className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <li className="flex items-center bg-gray-100 h-16 w-full p-3 rounded-xl hover:bg-gray-300 transition-all">
                                                    <FontAwesomeIcon icon={faPen} className="text-purple-800 text-xl" />
                                                    <span className="ml-3 text-lg">
                                                        <a href={'/MyOrdersUser'} className='hover:underline'>My Orders</a>
                                                    </span>
                                                </li>
                                                <li className="flex items-center bg-gray-100 h-16 w-full p-3 rounded-xl hover:bg-gray-300 transition-all">
                                                    <FontAwesomeIcon icon={faCog} className="text-purple-800 text-xl" />
                                                    <span className="ml-3 text-lg">Settings</span>
                                                </li>
                                            </div>
                                            <li className="flex items-center bg-gray-100 h-16 sm:h-12 w-full p-3 rounded-xl hover:bg-gray-300 transition-all">
                                                <FontAwesomeIcon icon={faPen} className="text-purple-800 text-xl" />
                                                <span className="ml-3 text-lg">
                                                    <a href={'/manage-blogs'} className='hover:underline'>My Blogs</a>
                                                </span>
                                            </li>
                                            <li className="flex items-center bg-gray-100 h-16 sm:h-12 w-full p-3 rounded-xl hover:bg-gray-300 transition-all">
                                                <FontAwesomeIcon icon={faSignOutAlt} className="text-purple-800 text-xl" />
                                                <button className="ml-3 text-lg" onClick={HandleLogOut}>Logout</button>
                                            </li>
                                            </ul>
                                        </div>
                                    </>
                                }
                            </ul>
                        </div>
                    </div> 
                    <></>
                </>
            ) : (
                <HeaderWithAuthPanel/>
            )}
        </header>
    );
};





function HeaderWithAuthPanel() {
    const [isAuthPanelOpen, setAuthPanelOpen] = useState(false);

    
    const toggleAuthPanel = () => {
        setAuthPanelOpen(!isAuthPanelOpen);
    };

    return (
        <div className=" p-1 flex items-center justify-between">
            
            <button onClick={toggleAuthPanel} className="md:hidden ">
                <FontAwesomeIcon icon={faBars} className="text-gray-100 w-8 h-8 " />
            </button>

            <div className="hidden md:flex items-center justify-end space-x-4">
                <Link to="/signup" className="text-gray-100 flex items-center">
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2 " />
                    <p className="font-medium text-lg">Signup</p>
                </Link>
                <Link to="/login" className="text-gray-100 flex items-center">
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                    <p className="font-medium text-lg">Login</p>
                </Link>
            </div>

            
            {isAuthPanelOpen && (
                <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={toggleAuthPanel}></div>
            )}

            <div className={`fixed right-0 top-0 h-full w-60 bg-white shadow-lg transform transition-transform ease-in-out duration-300 z-50 ${isAuthPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4">
                    <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
                    <ul className="space-y-4">
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faUserPlus} className="text-purple-800" />
                            <Link to="/signup" className="ml-2 text-blue-600 hover:underline" onClick={toggleAuthPanel}>Signup</Link>
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faSignInAlt} className="text-purple-800" />
                            <Link to="/login" className="ml-2 text-blue-600 hover:underline"onClick={toggleAuthPanel}>Login</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header;
