import React, { useEffect, useState } from 'react';
import WeatherDashboard from '../component2/WeatherDashboard';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function Weather2() {
  const [pincode, setPincode] = useState('');

  // Fetch Farmer Data for pincode
  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const farmerID = localStorage.getItem('FarmerId');
        if (farmerID) {
          const response = await axios.get(`${API_BASE_URL}/currentFarmerData?FarmerID=${farmerID}`);
          if (response.status === 200 && response.data.farmerData) {
            const loc = response.data.farmerData.farmLocation;
            if (loc && loc.length > 0 && loc[0].pincode) {
              setPincode(String(loc[0].pincode));
            }
          }
        }
      } catch (err) {
        // Non-critical if not logged in as farmer
      }
    };
    fetchFarmer();
  }, []);

  // Fetch User Data for pincode
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userID = localStorage.getItem('UserId');
        if (userID) {
          const response = await axios.get(`${API_BASE_URL}/currentUserData?userId=${userID}`);
          if (response.status === 200 && response.data.userData) {
            const addr = response.data.userData.address;
            if (addr && addr.length > 0 && addr[0].pincode) {
              setPincode(String(addr[0].pincode));
            }
          }
        }
      } catch (err) {
        // Non-critical if not logged in as user
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <WeatherDashboard pincode={pincode} />
    </div>
  );
}

export default Weather2;