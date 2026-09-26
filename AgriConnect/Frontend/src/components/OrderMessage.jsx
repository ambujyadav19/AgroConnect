import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../config';

const OrderMessage = () => {
    const [farmerData,setFarmerData] = useState([])
    const [FarmerAllData,setFarmerAllData] = useState([])
    const [farmerName,setFarmerName] = useState("")
    const [farmerEmail,setFarmerEmail] = useState("")
    const [customers,setCustomers] = useState([])
    const [products, setProducts] = useState([])
    const [FarmAddress, setFarmAddress] = useState([])
    const [fetched,setFetched] = useState(true)
    const [selectOrderBool,setSelectOrderBool] = useState(false)
    const [AcceptBool,setAcceptBool] = useState(true)
    const [fetchFarm,setFetchFarm] = useState(true)
    const [ShowSelectData,setShowSelectData] = useState(true)
    const [OpenCustomer,setOpenCustomer] = useState([])
    const [selectedProductData,setSelectedProductData] = useState([])
    const [selectedBuyerData,setSelectedBuyerData] = useState([])
    const [ProTitle,setProTitle] = useState('')
    const [ProPrice,setProPrice] = useState('')
    const [ProQuantity,setProQuantity] = useState('')
    const [ProLocation,setProLocation] = useState('')
    const [UserAddress,setUserAddress] = useState('')
    const [FarmerID,setFarmerID] = useState('')
    const [BuyerID,setBuyerID] = useState('')


    useEffect(()=>{
        const fetch = async ()=>{
            try{
                const farmerID = localStorage.getItem('FarmerId')
                console.log("FarmerID: ",farmerID)
                if(farmerID){
                    const response = await axios.get(`${API_BASE_URL}/currentFarmerData?FarmerID=${farmerID}`)
                    if(response.status === 200){
                        const data = response.data.farmerData
                        setFarmerAllData(data)
                        const ordeR = data.order
                        console.log("Data: ",data)
                        const FarmADdress = data.farmLocation[0]
                        setFarmAddress(FarmADdress)
                        console.log("Order: ",ordeR)
                        if(data.length > 0){
                            setFarmerData(ordeR)
                            
                        }
                        if(ordeR.length > 0){
                            setCustomers(ordeR)
                            
                            setFetched(false)
                        }
                        // const Name = response.data.farmerData.email.split('@')[0]
                        const Name = response.data.farmerData.firstName
                        const eMail = data.email
                        if(Name){
                            setFarmerName(Name)
                            setFarmerEmail(eMail)
                            setFarmerEmail(eMail)
                            setFetchFarm(false)

                        }
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
    },[AcceptBool])

    const HandleOpen = async (BuyerId, order_id) => {
        console.log(BuyerId);
        setBuyerID(BuyerId)
        console.log("OrderId:", order_id);
        setFarmerID(order_id)
        const farmerID = localStorage.getItem('FarmerId')
    
        try {
            const response = await axios.get(`${API_BASE_URL}/currentUserDataOrder?farmerId=${farmerID}&orderId=${order_id}`);
            
            if (response.status === 200) {
                console.log("RES1: ", response.data.ProductData);
                // Update state with the fetched order data
                const data = response.data.ProductData
                
                setSelectedProductData(response.data.ProductData);
                // console.log("YEY",selectedProductData)
                const Title = data.title
                // console.log("Title: ",Title)
                // setProTitle(Title)
                // console.log(ProTitle)
            }
            const response2 = await axios.get(`${API_BASE_URL}/currentUserData?userId=${BuyerId}`);
            
            if (response2.status === 200) {
                console.log("RES2: ", response2.data.userData);
                // Update state with the fetched order data
                const Udata = response2.data.userData
                console.log("Udata: ",Udata)
                setSelectedBuyerData(Udata)
                setOpenCustomer(Udata)
                if(Udata){
                    setShowSelectData(false)
                }
                if (Udata.address && Udata.address.length > 0) {
                    const Uaddress = Udata.address[0];
                    console.log(Uaddress);
                    setUserAddress(Uaddress);
                } else {
                    console.log("No address found for this user");
                    setUserAddress(null); // Or handle accordingly
                }
                // console.log("YEY",Udata)
                // const Uaddress = Udata.farmLocation[0]
                // console.log(Uaddress)
                // setUserAddress(Uaddress)
                setSelectOrderBool(true)
            }
        } catch (err) {
            console.log("Error: ",err);
        }
    };

    const HandleAccept = async ()=>{
        
            try{
                const FarmeRID = localStorage.getItem('FarmerId')
                const response = await axios.post(`${API_BASE_URL}/orderUpdateFarmerAccept?farmerId=${FarmeRID}&orderId=${FarmerID}`)
                const responseU = await axios.post(`${API_BASE_URL}/orderUpdateUserAccept?userId=${BuyerID}&orderId=${selectedProductData.userOrder}`)
                console.log("UserId",BuyerID)
                console.log("UserOrder",selectedProductData.userOrder)

                if(response.status === 200 && responseU.status === 200){
                    setAcceptBool(prev => !prev)
                    console.log("Accepted Order")
                    toast.success(`${selectedProductData.title} is accepted`)
                }
            }catch(err){
                if (err.response && err.response.status === 404) {
                    toast.success('Already Accepted');
                    console.log("Already Accepted");
                } else {
                    console.log("Error in HandleAccept", err);
                }                
            }
        }
        
    

    return (
        <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex flex-col lg:flex-row h-screen">
        {/* Sidebar */}
        <div className=" w-full lg:w-1/4 bg-gray-100 p-4 border-r border-gray-200">
            {/* Profile */}
            <div className="flex items-center p-2 mb-4">
            <img src='data:image/png;base64,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'
            alt="User" className="w-10 h-10 rounded-full" />
            <div className="ml-4">
                {
                    fetchFarm ? <>
                        <h2 className="text-sm font-semibold">{localStorage.getItem('role') === 'Supplier' ? 'Kisan Seva Kendra' : 'Farmer Name'}</h2>
                        <p className="text-xs text-gray-500">{farmerEmail || 'Loading...'}</p>
                    </>
                        :
                        <>
                            <h2 className="text-sm font-semibold flex items-center gap-1.5 flex-wrap">
                                <span>{localStorage.getItem('role') === 'Supplier' ? (FarmerAllData.farmName || farmerName || 'Kisan Seva Kendra') : farmerName}</span>
                                {localStorage.getItem('role') === 'Supplier' && (
                                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold border border-amber-300">
                                        🏪 Kendra
                                    </span>
                                )}
                            </h2>
                            <p className="text-xs text-gray-500">{farmerEmail}</p>
                        </>
                }
            </div>
            </div>
            {/* Chat List */}
            <div>
            <input
                type="text"
                placeholder="Search..."
                className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            />
            <ul className=''>
                {fetched ? (
                    <>No Orders Till Now!!</> // You can replace this with a loading spinner or a message if needed
                ) : (
                    customers.slice().reverse().map((name, idx) => (
                        <li
                            key={idx}
                            className=" flex items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer mb-2"
                            onClick={() => HandleOpen(name.buyerId,name._id)}
                        >
                            <img 
                            src="data:image/png;base64,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" 
                            alt={name.title} className="w-10 h-10 rounded-full" />
                            <div className="ml-3">
                                <div className='flex gap-x-3'>
                                    <h3 className="text-sm font-medium">{name.title}</h3>
                                    <h3 className="text-sm font-medium">Order: <span className={`${name.status === 'Accepted!' ? 'text-green-600' : 'text-red-600'}`}>{name.status}</span></h3>
                                </div>
                                {/* <h3 className="text-sm font-medium">_id: {name.buyerId}</h3> */}
                                <p className="text-xs text-gray-500">OrderDate: {name.orderDate.slice(0,10)}</p>
                                <p className="text-xs text-gray-500">Time: {name.orderDate.slice(11,19)}</p>
                                <p className="text-xs text-gray-500">Day: {name.orderDate.slice(10,11)}</p>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            </div>
        </div>

        {/* ── Chat Panel ── */}
        <div className="w-full lg:w-2/4 flex flex-col bg-white border-r border-emerald-100">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 flex items-center justify-center text-white font-bold text-base uppercase flex-shrink-0">
                    {OpenCustomer.firstName?.[0] || '?'}
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-800">{OpenCustomer.firstName || 'Select an order'}</h2>
                    <p className="text-xs text-gray-400">{OpenCustomer.email}</p>
                    <p className="text-xs text-gray-400">{OpenCustomer.phoneNumber}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                {/* Incoming order message */}
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">📦</div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] shadow-sm">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {ShowSelectData ? (
                                <span className="text-gray-400 italic">Select an order from the sidebar to view details.</span>
                            ) : (
                                <>The order request is for{' '}
                                    <span className="font-semibold text-emerald-700">{selectedProductData.quantity}kg</span> of{' '}
                                    <span className="font-semibold text-emerald-700">{selectedProductData.title}</span> priced at{' '}
                                    <span className="font-semibold text-emerald-700">₹{selectedProductData.price}</span>, deliver to{' '}
                                    <span className="font-semibold text-emerald-700">Pincode-{UserAddress.pincode}, {UserAddress.district}, {UserAddress.state}</span>.
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                {!ShowSelectData && (
                    <div className="flex justify-end gap-3">
                        <button
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-lime-500 text-white text-sm font-semibold rounded-xl shadow-md hover:scale-105 transition-all duration-200"
                            onClick={HandleAccept}
                        >
                            ✓ Accept
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold rounded-xl transition-all duration-200">
                            ✕ Decline
                        </button>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t border-emerald-100 px-4 py-3">
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                    <button className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors">Send</button>
                </div>
            </div>
        </div>

        {/* ── Right Info Panel ── */}
        <div className="hidden lg:flex lg:w-1/4 flex-col bg-white p-5 gap-4 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold">Order Info</p>

            {/* Customer card */}
            <div className="bg-gradient-to-br from-emerald-50 to-lime-50 border border-emerald-100 rounded-[18px] p-4">
                <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2">Customer</p>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 flex items-center justify-center text-white font-bold uppercase flex-shrink-0">
                        {OpenCustomer.firstName?.[0] || '?'}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{OpenCustomer.firstName}</p>
                        <p className="text-xs text-gray-400 truncate">{OpenCustomer.email}</p>
                        <p className="text-xs text-gray-400">{OpenCustomer.phoneNumber}</p>
                    </div>
                </div>
            </div>

            {/* Seller address */}
            <div className="bg-white border border-emerald-100 rounded-[18px] p-4 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2">🏡 Seller Address</p>
                <p className="text-sm font-medium text-gray-700">{FarmerAllData.farmName}</p>
                <p className="text-xs text-gray-500 mt-1">
                    Pincode: {FarmAddress.pincode}<br />
                    {FarmAddress.district}, {FarmAddress.state}
                </p>
            </div>

            {/* Delivery address */}
            <div className="bg-white border border-emerald-100 rounded-[18px] p-4 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2">📍 Delivery Address</p>
                <p className="text-sm font-medium text-gray-700">📞 {OpenCustomer.phoneNumber}</p>
                <p className="text-xs text-gray-500 mt-1">
                    Pincode: {UserAddress.pincode}<br />
                    {UserAddress.district}, {UserAddress.state}
                </p>
            </div>
        </div>
        <Toaster/>
        </div>
    );
};

export default OrderMessage;
