import React, { useEffect, useState } from 'react'
import WeatherDashboard from '../component2/WeatherDashboard';
import axios from 'axios';
import { API_BASE_URL } from '../config';


function Weather2() {
    const [Pincode,setPincode] = useState('')

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
                        const pincOde = data.farmLocation[0].pincode
                        // console.log("Pin",pincOde)
                        setPincode(pincOde)
                        // setCurrentUser(data)
                        // const Name = response.data.farmerData.email.split('@')[0]
                        // setCurrentName(Name)
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
    },[])
    // USER-DATA----
    useEffect(()=>{
        const fetch = async ()=>{
            try{
                const userID = localStorage.getItem('UserId')
                if(userID){
                    const response = await axios.get(`${API_BASE_URL}/currentUserData?userId=${userID}`)
                    if(response.status === 200){
                        const data = response.data.userData
                        console.log("User: ",data)
                        const pincOde = data.address[0].pincode
                        console.log("PinU: ",pincOde)
                        setPincode(pincOde)
                        // setCurrentUser(data)
                        const Name = response.data.userData.email.split('@')[0]
                        // console.log(Name)
                        // setCurrentName(Name)
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
    },[])

    // const [pincoDe,setPincode] = useState('')
    const pincoDe = localStorage.getItem('')
    return (
        <>
            <WeatherDashboard pincode={Pincode}/>
        </>
    );
}

export default Weather2;